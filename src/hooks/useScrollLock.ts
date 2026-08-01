import { useEffect } from 'react'

/**
 * Lock body scroll when modals are open.
 * Uses overflow:hidden on html element — no position changes,
 * no scroll jump.
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      document.documentElement.style.overflow = ''
      document.documentElement.style.paddingRight = ''
    }
  }, [isLocked])
}
