import { useEffect } from 'react'

// Module-level refcount: several modals (and the mobile menu) can be open at
// once. Without this, closing any one of them unlocks scrolling for all.
let lockCount = 0

/**
 * Lock body scroll when modals are open.
 * Uses overflow:hidden on html element — no position changes,
 * no scroll jump.
 *
 * While locked, `--scrollbar-compensation` is published on <html> so that
 * position:fixed chrome (the header) can pad itself by the same amount the
 * document just shifted. Fixed elements are laid out against the viewport,
 * not the html padding box, so without this they visibly jump sideways.
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return

    const root = document.documentElement
    lockCount += 1

    if (lockCount === 1) {
      const scrollbarWidth = window.innerWidth - root.clientWidth
      root.style.overflow = 'hidden'
      root.style.paddingRight = `${scrollbarWidth}px`
      root.style.setProperty('--scrollbar-compensation', `${scrollbarWidth}px`)
    }

    return () => {
      lockCount -= 1
      if (lockCount === 0) {
        root.style.overflow = ''
        root.style.paddingRight = ''
        root.style.removeProperty('--scrollbar-compensation')
      }
    }
  }, [isLocked])
}
