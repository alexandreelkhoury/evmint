/**
 * Firebase Configuration - Deferred Loading
 *
 * Firebase Analytics is lazy-loaded to improve initial page load performance.
 * The SDK (~150KB) is loaded after the app becomes interactive.
 */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase config in development
if (import.meta.env.DEV) {
  const missingVars: string[] = []
  if (!firebaseConfig.apiKey) missingVars.push('VITE_FIREBASE_API_KEY')
  if (!firebaseConfig.authDomain) missingVars.push('VITE_FIREBASE_AUTH_DOMAIN')
  if (!firebaseConfig.projectId) missingVars.push('VITE_FIREBASE_PROJECT_ID')

  if (missingVars.length > 0) {
    console.warn('[Firebase] Missing environment variables:', missingVars.join(', '))
    console.warn('[Firebase] Analytics will be disabled. Add these to your .env file.')
  }
}

/**
 * Check if Firebase config is valid
 */
export const isFirebaseConfigured = (): boolean => {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId)
}

/**
 * Lazy load Firebase Analytics
 * Returns a promise that resolves to the Analytics instance or null
 */
export const loadFirebaseAnalytics = async (): Promise<import('firebase/analytics').Analytics | null> => {
  if (!isFirebaseConfigured()) {
    console.warn('[Firebase] Skipping initialization due to missing configuration')
    return null
  }

  // Skip analytics on localhost / dev — only track on production domain
  const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')
  if (!isProduction) {
    return null
  }

  try {
    // Dynamic imports - these won't be in the initial bundle
    const [{ initializeApp }, { getAnalytics, isSupported }] = await Promise.all([
      import('firebase/app'),
      import('firebase/analytics')
    ])

    // Check if analytics is supported in this environment
    const supported = await isSupported()
    if (!supported) {
      console.warn('[Firebase] Analytics not supported in this environment')
      return null
    }

    // Initialize Firebase app and analytics
    const app = initializeApp(firebaseConfig)
    const analytics = getAnalytics(app)

    loggers.ui.debug('Firebase Analytics initialized')
    return analytics
  } catch (error) {
    console.error('[Firebase] Failed to initialize analytics:', error)
    return null
  }
}

// For backward compatibility - these are now null/undefined by default
// Use the lazy loading approach instead
export const app = null
export const analytics = null
