import type { Analytics } from 'firebase/analytics'

/**
 * Analytics Event Queue
 *
 * Events are queued when analytics isn't ready yet, then flushed
 * once the Firebase Analytics SDK is loaded.
 */
interface QueuedEvent {
  eventName: string
  eventParams?: Record<string, any>
  timestamp: number
}

// Event queue for events fired before analytics is ready
const eventQueue: QueuedEvent[] = []
const MAX_QUEUE_SIZE = 100

// Global analytics instance reference (set by FirebaseProvider)
let globalAnalyticsInstance: Analytics | null = null

// Flag to track if logEvent function is available
let logEventFn: ((analytics: Analytics, eventName: string, eventParams?: Record<string, any>) => void) | null = null

/**
 * Set the global analytics instance (called by FirebaseProvider after lazy load)
 */
export const setAnalyticsInstance = (analytics: Analytics) => {
  globalAnalyticsInstance = analytics
}

/**
 * Lazy load the logEvent function
 */
const getLogEvent = async () => {
  if (!logEventFn) {
    const { logEvent } = await import('firebase/analytics')
    logEventFn = logEvent
  }
  return logEventFn
}

/**
 * Flush queued events once analytics is ready
 */
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
      } catch (error) {
        console.error('[Analytics] Failed to flush event:', event.eventName, error)
      }
    }
  }
}

/**
 * Queue an event if analytics isn't ready yet
 */
const queueEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (eventQueue.length >= MAX_QUEUE_SIZE) {
    // Remove oldest event to make room
    eventQueue.shift()
  }

  eventQueue.push({
    eventName,
    eventParams,
    timestamp: Date.now()
  })

  if (import.meta.env.DEV) {
    console.log('[Analytics] Event queued:', eventName)
  }
}

/**
 * Track an event - queues if analytics not ready
 */
const trackEvent = async (
  analytics: Analytics | null,
  eventName: string,
  eventParams?: Record<string, any>
) => {
  // Use provided analytics or global instance
  const instance = analytics || globalAnalyticsInstance

  if (!instance) {
    // Queue event for later
    queueEvent(eventName, eventParams)
    return
  }

  try {
    const logEvent = await getLogEvent()
    logEvent(instance, eventName, eventParams)
  } catch (error) {
    console.error('[Analytics] Failed to track event:', eventName, error)
    // Queue for retry
    queueEvent(eventName, eventParams)
  }
}

// Enhanced error tracking with normalization and deduplication
const errorCache = new Set<string>();
const CACHE_EXPIRY = 60000; // 1 minute

// Clear error cache periodically to prevent memory leaks
setInterval(() => {
  errorCache.clear();
}, CACHE_EXPIRY);

// Normalize error messages for better grouping
const normalizeErrorMessage = (message: string): string => {
  if (!message || typeof message !== 'string') {
    return 'Unknown error';
  }

  // Clean up common error patterns
  return message
    .replace(/0x[a-fA-F0-9]{40,64}/g, '0x<ADDRESS>') // Replace addresses
    .replace(/\"[^\"]*\"/g, '"<STRING>"') // Replace quoted strings
    .replace(/\d{13,}/g, '<TIMESTAMP>') // Replace timestamps
    .replace(/\d+\.\d+/g, '<DECIMAL>') // Replace decimal numbers
    .replace(/\d+/g, '<NUMBER>') // Replace large numbers
    .trim();
};

// Helper function to check if analytics is available
const isAnalyticsReady = (analytics: Analytics | null): boolean => {
  if (typeof window === 'undefined') {
    console.warn('[Analytics] Not in browser environment');
    return false;
  }

  const instance = analytics || globalAnalyticsInstance
  if (!instance) {
    // Not an error - we'll queue the event
    return false;
  }

  return true;
};

// Page tracking
// Sends GA4's standard page_location / page_path alongside the legacy page_name
export const trackPageView = (analytics: Analytics | null, pageName: string) => {
  trackEvent(analytics, 'page_view', {
    page_name: pageName,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined
  })
}

// Token creation tracking
export const trackTokenCreation = (analytics: Analytics | null, tokenData: {
  name: string
  symbol: string
  supply: string
  network: string
}) => {
  trackEvent(analytics, 'token_created', {
    token_name: tokenData.name,
    token_symbol: tokenData.symbol,
    total_supply: tokenData.supply,
    network: tokenData.network
  })
}

export const trackTokenResult = (analytics: Analytics | null, result: {
  success: boolean
  tokenAddress?: string
  error?: string
}) => {
  trackEvent(analytics, 'token_deployment_result', {
    success: result.success,
    token_address: result.tokenAddress,
    error: result.error
  })
}

// Liquidity tracking
export const trackLiquidityAdded = (analytics: Analytics | null, data: {
  tokenAddress: string
  tokenAmount: string
  ethAmount: string
  network: string
}) => {
  trackEvent(analytics, 'liquidity_added', {
    token_address: data.tokenAddress,
    token_amount: data.tokenAmount,
    eth_amount: data.ethAmount,
    network: data.network
  })
}

export const trackLiquidityRemoved = (analytics: Analytics | null, data: {
  tokenAddress: string
  lpTokenAmount: string
  network: string
}) => {
  trackEvent(analytics, 'liquidity_removed', {
    token_address: data.tokenAddress,
    lp_token_amount: data.lpTokenAmount,
    network: data.network
  })
}

// User interaction tracking
export const trackWalletConnect = (analytics: Analytics | null, walletType: string) => {
  trackEvent(analytics, 'wallet_connected', {
    wallet_type: walletType
  })
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
    from_network: fromNetwork,
    to_network: toNetwork,
    ...additionalParams
  })
}

