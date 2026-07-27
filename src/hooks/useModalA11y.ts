import { useEffect, useRef } from 'react'

/**
 * Hook for modal accessibility: focus trap + ESC key handler
 * Add to any modal that's missing these WCAG requirements
 */
export function useModalA11y(isOpen: boolean, onClose: () => void) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)

    const modal = modalRef.current
    if (!modal) return () => window.removeEventListener('keydown', handleEscape)

    const focusable = modal.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0] as HTMLElement
    const last = focusable[focusable.length - 1] as HTMLElement

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
    }

    modal.addEventListener('keydown', handleTab)
    setTimeout(() => first?.focus(), 100)

    return () => {
      window.removeEventListener('keydown', handleEscape)
      modal.removeEventListener('keydown', handleTab)
    }
  }, [isOpen, onClose])

  return modalRef
}
