import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { Analytics } from 'firebase/analytics'
import { loadFirebaseAnalytics, isFirebaseConfigured } from '../config/firebase'
import { flushEventQueue, setAnalyticsInstance } from '../utils/analytics'

interface FirebaseContextType {
  analytics: Analytics | null
  isLoading: boolean
}

const FirebaseContext = createContext<FirebaseContextType>({
  analytics: null,
  isLoading: true
})

export const useFirebaseAnalytics = () => {
  const context = useContext(FirebaseContext)
  return context.analytics
}

export const useFirebaseContext = () => {
  return useContext(FirebaseContext)
}

/**
 * Delay execution using requestIdleCallback with setTimeout fallback
 * This ensures Firebase loads only when the browser is idle
 */
const deferExecution = (callback: () => void, delay: number = 2000): void => {
  // First wait for the specified delay
  setTimeout(() => {
    // Then use requestIdleCallback if available
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(callback, { timeout: 5000 })
    } else {
      // Fallback for Safari and older browsers
      setTimeout(callback, 0)
    }
  }, delay)
}

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analyticsInstance, setAnalyticsInstanceState] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const initializationStarted = useRef(false)

  const initializeAnalytics = useCallback(async () => {
    // Prevent double initialization
    if (initializationStarted.current) return
    initializationStarted.current = true

    // Skip if Firebase isn't configured
    if (!isFirebaseConfigured()) {
      setIsLoading(false)
      return
    }

    try {
      const analytics = await loadFirebaseAnalytics()

      if (analytics) {
        setAnalyticsInstanceState(analytics)
        setAnalyticsInstance(analytics) // Set global reference for queued events
        flushEventQueue() // Process any queued events
      }
    } catch (error) {
      console.error('[FirebaseProvider] Failed to initialize analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Defer Firebase loading until after the app is interactive
    // This improves initial page load by ~150KB
    deferExecution(initializeAnalytics, 2000)

    // Also trigger on user interaction for faster initialization
    const handleInteraction = () => {
      initializeAnalytics()
      // Remove listeners after first interaction
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }

    window.addEventListener('click', handleInteraction, { passive: true, once: true })
    window.addEventListener('scroll', handleInteraction, { passive: true, once: true })
    window.addEventListener('keydown', handleInteraction, { passive: true, once: true })

    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
  }, [initializeAnalytics])

  return (
    <FirebaseContext.Provider value={{ analytics: analyticsInstance, isLoading }}>
      {children}
    </FirebaseContext.Provider>
  )
}
