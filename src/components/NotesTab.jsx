import React, { useState } from 'react'

const CATEGORIES = {
  ideas:        { label: 'Ideas',        icon: '◈', color: 'blue'   },
  reflexiones:  { label: 'Reflexiones',  icon: '◉', color: 'purple' },
  pendientes:   { label: 'Pendientes',   icon: '▲', color: 'amber'  },
  metas:        { label: 'Metas',        icon: '✦', color: 'green'  },
  otros:        { label: 'Otros',        icon: '◆', color: 'gray'   },
}

const COLOR_VAR = {
  blue:   { text: 'var(--blue)',   bg: 'var(--blue-bg)'   },
  purple: { text: 'var(--purple)', bg: 'var(--purple-bg)' },
  amber:  { text: 'var(--accent)', bg: 'var(--accent-bg)' },
  green:  { text: 'var(--green)',  bg: 'var(--green-bg)'  },
  gray:   { text: 'var(--text2)', bg: 'var(--bg3)'        },
}

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
  outline: 'none',
}

const EMPTY_FORM = { title: '', content: '', cat: 'ideas' }

export default function NotesTab({ notes, onAdd, onDelete, onUpdate }) {
  const [filterCat,  setFilterCat]  = useState('todas')
  const [showForm,   setShowForm]   = useState(false)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [editingId,  setEditingId]  = useState(null)
  const [search,     setSearch]     = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const filtered = notes
    .filter(n => filterCat === 'todas' || n.cat === filterCat)
    .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const handleSubmit = () => {
    if (!form.title.trim() || !form.content.trim()) return
    if (editingId) {
      onUpdate(editingId, { title: form.title.trim(), content: form.content.trim(), cat: form.cat })
      setEditingId(null)
    } else {
      onAdd({ title: form.title.trim(), content: form.content.trim(), cat: form.cat })
    }
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content, cat: note.cat })
    setEditingId(note.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div style={{ padding: '20px 20px 40px' }}>

      {/* Search + New */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          style={{ ...inputStyle, flex: 1, padding: '9px 12px', fontSize: 13 }}
          placeholder="Buscar notas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border2)'}
        />
        <button
          onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true) }}
          style={{
            background: 'var(--accent)', color: '#000',
            border: 'none', borderRadius: 'var(--radius-sm)',
            padding: '0 16px', fontSize: 13, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          + Nueva
        </button>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 20, scrollbarWidth: 'none' }}>
        {['todas', ...Object.keys(CATEGORIES)].map(key => {
          const isAll    = key === 'todas'
          const active   = filterCat === key
          const catData  = isAll ? null : CATEGORIES[key]
          const colors   = catData ? COLOR_VAR[catData.color] : null
          return (
            <button
              key={key}
              onClick={() => setFilterCat(key)}
              style={{
                background: active ? (colors ? colors.bg : 'var(--accent-bg)') : 'var(--surface)',
                border: `0.5px solid ${active ? (colors ? colors.text : 'var(--accent)') : 'var(--border)'}`,
                borderRadius: 20,
                padding: '5px 14px',
                color: active ? (colors ? colors.text : 'var(--accent)') : 'var(--text3)',
                fontSize: 11, whiteSpace: 'nowrap', cursor: 'pointer',
                fontFamily: "'DM Mono', monospace",
                transition: 'all 0.15s', flexShrink: 0,
              }}
            >
              {isAll ? 'Todas' : `${catData.icon} ${catData.label}`}
            </button>
          )
        })}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          background: 'var(--surface)', border: '0.5px solid var(--accent-border)',
          borderRadius: 'var(--radius)', padding: '20px', marginBottom: 20,
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>
            {editingId ? 'Editar nota' : 'Nueva nota'}
          </div>

          <div style={{ marginBottom: 12 }}>
            <input
              style={inputStyle}
              placeholder="Título de la nota"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border2)'}
            />
          </div>

          {/* Category selector */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {Object.entries(CATEGORIES).map(([key, cat]) => {
              const colors = COLOR_VAR[cat.color]
              const active = form.cat === key
              return (
                <button
                  key={key}
                  onClick={() => set('cat', key)}
                  style={{
                    background: active ? colors.bg : 'var(--bg3)',
                    border: `0.5px solid ${active ? colors.text : 'var(--border)'}`,
                    borderRadius: 20, padding: '4px 12px',
                    color: active ? colors.text : 'var(--text3)',
                    fontSize: 11, cursor: 'pointer',
                    fontFamily: "'DM Mono', monospace", transition: 'all 0.15s',
                  }}
                >
                  {cat.icon} {cat.label}
                </button>
              )
            })}
          </div>

          <textarea
            style={{ ...inputStyle, minHeight: 120, resize: 'none', lineHeight: 1.6, marginBottom: 12 }}
            placeholder="Escribe tu nota aquí..."
            value={form.content}
            onChange={e => set('content', e.target.value)}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border2)'}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleSubmit}
              style={{
                flex: 1, background: 'var(--accent)', color: '#000',
                border: 'none', borderRadius: 'var(--radius-sm)',
                padding: '11px', fontSize: 13, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {editingId ? 'Guardar cambios' : 'Crear nota'}
            </button>
            <button
              onClick={handleCancel}
              style={{
                flex: 1, background: 'transparent', color: 'var(--text3)',
                border: '0.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
                padding: '11px', fontSize: 13, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Notes list */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>
          <div style={{ fontSize: 28, marginBottom: 10, opacity: 0.4 }}>◈</div>
          {search ? 'No hay notas que coincidan.' : 'No hay notas aún.'}<br />
          {!search && <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => setShowForm(true)}>Crea la primera →</span>}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(note => {
          const cat    = CATEGORIES[note.cat] || CATEGORIES.otros
          const colors = COLOR_VAR[cat.color]
          return (
            <div
              key={note.id}
              className="fade-in"
              style={{
                background: 'var(--surface)', border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '16px',
                transition: 'border-color 0.2s',
              }}
            >
              {/* Note header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <span style={{
                  fontSize: 11, color: colors.text, background: colors.bg,
                  padding: '3px 10px', borderRadius: 20,
                  fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  {cat.icon} {cat.label}
                </span>
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => handleEdit(note)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text3)', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Mono', monospace', padding: '0 4px'" }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
                >
                  editar
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text3)', fontSize: 16, cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
                >×</button>
              </div>

              <div style={{ fontSize: 15, color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", marginBottom: 8, fontWeight: 500 }}>
                {note.title}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {note.content}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: "'DM Mono', monospace", marginTop: 10 }}>
                {new Date(note.createdAt).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })}
                {note.updatedAt && note.updatedAt !== note.createdAt && ' · editada'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
