import React, { useEffect, useState } from 'react'

export default function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 300)
    }, 2200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      bottom: 100,
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : '20px'})`,
      opacity: visible ? 1 : 0,
      transition: 'all 0.3s ease',
      background: 'var(--surface)',
      border: '0.5px solid var(--accent-border)',
      borderRadius: 30,
      padding: '10px 20px',
      fontSize: 13,
      color: 'var(--accent)',
      fontFamily: "'DM Sans', sans-serif",
      zIndex: 500,
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      pointerEvents: 'none',
    }}>
      ✦ {message}
    </div>
  )
}
