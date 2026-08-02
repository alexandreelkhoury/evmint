import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { colors, typography } from '../styles/designSystem'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  onClose?: (id: string) => void
}

export function Toast({ id, type, title, message, duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose?.(id), 300) // Allow animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, id, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose?.(id), 300)
  }

  const toastConfig = {
    success: {
      bg: colors.successBg,
      text: typography.success,
      icon: ''
    },
    error: {
      bg: colors.errorBg,
      text: typography.error,
      icon: ''
    },
    warning: {
      bg: colors.warningBg,
      text: typography.warning,
      icon: ''
    },
    info: {
      bg: colors.infoBg,
      text: typography.info,
      icon: ''
    }
  }

  const config = toastConfig[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
          className={`${config.bg} p-4 rounded-lg shadow-lg max-w-sm w-full`}
          role={type === 'error' ? 'alert' : 'status'}
          style={{
            background: type === 'success' ? 'rgba(5, 46, 22, 0.95)' : 
                       type === 'error' ? 'rgba(69, 10, 10, 0.95)' :
                       type === 'warning' ? 'rgba(69, 26, 3, 0.95)' :
                       'rgba(30, 58, 138, 0.95)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 
                                type === 'error' ? 'rgba(239, 68, 68, 0.3)' :
                                type === 'warning' ? 'rgba(245, 158, 11, 0.3)' :
                                'rgba(59, 130, 246, 0.3)'}`
          }}
        >
          <div className="flex items-start space-x-3">
            <span className="text-lg flex-shrink-0">{config.icon}</span>
            
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className={`${config.text} font-semibold text-sm mb-1`}>
                  {title}
                </h3>
              )}
              <p className={`${config.text} text-sm`}>
                {message}
              </p>
            </div>
            
            <button
              onClick={handleClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-gray-300 rounded transition-colors flex-shrink-0 -mr-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
              aria-label="Close notification"
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Toast Container Component
export interface ToastContainerProps {
  toasts: ToastProps[]
  onRemove: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export function ToastContainer({ toasts, onRemove, position = 'top-right' }: ToastContainerProps) {
  // Top positions clear the fixed header (h-14 / sm:h-16) instead of overlapping it
  const positionClasses = {
    'top-right': 'top-[4.5rem] right-4',
    'top-left': 'top-[4.5rem] left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-[99999] space-y-3 pointer-events-none`}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onRemove} />
        </div>
      ))}
    </div>
  )
}

// Hook for managing toasts
//
// Every returned function is memoised. These end up in the dependency arrays of
// effects that raise toasts, and an unstable `addToast` makes that a loop:
// effect fires -> setToasts -> re-render -> new addToast identity -> deps
// changed -> effect fires again. That shipped as a liquidity error toast
// re-appearing every few seconds until the user dismissed it by hand.
export function useToasts() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    setToasts(current => [...current, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(current => current.filter(toast => toast.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  const success = useCallback((message: string, title?: string) => addToast({ type: 'success', message, title }), [addToast])
  const error = useCallback((message: string, title?: string) => addToast({ type: 'error', message, title }), [addToast])
  const warning = useCallback((message: string, title?: string) => addToast({ type: 'warning', message, title }), [addToast])
  const info = useCallback((message: string, title?: string) => addToast({ type: 'info', message, title }), [addToast])

  return useMemo(
    () => ({ toasts, addToast, removeToast, clearAll, success, error, warning, info }),
    [toasts, addToast, removeToast, clearAll, success, error, warning, info]
  )
}