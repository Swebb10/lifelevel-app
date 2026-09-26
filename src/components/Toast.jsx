import React, { useEffect } from 'react'
export default function Toast({ message, onDone }) {
  useEffect(() => { const timer = setTimeout(onDone, 2600); return () => clearTimeout(timer) }, [onDone])
  return <div role="status" style={{ position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)', background: 'var(--surface)', border: '1px solid var(--accent-border)', borderRadius: 14, padding: '13px 22px', fontSize: 13, color: 'var(--accent)', zIndex: 500, maxWidth: 'calc(100vw - 36px)', boxShadow: '0 8px 30px #0002', pointerEvents: 'none' }}>✓ {message}</div>
}

