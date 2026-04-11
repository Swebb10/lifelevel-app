import React from 'react'
import { REWARDS } from '../data/rewards.js'
import { LEVELS } from '../data/levels.js'

export default function RewardModal({ levelN, onClose }) {
  if (!levelN) return null

  const reward = REWARDS[levelN] || REWARDS[3]
  const levelData = LEVELS.find(l => l.n === levelN)

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.88)',
        zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={onClose}
    >
      <div
        className="scale-in"
        style={{
          background: 'var(--surface)',
          border: '0.5px solid var(--accent-border)',
          borderRadius: 'var(--radius)',
          padding: '36px 28px',
          maxWidth: 360,
          width: '100%',
          textAlign: 'center',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div style={{
          fontSize: 32, color: 'var(--accent)',
          marginBottom: 14,
          fontFamily: "'DM Mono', monospace",
        }}>
          {reward.icon}
        </div>

        {/* Level badge */}
        <div style={{
          display: 'inline-block',
          fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
          color: 'var(--accent)', background: 'var(--accent-bg)',
          padding: '4px 14px', borderRadius: 20, marginBottom: 16,
          fontFamily: "'DM Mono', monospace",
          border: '0.5px solid var(--accent-border)',
        }}>
          Nivel {levelN} — {levelData?.name}
        </div>

        {/* Quote */}
        <div style={{
          fontSize: 15, color: 'var(--text)', lineHeight: 1.5,
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          marginBottom: 6,
        }}>
          {reward.title}
        </div>
        <div style={{
          fontSize: 11, color: 'var(--accent)', marginBottom: 20,
          fontFamily: "'DM Mono', monospace",
        }}>
          {reward.author}
        </div>

        {/* Message */}
        <div style={{
          fontSize: 13, color: 'var(--text2)', lineHeight: 1.75,
          marginBottom: 20, textAlign: 'left',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {reward.msg}
        </div>

        {/* Action box */}
        <div style={{
          background: 'var(--accent-bg)',
          border: '0.5px solid var(--accent-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          marginBottom: 24,
          textAlign: 'left',
        }}>
          <div style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            color: 'var(--accent)', marginBottom: 6,
            fontFamily: "'DM Mono', monospace",
          }}>
            Tu reto de hoy
          </div>
          <div style={{
            fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {reward.action}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: 'var(--accent)',
            color: '#000',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '13px',
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: 0.5,
          }}
        >
          Entendido. A trabajar →
        </button>
      </div>
    </div>
  )
}
