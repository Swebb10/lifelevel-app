import { useEffect, useRef } from 'react'

export function useDialog(onClose) {
  const ref = useRef(null)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const element = ref.current
    const focusable = () => [...element.querySelectorAll('button:not(:disabled), input, textarea, select, [tabindex="0"]')].filter(node => node.getClientRects().length)
    ;(focusable()[0] || element).focus()
    const handleKey = event => {
      const dialogs = [...document.querySelectorAll('[role="dialog"]')]
      if (dialogs.at(-1) !== element) return
      if (event.key === 'Escape') { event.preventDefault(); close.current() }
      if (event.key === 'Tab') {
        const nodes = focusable()
        const first = nodes[0], last = nodes.at(-1)
        if (!first) { event.preventDefault(); element.focus() }
        else if (event.shiftKey && (document.activeElement === first || !element.contains(document.activeElement))) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && (document.activeElement === last || !element.contains(document.activeElement))) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', handleKey); if (previous?.isConnected) previous.focus() }
  }, [])
  return ref
}
