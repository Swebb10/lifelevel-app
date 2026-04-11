import React, { useState, useEffect } from 'react'
import { useAppState } from './hooks/useAppState.js'
import { getLevelProgress } from './data/levels.js'
import LevelRing        from './components/LevelRing.jsx'
import GoalCard         from './components/GoalCard.jsx'
import UpdateModal      from './components/UpdateModal.jsx'
import RewardModal      from './components/RewardModal.jsx'
import AddGoalSheet     from './components/AddGoalSheet.jsx'
import GoalDetailSheet  from './components/GoalDetailSheet.jsx'
import NotesTab         from './components/NotesTab.jsx'
import Toast            from './components/Toast.jsx'

const NAV = [
  { id: 'panel',  label: 'Panel',   icon: '◈' },
  { id: 'notas',  label: 'Notas',   icon: '◉' },
  { id: 'logros', label: 'Logros',  icon: '✦' },
  { id: 'stats',  label: 'Stats',   icon: '▲' },
]

export default function App() {
  const {
    state,
    addGoal, deleteGoal, editGoal, updateGoalProgress,
    markHabitDone, clearPendingLevelUp,
    saveGoalNote, addGoalEntry, deleteGoalEntry,
    addNote, deleteNote, updateNote,
    toggleTheme, resetAll,
  } = useAppState()

  const [tab,           setTab]          = useState('panel')
  const [updatingGoal,  setUpdatingGoal] = useState(null)
  const [detailGoal,    setDetailGoal]   = useState(null)
  const [showAddForm,   setShowAddForm]  = useState(false)
  const [toast,         setToast]        = useState(null)

  const { pct, current, next } = getLevelProgress(state.xp)
  const maxStreak = Math.max(...(state.goals.map(g => g.streak || 0)), 0)
  const completedGoals = state.goals.filter(g => g.current >= g.target).length

  // Show reward modal on level-up
  useEffect(() => {
    if (state.pendingLevelUp) {
      // small delay so user sees XP bar animate first
      const t = setTimeout(() => {}, 600)
      return () => clearTimeout(t)
    }
  }, [state.pendingLevelUp])

  const handleUpdateConfirm = (id, value) => {
    updateGoalProgress(id, value)
    if (state.lastUpdateMsg) showToast(state.lastUpdateMsg)
  }

  const handleHabit = (id) => {
    markHabitDone(id)
    showToast('¡Hecho! +XP ganado.')
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar esta meta?')) deleteGoal(id)
  }

  const showToast = (msg) => {
    setToast(msg)
  }

  // ── Styles shared ──────────────────────────────────────────
  const s = {
    app: {
      maxWidth: 480,
      margin: '0 auto',
      minHeight: '100dvh',
      background: 'var(--bg)',
      paddingBottom: 80,
      position: 'relative',
    },
    topbar: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 20px 0',
    },
    logo: {
      fontSize: 12, letterSpacing: 4, textTransform: 'uppercase',
      color: 'var(--text3)', fontFamily: "'DM Mono', monospace",
    },
    themeBtn: {
      background: 'var(--surface)', border: '0.5px solid var(--border2)',
      borderRadius: 20, padding: '6px 14px', fontSize: 11,
      color: 'var(--text2)', cursor: 'pointer', transition: 'all 0.2s',
      fontFamily: "'DM Mono', monospace",
    },
  }

  return (
    <div className={state.theme === 'light' ? 'light' : ''} style={s.app}>

      {/* ── TOP BAR ─────────────────────────────────────── */}
      <div style={s.topbar}>
        <span style={s.logo}>LifeLevel</span>
        <button style={s.themeBtn} onClick={toggleTheme}>
          {state.theme === 'light' ? '☾ Dark' : '☀ Claro'}
        </button>
      </div>

      {/* ── PANEL TAB ───────────────────────────────────── */}
      {tab === 'panel' && (
        <>
          {/* Hero */}
          <div style={{ padding: '28px 20px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
              <LevelRing pct={pct} levelN={current.n} />
              <div>
                <div style={{
                  fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
                  color: 'var(--accent)', marginBottom: 4,
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {current.name}
                </div>
                <h1 style={{
                  fontSize: 19, color: 'var(--text)', lineHeight: 1.3,
                  fontFamily: "'Playfair Display', serif", fontWeight: 400,
                }}>
                  Sigue adelante,<br />el progreso se acumula.
                </h1>
                <div style={{
                  fontSize: 11, color: 'var(--text3)', marginTop: 5,
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {state.xp.toLocaleString()} / {next ? next.xp.toLocaleString() : '∞'} XP
                </div>
              </div>
            </div>

            {/* XP Bar */}
            <div>
              <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                  borderRadius: 2, transition: 'width 1s ease',
                }} />
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 10, color: 'var(--text3)', marginTop: 5,
                fontFamily: "'DM Mono', monospace",
              }}>
                <span>Nivel {current.n}</span>
                <span>{pct}%</span>
                <span>{next ? `Nivel ${next.n}` : 'Máx'}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '0 20px', marginBottom: 24 }}>
            {[
              { val: state.goals.length,  label: 'Metas'   },
              { val: maxStreak,           label: 'Racha'    },
              { val: completedGoals,      label: 'Logradas' },
            ].map(({ val, label }) => (
              <div key={label} style={{
                background: 'var(--surface)', border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '12px 8px', textAlign: 'center',
                boxShadow: 'var(--shadow)',
              }}>
                <div style={{ fontSize: 22, color: 'var(--text)', fontFamily: "'Playfair Display', serif" }}>{val}</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 3, fontFamily: "'DM Mono', monospace" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Goals section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 12 }}>
            <span style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text3)', fontFamily: "'DM Mono', monospace" }}>
              Mis Metas
            </span>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                background: 'var(--accent)', color: '#000',
                border: 'none', borderRadius: 20,
                padding: '5px 16px', fontSize: 12,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              + Nueva
            </button>
          </div>

          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {state.goals.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '40px 20px',
                color: 'var(--text3)', fontSize: 13,
                fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7,
              }}>
                <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.4 }}>◈</div>
                No tienes metas todavía.<br />
                <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => setShowAddForm(true)}>
                  Crea la primera →
                </span>
              </div>
            )}
            {state.goals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdate={g => setDetailGoal(g)}
                onHabit={handleHabit}
                onDelete={handleDelete}
                onDetail={g => setDetailGoal(g)}
              />
            ))}
          </div>
        </>
      )}

      {/* ── NOTAS TAB ───────────────────────────────────── */}
      {tab === 'notas' && (
        <NotesTab
          notes={state.notes || []}
          onAdd={addNote}
          onDelete={deleteNote}
          onUpdate={updateNote}
        />
      )}

      {/* ── LOGROS TAB ──────────────────────────────────── */}
      {tab === 'logros' && (
        <div style={{ padding: '28px 20px' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
            Nivel Actual
          </div>
          <div
            style={{
              background: 'var(--surface)', border: '0.5px solid var(--accent-border)',
              borderRadius: 'var(--radius)', padding: '24px 20px', marginBottom: 20,
              cursor: 'pointer',
            }}
            onClick={() => clearPendingLevelUp() || setTab('panel')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <LevelRing pct={pct} levelN={current.n} />
              <div>
                <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--accent)', fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>
                  Nivel {current.n}
                </div>
                <div style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", color: 'var(--text)' }}>
                  {current.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4, fontFamily: "'DM Mono', monospace" }}>
                  {state.xp.toLocaleString()} XP acumulados
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>
            Resumen
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
            {[
              { val: state.goals.length,               label: 'Metas creadas'    },
              { val: completedGoals,                   label: 'Metas cumplidas'  },
              { val: maxStreak,                        label: 'Racha más larga'  },
              { val: (state.totalXP || 0).toLocaleString(), label: 'XP total ganado' },
            ].map(({ val, label }) => (
              <div key={label} style={{
                background: 'var(--surface)', border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '14px',
                boxShadow: 'var(--shadow)',
              }}>
                <div style={{ fontSize: 22, color: 'var(--accent)', fontFamily: "'Playfair Display', serif" }}>{val}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3, letterSpacing: 1, textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>
            Zona peligrosa
          </div>
          <button
            onClick={resetAll}
            style={{
              width: '100%', background: 'var(--red-bg)', color: 'var(--red)',
              border: '0.5px solid var(--red)', borderRadius: 'var(--radius-sm)',
              padding: '12px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Resetear todo el progreso
          </button>
        </div>
      )}

      {/* ── STATS TAB ───────────────────────────────────── */}
      {tab === 'stats' && (
        <div style={{ padding: '28px 20px' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
            Progreso por Meta
          </div>
          {state.goals.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              Agrega metas para ver estadísticas.
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {state.goals.map(g => {
              const pctG = Math.min(100, Math.round((g.current / g.target) * 100))
              return (
                <div key={g.id} style={{
                  background: 'var(--surface)', border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', padding: '14px',
                  boxShadow: 'var(--shadow)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: "'DM Sans', sans-serif" }}>{g.name}</span>
                    <span style={{ fontSize: 12, color: 'var(--accent)', fontFamily: "'DM Mono', monospace" }}>{pctG}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{
                      height: '100%', width: `${pctG}%`,
                      background: pctG >= 100 ? 'var(--accent)' : 'var(--green)',
                      borderRadius: 2, transition: 'width 0.7s ease',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text3)', fontFamily: "'DM Mono', monospace" }}>
                    <span>{g.current} {g.unit}</span>
                    <span>meta: {g.target} {g.unit}</span>
                  </div>
                  {g.streak > 0 && (
                    <div style={{ marginTop: 6, fontSize: 10, color: 'var(--accent)', fontFamily: "'DM Mono', monospace" }}>
                      🔥 racha: {g.streak} días
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ──────────────────────────────────── */}
      <nav style={{
        position: 'fixed', bottom: 0,
        left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
        background: 'var(--bg2)',
        borderTop: '0.5px solid var(--border)',
        display: 'flex', padding: '10px 0 20px',
        zIndex: 100,
      }}>
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              background: 'transparent', border: 'none',
              fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
              color: tab === item.id ? 'var(--accent)' : 'var(--text3)',
              transition: 'color 0.2s',
              cursor: 'pointer',
              fontFamily: "'DM Mono', monospace",
            }}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* ── MODALS ──────────────────────────────────────── */}
      {detailGoal && (
        <GoalDetailSheet
          goal={state.goals.find(g => g.id === detailGoal.id) || detailGoal}
          onClose={() => setDetailGoal(null)}
          onUpdate={(id, changes) => { editGoal(id, changes); showToast('Meta actualizada.') }}
          onSaveNote={(id, note) => { saveGoalNote(id, note) }}
          onAddEntry={(id, text) => { addGoalEntry(id, text); showToast('Entrada añadida.') }}
          onDeleteEntry={(id, index) => deleteGoalEntry(id, index)}
        />
      )}

      {updatingGoal && (
        <UpdateModal
          goal={updatingGoal}
          onConfirm={(id, val) => {
            handleUpdateConfirm(id, val)
            setTimeout(() => showToast(state.lastUpdateMsg || 'Progreso guardado.'), 100)
          }}
          onClose={() => setUpdatingGoal(null)}
        />
      )}

      {state.pendingLevelUp && (
        <RewardModal
          levelN={state.pendingLevelUp}
          onClose={clearPendingLevelUp}
        />
      )}

      {showAddForm && (
        <AddGoalSheet
          onAdd={addGoal}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {toast && (
        <Toast message={toast} onDone={() => setToast(null)} />
      )}
    </div>
  )
}
