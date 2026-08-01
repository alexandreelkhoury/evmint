import { useEffect, useRef } from 'react'

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ')

interface OpenModal {
  /** The dialog element itself, captured once the effect runs post-commit */
  element: HTMLElement | null
  /** Where focus should go when this dialog is the last one to close */
  previouslyFocused: HTMLElement | null
}

/**
 * Every dialog using this hook, in the order it opened. Modals overlap far more
 * often than the markup suggests: a success dialog typically mounts in the same
 * commit that starts the exit animation of the dialog it replaces, so for a few
 * hundred milliseconds two entries are live at once. The stack is what lets the
 * outgoing dialog know it is no longer the one that owns focus.
 */
const openModals: OpenModal[] = []

/**
 * Hook for modal accessibility: focus trap + ESC key handler
 * Add to any modal that's missing these WCAG requirements
 *
 * - Focus is moved into the modal on open and restored to the previously
 *   focused element on close (WCAG 2.4.3).
 * - Only the topmost dialog restores focus, so a dialog that is still animating
 *   out cannot yank focus off the dialog that replaced it.
 * - The focusable list is re-queried on every Tab so lists that re-render
 *   (filtered results, async content) never leave the trap pointing at a
 *   detached node.
 */
export function useModalA11y(isOpen: boolean, onClose: () => void) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Focus capture/restore + initial focus.
  // [isOpen] is already exhaustive: nothing else read here is reactive
  // (`modalRef` is a ref, `openModals` is module scope). Do not copy this dep
  // list onto the ESC/Tab effect below — that one really does call `onClose`
  // and must keep it listed, or Escape would invoke a stale handler.
  useEffect(() => {
    if (!isOpen) return

    const active = document.activeElement as HTMLElement | null

    // If focus currently sits inside a dialog that is on its way out, that node
    // is about to be detached — inherit the opener it captured instead, so the
    // last dialog in the chain can still hand focus back to the page.
    const outgoing = active
      ? openModals.find(entry => entry.element?.contains(active))
      : undefined

    const self: OpenModal = {
      element: modalRef.current,
      previouslyFocused: outgoing ? outgoing.previouslyFocused : active
    }
    openModals.push(self)

    const timer = setTimeout(() => {
      const modal = modalRef.current
      if (!modal) return
      const first = modal.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
      first?.focus()
    }, 100)

    return () => {
      clearTimeout(timer)

      const index = openModals.indexOf(self)
      // Topmost means nothing opened on top of us: either we are the only
      // dialog (restore, as before) or we are the innermost of a nested pair
      // (restore to the control inside the parent dialog that opened us).
      // An outgoing dialog sitting *below* a newer one skips the restore
      // entirely and leaves focus where the newer dialog put it.
      const isTopmost = index === openModals.length - 1
      if (index !== -1) openModals.splice(index, 1)
      if (!isTopmost) return

      const target = self.previouslyFocused
      // A node that left the DOM while we were open can't take focus back;
      // focusing it would silently drop focus onto <body>.
      if (target && document.contains(target)) target.focus?.()
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
