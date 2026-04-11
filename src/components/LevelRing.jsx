import React, { useEffect, useRef } from 'react'

const R = 30
const CIRC = 2 * Math.PI * R

export default function LevelRing({ pct, levelN }) {
  const fillRef = useRef(null)

  useEffect(() => {
    if (!fillRef.current) return
    const offset = CIRC - (pct / 100) * CIRC
    fillRef.current.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)'
    fillRef.current.style.strokeDashoffset = offset
  }, [pct])

  return (
    <div style={{ width: 72, height: 72, position: 'relative', flexShrink: 0 }}>
      <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="36" cy="36" r={R}
          fill="none"
          stroke="var(--border)"
          strokeWidth="4"
        />
        <circle
          ref={fillRef}
          cx="36" cy="36" r={R}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC - (pct / 100) * CIRC}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>LVL</span>
        <span style={{ fontSize: 22, color: 'var(--accent)', lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>{levelN}</span>
      </div>
    </div>
  )
}
