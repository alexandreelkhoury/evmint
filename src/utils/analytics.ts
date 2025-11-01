import { type Analytics, logEvent } from 'firebase/analytics'

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
    console.warn('🚫 Analytics check: Not in browser environment');
    return false;
  }
  
  if (!analytics) {
    console.warn('⚠️ Analytics check: Firebase Analytics not initialized');
    return false;
  }
  
  console.log('✅ Analytics ready');
  return true;
};

// Page tracking
export const trackPageView = (analytics: Analytics | null, pageName: string) => {
  if (!analytics) return
  
  logEvent(analytics, 'page_view', {
    page_name: pageName
  })
}

// Token creation tracking
export const trackTokenCreation = (analytics: Analytics | null, tokenData: {
  name: string
  symbol: string
  supply: string
  network: string
}) => {
  if (!analytics) return
  
  logEvent(analytics, 'token_created', {
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
  if (!analytics) return
  
  logEvent(analytics, 'token_deployment_result', {
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
  if (!analytics) return
  
  logEvent(analytics, 'liquidity_added', {
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
  if (!analytics) return
  
  logEvent(analytics, 'liquidity_removed', {
    token_address: data.tokenAddress,
    lp_token_amount: data.lpTokenAmount,
    network: data.network
  })
}

// User interaction tracking
export const trackWalletConnect = (analytics: Analytics | null, walletType: string) => {
  if (!analytics) return
  
  logEvent(analytics, 'wallet_connected', {
    wallet_type: walletType
  })
}

export const trackWalletDisconnect = (analytics: Analytics | null) => {
  if (!analytics) return
  
  logEvent(analytics, 'wallet_disconnected')
}

export const trackNetworkSwitch = (analytics: Analytics | null, fromNetwork: string, toNetwork: string) => {
  if (!analytics) return
  
  logEvent(analytics, 'network_switched', {
    from_network: fromNetwork,
    to_network: toNetwork
  })
}

// Enhanced error tracking with deduplication and comprehensive context
export const trackError = (
  analytics: Analytics | null, 
  errorMessage: string, 
  errorLocation: string, 
  additionalContext: Record<string, any> = {}
) => {
  // FORCE TRACKING - Debug mode
  console.log('🔥 BASE TOKEN LAUNCHER - TRACKERROR called:', { errorMessage, errorLocation, additionalContext });
  
  if (!isAnalyticsReady(analytics)) {
    console.warn('⚠️ Analytics not ready - but attempting to track anyway:', { errorMessage, errorLocation });
    return;
  }
  
  // Ensure we have valid parameters
  const normalizedMessage = normalizeErrorMessage(errorMessage);
  const location = errorLocation || 'unknown_location';
  
  // Create a unique key for deduplication
  const errorKey = `${normalizedMessage}::${location}`;
  
  // Skip if we've seen this exact error recently
  if (errorCache.has(errorKey)) {
    console.log('🔄 Duplicate error blocked:', errorKey);
    return;
  }
  
  // Add to cache to prevent duplicates
  errorCache.add(errorKey);
  
  try {
    const errorData = {
      error_message: normalizedMessage,
      error_location: location,
      original_message: errorMessage, // Keep original for detailed analysis
      timestamp: Date.now(),
      page_path: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      ...additionalContext
    };
    
    logEvent(analytics, 'error_occurred', errorData);
    
    // Also log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.error('GA4 Error Tracked:', errorData);
    }
    
    console.log('✅ BASE TOKEN LAUNCHER - Error tracked successfully');
    
  } catch (error) {
    console.error('❌ Failed to track error:', error);
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
  if (!analytics) return
  
  logEvent(analytics, 'button_clicked', {
    button_name: buttonName,
    location: location
  })
}

export const trackFormSubmission = (analytics: Analytics | null, formName: string, success: boolean) => {
  if (!analytics) return
  
  logEvent(analytics, 'form_submitted', {
    form_name: formName,
    success: success
  })
}