// Enhanced error tracking with deduplication and comprehensive context
export const trackError = (
  analytics: Analytics | null,
  errorMessage: string,
  errorLocation: string,
  additionalContext: Record<string, any> = {}
) => {
  if (import.meta.env.DEV) {
    console.log('[Analytics] trackError called:', { errorMessage, errorLocation, additionalContext });
  }

  // Ensure we have valid parameters
  const normalizedMessage = normalizeErrorMessage(errorMessage);
  const location = errorLocation || 'unknown_location';

  // Create a unique key for deduplication
  const errorKey = `${normalizedMessage}::${location}`;

  // Skip if we've seen this exact error recently
  if (errorCache.has(errorKey)) {
    if (import.meta.env.DEV) {
      console.log('[Analytics] Duplicate error blocked:', errorKey);
    }
    return;
  }

  // Add to cache to prevent duplicates
  errorCache.add(errorKey);

  const errorData = {
    error_message: normalizedMessage,
    error_location: location,
    original_message: errorMessage,
    timestamp: Date.now(),
    page_path: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    ...additionalContext
  };

  trackEvent(analytics, 'error_occurred', errorData);

  if (import.meta.env.DEV) {
    console.log('[Analytics] Error tracked:', errorData);
  }
};

// Legacy function for backward compatibility
export const trackErrorLegacy = (analytics: Analytics | null, errorData: {
  error_type: string
  error_message: string
  error_location: string
  user_action?: string
}) => {
  trackError(analytics, errorData.error_message, errorData.error_location, {
    error_type: errorData.error_type,
    user_action: errorData.user_action
  });
}

// Enhanced tracking functions for specific scenarios
export const trackWalletError = (analytics: Analytics | null, errorMessage: string, action: string) => {
  trackError(analytics, errorMessage, 'wallet_connection_error', {
    error_type: 'wallet_error',
    user_action: action,
    attempted_action: action
  });
};

export const trackTokenCreationError = (analytics: Analytics | null, error: any, tokenData: any = {}) => {
  trackError(analytics, error.message || error.toString(), 'token_creation_error', {
    error_type: 'token_creation_failure',
    token_name: tokenData.name,
    token_symbol: tokenData.symbol,
    token_supply: tokenData.supply,
    network: tokenData.network,
    error_code: error.code,
    error_stack: error.stack?.split('\n')[0] || 'No stack trace',
    full_error_message: error.toString()
  });
};

export const trackLiquidityError = (analytics: Analytics | null, error: any, liquidityData: any = {}) => {
  trackError(analytics, error.message || error.toString(), 'liquidity_operation_error', {
    error_type: 'liquidity_error',
    token_address: liquidityData.tokenAddress,
    token_amount: liquidityData.tokenAmount,
    eth_amount: liquidityData.ethAmount,
    operation_type: liquidityData.operationType || 'add_liquidity',
    network: liquidityData.network,
    error_code: error.code,
    error_stack: error.stack?.split('\n')[0] || 'No stack trace',
    full_error_message: error.toString()
  });
};

export const trackNetworkError = (analytics: Analytics | null, error: any, context: string = 'unknown') => {
  trackError(analytics, error.message || error.toString(), `network_error_${context}`, {
    error_type: 'network_error',
    context: context,
    error_code: error.code,
    error_stack: error.stack?.split('\n')[0] || 'No stack trace',
    full_error_message: error.toString()
  });
};

// User engagement tracking
export const trackButtonClick = (analytics: Analytics | null, buttonName: string, location: string) => {
  trackEvent(analytics, 'button_clicked', {
    button_name: buttonName,
    location: location
  })
}

export const trackFormSubmission = (analytics: Analytics | null, formName: string, success: boolean) => {
  trackEvent(analytics, 'form_submitted', {
    form_name: formName,
    success: success
  })
}

/**
 * Generic event logging wrapper
 * Use this for custom events in components
 *
 * Note: This is a re-export for backward compatibility.
 * The function is loaded lazily, so it may not be immediately available.
 * Prefer using the typed track* functions above.
 */
export const logEvent = async (
  analytics: Analytics | null,
  eventName: string,
  eventParams?: Record<string, any>
) => {
  // Use trackEvent which handles null analytics and queuing
  await trackEvent(analytics, eventName, eventParams)
}
