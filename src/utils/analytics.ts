import type { Analytics } from 'firebase/analytics'

// ─── Event Queue ────────────────────────────────────────────────────────────
interface QueuedEvent {
  eventName: string
  eventParams?: Record<string, any>
  timestamp: number
}

const eventQueue: QueuedEvent[] = []
const MAX_QUEUE_SIZE = 100

let globalAnalyticsInstance: Analytics | null = null
let logEventFn: ((analytics: Analytics, eventName: string, eventParams?: Record<string, any>) => void) | null = null

export const setAnalyticsInstance = (analytics: Analytics) => {
  globalAnalyticsInstance = analytics
}

const getLogEvent = async () => {
  if (!logEventFn) {
    const { logEvent } = await import('firebase/analytics')
    logEventFn = logEvent
  }
  return logEventFn
}

export const flushEventQueue = async () => {
  if (!globalAnalyticsInstance || eventQueue.length === 0) return
  const logEvent = await getLogEvent()
  if (import.meta.env.DEV) console.log(`[Analytics] Flushing ${eventQueue.length} queued events`)
  while (eventQueue.length > 0) {
    const event = eventQueue.shift()
    if (event) {
      try {
        logEvent(globalAnalyticsInstance, event.eventName, {
          ...event.eventParams,
          queued: true,
          queue_delay_ms: Date.now() - event.timestamp
        })
      } catch { /* silent */ }
    }
  }
}

const queueEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (eventQueue.length >= MAX_QUEUE_SIZE) eventQueue.shift()
  eventQueue.push({ eventName, eventParams, timestamp: Date.now() })
  if (import.meta.env.DEV) console.log('[Analytics] Event queued:', eventName)
}

// ─── Core tracking ──────────────────────────────────────────────────────────
const trackEvent = async (
  analytics: Analytics | null,
  eventName: string,
  eventParams?: Record<string, any>
) => {
  const instance = analytics || globalAnalyticsInstance
  if (!instance) {
    queueEvent(eventName, eventParams)
    return
  }
  try {
    const logEvent = await getLogEvent()
    logEvent(instance, eventName, eventParams)
  } catch {
    queueEvent(eventName, eventParams)
  }
}

// ─── Analytics readiness guard ──────────────────────────────────────────────
export const isAnalyticsReady = (analytics?: Analytics | null): boolean => {
  if (typeof window === 'undefined') return false
  return !!(analytics || globalAnalyticsInstance)
}

// ─── Traffic source persistence ─────────────────────────────────────────────
export const persistTrafficSource = () => {
  try {
    if (typeof window === 'undefined') return
    // Only persist once per session
    if (sessionStorage.getItem('traffic_source')) return

    const params = new URLSearchParams(window.location.search)
    const source = params.get('utm_source') || ''
    const medium = params.get('utm_medium') || ''
    const campaign = params.get('utm_campaign') || ''
    const referrer = document.referrer || ''

    // Derive source from referrer if no UTM
    let derivedSource = source
    let derivedMedium = medium
    if (!source && referrer) {
      try {
        const refHost = new URL(referrer).hostname
        if (refHost.includes('google')) { derivedSource = 'google'; derivedMedium = derivedMedium || 'organic' }
        else if (refHost.includes('twitter') || refHost.includes('x.com')) { derivedSource = 'twitter'; derivedMedium = derivedMedium || 'social' }
        else if (refHost.includes('telegram')) { derivedSource = 'telegram'; derivedMedium = derivedMedium || 'social' }
        else if (refHost.includes('reddit')) { derivedSource = 'reddit'; derivedMedium = derivedMedium || 'social' }
        else { derivedSource = refHost; derivedMedium = derivedMedium || 'referral' }
      } catch { /* invalid referrer URL */ }
    }
    if (!derivedSource) { derivedSource = 'direct'; derivedMedium = 'none' }

    sessionStorage.setItem('traffic_source', JSON.stringify({
      source: derivedSource.slice(0, 90),
      medium: derivedMedium.slice(0, 90),
      campaign: campaign.slice(0, 90),
      referrer: referrer.slice(0, 90),
    }))
  } catch { /* sessionStorage unavailable */ }
}

export const getTrafficSource = (): { source: string; medium: string; campaign: string; referrer: string } => {
  try {
    const raw = sessionStorage.getItem('traffic_source')
    if (raw) return JSON.parse(raw)
  } catch { /* silent */ }
  return { source: 'direct', medium: 'none', campaign: '', referrer: '' }
}

// ─── Error handling ─────────────────────────────────────────────────────────
const errorCache = new Set<string>()
const CACHE_EXPIRY = 60000
setInterval(() => { errorCache.clear() }, CACHE_EXPIRY)

