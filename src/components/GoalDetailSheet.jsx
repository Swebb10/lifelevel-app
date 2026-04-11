import React, { useState } from 'react'
import { CATEGORIES, GOAL_TYPES, XP_TIERS } from '../data/goalTypes.js'
import { toDateStr } from '../utils/storage.js'

const inputStyle = {
  width: '100%',
  background: 'var(--bg3)',
  border: '0.5px solid var(--border2)',
  borderRadius: 'var(--radius-sm)',
  padding: '11px 12px',
  fontSize: 14,
  color: 'var(--text)',
  fontFamily: "'DM Sans', sans-serif",
  transition: 'border-color 0.2s',
}
const labelStyle = {
  fontSize: 10, color: 'var(--text3)', letterSpacing: 2,
  textTransform: 'uppercase', display: 'block', marginBottom: 6,
  fontFamily: "'DM Mono', monospace",
}
const sectionTitle = {
  fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
  color: 'var(--text3)', marginBottom: 12,
  fontFamily: "'DM Mono', monospace",
}

export default function GoalDetailSheet({ goal, onClose, onUpdate, onSaveNote, onAddEntry, onDeleteEntry }) {
  const [tab, setTab]           = useState('detalle')
  const [editing, setEditing]   = useState(false)
  const [editForm, setEditForm] = useState({ name: goal.name, target: goal.target, unit: goal.unit, xpBase: goal.xpBase, cat: goal.cat })
  const [noteText, setNoteText] = useState(goal.note || '')
  const [entryText, setEntryText] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)

  const cat    = CATEGORIES[goal.cat] || CATEGORIES.fin
  const pct    = Math.min(100, Math.round((goal.current / goal.target) * 100))
  const isDone = goal.current >= goal.target
  const entries = goal.entries || []

  const handleSaveEdit = () => {
    if (!editForm.name.trim() || !editForm.target) return
    onUpdate(goal.id, {
      name:   editForm.name.trim(),
      target: parseFloat(editForm.target),
      unit:   editForm.unit.trim(),
      xpBase: parseInt(editForm.xpBase),
      cat:    editForm.cat,
    })
    setEditing(false)
  }

  const handleSaveNote = () => {
    onSaveNote(goal.id, noteText)
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  const handleAddEntry = () => {
    if (!entryText.trim()) return
    onAddEntry(goal.id, entryText.trim())
    setEntryText('')
  }

  const tabs = ['detalle', 'notas', 'editar']

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 200,
        display: 'flex', alignItems: 'flex-end',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg2)',
          borderTop: '0.5px solid var(--border2)',
          borderRadius: '16px 16px 0 0',
          width: '100%',
          maxWidth: 480,
          margin: '0 auto',
          maxHeight: '88dvh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ padding: '16px 20px 0', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, background: 'var(--border2)', borderRadius: 2, margin: '0 auto 16px' }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: `var(--${cat.color === 'blue' ? 'blue' : cat.color === 'green' ? 'green' : cat.color === 'red' ? 'red' : cat.color === 'purple' ? 'purple' : 'blue'}-bg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: `var(--${cat.color === 'blue' ? 'blue' : cat.color === 'green' ? 'green' : cat.color === 'red' ? 'red' : cat.color === 'purple' ? 'purple' : 'blue'})`,
              fontFamily: "'DM Mono', monospace",
            }}>
              {cat.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {isDone && <span style={{ color: 'var(--accent)', marginRight: 5 }}>✓</span>}
                {goal.name}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
                {cat.label} · {GOAL_TYPES[goal.type]?.label}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text3)', fontSize: 20, cursor: 'pointer', padding: '0 4px' }}>×</button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', borderRadius: 10, padding: 4, marginBottom: 16 }}>
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '7px', fontSize: 11,
                  background: tab === t ? 'var(--surface)' : 'transparent',
                  border: tab === t ? '0.5px solid var(--border2)' : 'none',
                  borderRadius: 8, color: tab === t ? 'var(--accent)' : 'var(--text3)',
                  cursor: 'pointer', fontFamily: "'DM Mono', monospace",
                  letterSpacing: 1, textTransform: 'uppercase', transition: 'all 0.15s',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', padding: '0 20px 40px', flex: 1 }}>

          {/* ── TAB: DETALLE ─────────────────────────── */}
          {tab === 'detalle' && (
            <div>
              {/* Big progress */}
              <div style={{
                background: 'var(--surface)', border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '20px', marginBottom: 16,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                  <span style={{ fontSize: 32, color: 'var(--accent)', fontFamily: "'Playfair Display', serif" }}>
                    {pct}%
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: "'DM Mono', monospace" }}>
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                </div>
                <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: isDone ? 'linear-gradient(90deg, var(--accent), var(--accent2))' : 'var(--green)',
                    borderRadius: 3, transition: 'width 0.7s ease',
                  }} />
                </div>
                {isDone && (
                  <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 10, textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
                    ✦ Meta cumplida
                  </div>
                )}
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Racha actual',    val: `${goal.streak || 0} días` },
                  { label: 'XP base',         val: `${goal.xpBase} XP` },
                  { label: 'Restante',        val: `${+(goal.target - goal.current).toFixed(2)} ${goal.unit}` },
                  { label: 'Creada',          val: goal.createdAt ? new Date(goal.createdAt).toLocaleDateString('es-CR') : '—' },
                ].map(({ label, val }) => (
                  <div key={label} style={{
                    background: 'var(--surface)', border: '0.5px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', padding: '12px',
                  }}>
                    <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 16, color: 'var(--text)', fontFamily: "'Playfair Display', serif" }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Last update */}
              {goal.lastUpdated && (
                <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', fontFamily: "'DM Mono', monospace" }}>
                  Última actualización: {new Date(goal.lastUpdated).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: NOTAS ───────────────────────────── */}
          {tab === 'notas' && (
            <div>
              {/* Nota fija */}
              <div style={sectionTitle}>Nota de la meta</div>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Escribe aquí el contexto de esta meta, por qué la creaste, qué significa para ti..."
                style={{
                  ...inputStyle,
                  minHeight: 110, resize: 'none', lineHeight: 1.6,
                  marginBottom: 8,
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border2)'}
              />
              <button
                onClick={handleSaveNote}
                style={{
                  background: noteSaved ? 'var(--green-bg)' : 'var(--accent-bg)',
                  color: noteSaved ? 'var(--green)' : 'var(--accent)',
                  border: `0.5px solid ${noteSaved ? 'var(--green)' : 'var(--accent-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 16px', fontSize: 12,
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  marginBottom: 24, transition: 'all 0.2s',
                }}
              >
                {noteSaved ? '✓ Guardado' : 'Guardar nota'}
              </button>

              {/* Historial de entradas */}
              <div style={sectionTitle}>Bitácora de entradas</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="Añade una entrada de hoy..."
                  value={entryText}
                  onChange={e => setEntryText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddEntry()}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border2)'}
                />
                <button
                  onClick={handleAddEntry}
                  style={{
                    background: 'var(--accent)', color: '#000',
                    border: 'none', borderRadius: 'var(--radius-sm)',
                    padding: '0 16px', fontSize: 18, cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >+</button>
              </div>

              {entries.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
                  Aún no hay entradas. Añade la primera.
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[...entries].reverse().map((entry, i) => (
                  <div key={i} style={{
                    background: 'var(--surface)', border: '0.5px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', padding: '12px 14px',
                    position: 'relative',
                  }}>
                    <div style={{ fontSize: 9, color: 'var(--accent)', fontFamily: "'DM Mono', monospace", marginBottom: 5, letterSpacing: 1 }}>
                      {new Date(entry.date).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                      {entry.text}
                    </div>
                    <button
                      onClick={() => onDeleteEntry(goal.id, entries.length - 1 - i)}
                      style={{
                        position: 'absolute', top: 10, right: 10,
                        background: 'transparent', border: 'none',
                        color: 'var(--text3)', fontSize: 14, cursor: 'pointer',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
                    >×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: EDITAR ──────────────────────────── */}
          {tab === 'editar' && (
            <div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Nombre</label>
                <input
                  style={inputStyle}
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border2)'}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Categoría</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <button
                      key={key}
                      onClick={() => setEditForm(f => ({ ...f, cat: key }))}
                      style={{
                        background: editForm.cat === key ? 'var(--accent-bg)' : 'var(--bg3)',
                        border: `0.5px solid ${editForm.cat === key ? 'var(--accent-border)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-sm)', padding: '8px 6px',
                        color: editForm.cat === key ? 'var(--accent)' : 'var(--text2)',
                        fontSize: 11, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
                        cursor: 'pointer',
                      }}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Valor meta</label>
                  <input
                    style={inputStyle} type="number"
                    value={editForm.target}
                    onChange={e => setEditForm(f => ({ ...f, target: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border2)'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Unidad</label>
                  <input
                    style={inputStyle}
                    value={editForm.unit}
                    onChange={e => setEditForm(f => ({ ...f, unit: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border2)'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Dificultad (XP)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {XP_TIERS.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setEditForm(f => ({ ...f, xpBase: t.value }))}
                      style={{
                        background: editForm.xpBase === t.value ? 'var(--accent-bg)' : 'var(--bg3)',
                        border: `0.5px solid ${editForm.xpBase === t.value ? 'var(--accent-border)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-sm)', padding: '8px 4px',
                        color: editForm.xpBase === t.value ? 'var(--accent)' : 'var(--text2)',
                        fontSize: 11, fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.15s', lineHeight: 1.4, cursor: 'pointer',
                      }}
                    >
                      <div>{t.label}</div>
                      <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: "'DM Mono', monospace" }}>{t.value} XP</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveEdit}
                style={{
                  width: '100%', background: 'var(--accent)', color: '#000',
                  border: 'none', borderRadius: 'var(--radius-sm)',
                  padding: '13px', fontSize: 14, fontWeight: 500,
                  marginBottom: 10, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                }}
              >
                Guardar cambios
              </button>
              <button
                onClick={() => setTab('detalle')}
                style={{
                  width: '100%', background: 'transparent', color: 'var(--text3)',
                  border: '0.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  padding: '10px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
