import { useEffect, useRef } from 'react'

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ')

/**
 * Hook for modal accessibility: focus trap + ESC key handler
 * Add to any modal that's missing these WCAG requirements
 *
 * - Focus is moved into the modal on open and restored to the previously
 *   focused element on close (WCAG 2.4.3).
 * - The focusable list is re-queried on every Tab so lists that re-render
 *   (filtered results, async content) never leave the trap pointing at a
 *   detached node.
 */
export function useModalA11y(isOpen: boolean, onClose: () => void) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Focus capture/restore + initial focus.
  // Deps are [isOpen] only: an unstable `onClose` must never re-run this,
  // or every parent render would yank focus back out of the modal.
  useEffect(() => {
    if (!isOpen) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    const timer = setTimeout(() => {
      const modal = modalRef.current
      if (!modal) return
      const first = modal.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
      first?.focus()
    }, 100)

    return () => {
      clearTimeout(timer)
      // Detached or unfocusable nodes make this a harmless no-op
      previouslyFocused?.focus?.()
    }
  }, [isOpen])

  // ESC to close + Tab focus trap
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)

    const modal = modalRef.current
    if (!modal) return () => window.removeEventListener('keydown', handleEscape)

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      // Re-query every time — the modal's contents change as the user types
      const focusable = modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }

    modal.addEventListener('keydown', handleTab)

    return () => {
      window.removeEventListener('keydown', handleEscape)
      modal.removeEventListener('keydown', handleTab)
    }
  }, [isOpen, onClose])

  return modalRef
}