const normalizeErrorMessage = (message: string): string => {
  if (!message || typeof message !== 'string') return 'Unknown error'
  return message
    .replace(/0x[a-fA-F0-9]{40,64}/g, '0x…')
    .replace(/\d{13,}/g, '<TS>')
    .replace(/\d+\.\d+/g, '<N>')
    .replace(/\b\d{4,}\b/g, '<N>')
    .trim()
    .slice(0, 95)
}

// Error code mapping
const ERROR_CODES: Record<string, string> = {
  'insufficient funds': 'INSUFFICIENT_BALANCE',
  'insufficient balance': 'INSUFFICIENT_BALANCE',
  'user rejected': 'USER_REJECTED',
  'user denied': 'USER_REJECTED',
  'cancelled by user': 'USER_REJECTED',
  'transaction was rejected': 'USER_REJECTED',
  'expired': 'TX_EXPIRED',
  'deadline': 'TX_EXPIRED',
  'simulation failed': 'TX_SIM_FAILED',
  'execution reverted': 'TX_SIM_FAILED',
  'network': 'NETWORK_ERROR',
  'timeout': 'NETWORK_ERROR',
  'disconnected': 'WALLET_NOT_CONNECTED',
  'not connected': 'WALLET_NOT_CONNECTED',
  'no provider': 'WALLET_NOT_CONNECTED',
}

const classifyError = (message: string): string => {
  const lower = message.toLowerCase()
  for (const [pattern, code] of Object.entries(ERROR_CODES)) {
    if (lower.includes(pattern)) return code
  }
  return 'UNKNOWN'
}

// ─── Page tracking ──────────────────────────────────────────────────────────
export const trackPageView = (analytics: Analytics | null, pageName: string) => {
  const traffic = getTrafficSource()
  trackEvent(analytics, 'page_view', {
    page_name: pageName,
    page_location: typeof window !== 'undefined' ? window.location.href.slice(0, 95) : undefined,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    traffic_source: traffic.source,
    traffic_medium: traffic.medium,
  })
}

// ─── Conversion funnel ──────────────────────────────────────────────────────
export const trackFunnelStep = (
  analytics: Analytics | null,
  step: string,
  params: Record<string, any> = {}
) => {
  const traffic = getTrafficSource()
  trackEvent(analytics, step, {
    ...params,
    traffic_source: traffic.source,
    traffic_medium: traffic.medium,
    funnel_step: step,
  })
}

// ─── Token creation tracking ────────────────────────────────────────────────
export const trackTokenCreation = (analytics: Analytics | null, tokenData: {
  name: string; symbol: string; supply: string; network: string
}) => {
  // Fire as funnel step
  trackFunnelStep(analytics, 'token_created_success', {
    token_name: tokenData.name.slice(0, 90),
    token_symbol: tokenData.symbol.slice(0, 10),
    total_supply: tokenData.supply.slice(0, 30),
    network: tokenData.network.slice(0, 30),
  })
  // Fire as dedicated top-level event
  trackEvent(analytics, 'token_created', {
    token_name: tokenData.name.slice(0, 90),
    token_symbol: tokenData.symbol.slice(0, 10),
    total_supply: tokenData.supply.slice(0, 30),
    network: tokenData.network.slice(0, 30),
  })
}

export const trackTokenResult = (analytics: Analytics | null, result: {
  success: boolean; tokenAddress?: string; error?: string
}) => {
  trackEvent(analytics, 'token_deployment_result', {
    success: result.success,
    token_address: result.tokenAddress?.slice(0, 42),
    error: result.error?.slice(0, 95),
  })
}

// ─── Liquidity tracking ─────────────────────────────────────────────────────
export const trackLiquidityAdded = (analytics: Analytics | null, data: {
  tokenAddress: string; tokenAmount: string; ethAmount: string; network: string
}) => {
  trackEvent(analytics, 'liquidity_added', {
    token_address: data.tokenAddress,
    token_amount: data.tokenAmount.slice(0, 30),
    eth_amount: data.ethAmount.slice(0, 30),
    network: data.network,
  })
}

export const trackLiquidityRemoved = (analytics: Analytics | null, data: {
  tokenAddress: string; lpTokenAmount: string; network: string
}) => {
  trackEvent(analytics, 'liquidity_removed', {
    token_address: data.tokenAddress,
    lp_token_amount: data.lpTokenAmount.slice(0, 30),
    network: data.network,
  })
}

// ─── User interaction tracking ──────────────────────────────────────────────
export const trackWalletConnect = (analytics: Analytics | null, walletType: string) => {
  trackFunnelStep(analytics, 'wallet_connected', { wallet_type: walletType.slice(0, 50) })
}

export const trackWalletDisconnect = (analytics: Analytics | null) => {
  trackEvent(analytics, 'wallet_disconnected', {})
}

export const trackNetworkSwitch = (
  analytics: Analytics | null,
  fromNetwork: string,
  toNetwork: string,
  additionalParams: Record<string, any> = {}
) => {
  trackEvent(analytics, 'network_switched', {
    from_network: fromNetwork.slice(0, 30),
    to_network: toNetwork.slice(0, 30),
    ...additionalParams,
  })
}

// ─── Error tracking (with dedup + normalization) ────────────────────────────
export const trackError = (
  analytics: Analytics | null,
  errorMessage: string,
  errorLocation: string,
  additionalContext: Record<string, any> = {}
) => {
  const normalizedMessage = normalizeErrorMessage(errorMessage)
  const location = (errorLocation || 'unknown').slice(0, 50)
  const errorCode = classifyError(errorMessage)

  const errorKey = `${normalizedMessage}::${location}`
  if (errorCache.has(errorKey)) return
  errorCache.add(errorKey)

  trackEvent(analytics, 'error_occurred', {
    error_message: normalizedMessage,
    error_location: location,
    error_code: errorCode,
    page_path: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
    ...additionalContext,
  })

  // Fire dedicated event for balance errors (high-value signal)
  if (errorCode === 'INSUFFICIENT_BALANCE') {
    trackEvent(analytics, 'insufficient_balance', {
      error_location: location,
      page_path: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      ...additionalContext,
    })
  }

  if (import.meta.env.DEV) {
    console.log('[Analytics] Error tracked:', { normalizedMessage, location, errorCode })
  }
}

export const trackWalletError = (analytics: Analytics | null, errorMessage: string, action: string) => {
  trackError(analytics, errorMessage, 'wallet_error', {
    user_action: action.slice(0, 50),
  })
}

export const trackTokenCreationError = (analytics: Analytics | null, error: any, tokenData: any = {}) => {
  trackFunnelStep(analytics, 'token_creation_failed', {
    error_message: normalizeErrorMessage(error.message || error.toString()),
    error_code: classifyError(error.message || ''),
    token_name: tokenData.name?.slice(0, 50),
    token_symbol: tokenData.symbol?.slice(0, 10),
    network: tokenData.network?.slice(0, 30),
  })
  trackError(analytics, error.message || error.toString(), 'token_creation', {
    token_name: tokenData.name?.slice(0, 50),
    token_symbol: tokenData.symbol?.slice(0, 10),
    network: tokenData.network?.slice(0, 30),
  })
}

export const trackLiquidityError = (analytics: Analytics | null, error: any, liquidityData: any = {}) => {
  trackError(analytics, error.message || error.toString(), 'liquidity_operation', {
    operation_type: liquidityData.operationType?.slice(0, 30),
    token_address: liquidityData.tokenAddress?.slice(0, 42),
    network: liquidityData.network?.slice(0, 30),
  })
}

export const trackNetworkError = (analytics: Analytics | null, error: any, context: string = 'unknown') => {
  trackError(analytics, error.message || error.toString(), `network_${context}`, {
    context: context.slice(0, 30),
  })
}

// ─── Button / form tracking ─────────────────────────────────────────────────
export const trackButtonClick = (analytics: Analytics | null, buttonName: string, location: string) => {
  trackEvent(analytics, 'button_clicked', {
    button_name: buttonName.slice(0, 50),
    location: location.slice(0, 50),
  })
}

export const trackFormSubmission = (analytics: Analytics | null, formName: string, success: boolean) => {
  trackEvent(analytics, 'form_submitted', {
    form_name: formName.slice(0, 50),
    success,
  })
}

// ─── Post-conversion tracking ───────────────────────────────────────────────
export const trackCopyAction = (analytics: Analytics | null, target: string, source: string) => {
  trackEvent(analytics, 'copy_action', {
    copy_target: target.slice(0, 50),
    copy_source: source.slice(0, 50),
  })
}

export const trackSocialShare = (analytics: Analytics | null, platform: string, source: string) => {
  trackEvent(analytics, 'social_share', {
    platform: platform.slice(0, 30),
    share_source: source.slice(0, 50),
  })
}

export const trackSuccessModalCTA = (analytics: Analytics | null, ctaType: string, source: string) => {
  trackEvent(analytics, 'success_modal_cta', {
    cta_type: ctaType.slice(0, 50),
    cta_source: source.slice(0, 50),
  })
}

// ─── Engagement tracking ────────────────────────────────────────────────────
export const trackEngagement = (analytics: Analytics | null, action: string, location: string) => {
  trackEvent(analytics, action.slice(0, 40), {
    engagement_location: location.slice(0, 50),
  })
}

// ─── Generic event wrapper ──────────────────────────────────────────────────
export const logEvent = async (
  analytics: Analytics | null,
  eventName: string,
  eventParams?: Record<string, any>
) => {
  await trackEvent(analytics, eventName, eventParams)
}
