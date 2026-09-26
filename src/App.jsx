import React, { useState } from 'react'
import { useAppState } from './hooks/useAppState.js'
import { getLevelProgress, LEVELS } from './data/levels.js'
import { CATEGORIES } from './data/goalTypes.js'
import LevelRing from './components/LevelRing.jsx'
import GoalCard from './components/GoalCard.jsx'
import RewardModal from './components/RewardModal.jsx'
import AddGoalSheet from './components/AddGoalSheet.jsx'
import GoalDetailSheet from './components/GoalDetailSheet.jsx'
import NotesTab from './components/NotesTab.jsx'
import Toast from './components/Toast.jsx'

const NAV = [{ id: 'panel', label: 'Mi espacio', icon: 'grid' }, { id: 'notas', label: 'Mis notas', icon: 'note' }, { id: 'logros', label: 'Logros', icon: 'star' }, { id: 'stats', label: 'Estadísticas', icon: 'chart' }]
export function Icon({ name, size = 20 }) {
  const paths = { grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>, note: <><path d="M14 3H5v18h14V8Z"/><path d="M14 3v5h5M8 12h8M8 16h5"/></>, star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>, chart: <><path d="M4 3v18h17M8 16v-5M13 16V7M18 16V4"/></>, sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/></>, moon: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>, arrow: <path d="M5 12h14m-5-5 5 5-5 5"/>, plus: <path d="M12 5v14M5 12h14"/>, check: <path d="m5 12 4 4L19 6"/> }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.star}</svg>
}
export default function App() {
  const app = useAppState()
  const { state } = app
  const [tab, setTab] = useState('panel')
  const [detailId, setDetailId] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [toast, setToast] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const { pct, current, next } = getLevelProgress(state.xp)
  const completed = state.goals.filter(g => g.current >= g.target).length
  const maxStreak = Math.max(0, ...state.goals.map(g => g.streak || 0))
  const detail = state.goals.find(g => g.id === detailId)
  const notify = message => setToast({ message, id: Date.now() })
  const habit = id => { app.markHabitDone(id); notify('Hábito registrado. Cada día cuenta.') }
  const update = (id, value) => { app.updateGoalProgress(id, value); notify('Progreso guardado.') }
  const visibleGoals = state.goals.filter(g => (filter === 'all' || (filter === 'done' ? g.current >= g.target : g.current < g.target)) && g.name.toLowerCase().includes(search.toLowerCase()))
  const date = new Date().toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#" onClick={e => { e.preventDefault(); setTab('panel') }}><span className="brand-mark">L<span>↗</span></span>LifeLevel<span className="brand-dot">.</span></a>
      <p className="sidebar-label">TU CRECIMIENTO PERSONAL</p>
      <nav aria-label="Navegación principal">{NAV.map(item => <button key={item.id} className={`nav-item ${tab === item.id ? 'active' : ''}`} aria-current={tab === item.id ? 'page' : undefined} onClick={() => setTab(item.id)}><Icon name={item.icon}/><span>{item.label}</span>{tab === item.id && <i/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="small-quote"><Icon name="star"/><p>Pequeños pasos.<br/><strong>Grandes cambios.</strong></p><span>Tu mejor versión se construye cada día.</span></div><button className="theme-toggle" aria-label={state.theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'} onClick={app.toggleTheme}><Icon name={state.theme === 'dark' ? 'sun' : 'moon'}/><span>Tema {state.theme === 'dark' ? 'claro' : 'oscuro'}</span><span className="toggle-track"><i/></span></button><div className="local-label"><span/> Tu progreso, en este dispositivo</div></div>
    </aside>
    <main className="main-content">
      <header className="page-header"><div><div className="eyebrow">UN POCO MEJOR, CADA DÍA</div><h1>{NAV.find(n => n.id === tab).label}<span>.</span></h1><p>{tab === 'panel' ? 'Haz espacio para lo que quieres lograr.' : tab === 'notas' ? 'Ideas, aprendizajes y recordatorios para tu camino.' : tab === 'logros' ? 'Cada paso que das merece ser reconocido.' : 'Una mirada a todo lo que estás construyendo.'}</p></div><div className="header-actions"><span className="date-label">{date}</span><button className="primary" onClick={() => setShowAdd(true)}><Icon name="plus" size={18}/>Nueva meta</button></div></header>
      {tab === 'panel' && <>
        <section className="hero"><div className="hero-copy"><span className="pill"><span/> TU PRÓXIMO NIVEL EMPIEZA HOY</span><h2>No tienes que hacerlo todo.<br/>Solo dar <em>el siguiente paso.</em></h2><p>Cada hábito cuenta. Cada avance suma.<br/>Construye una vida que se sienta más tuya.</p><button className="text-button" onClick={() => setShowAdd(true)}>Vamos por una nueva meta <Icon name="arrow" size={18}/></button></div><div className="level-card"><LevelRing pct={pct} levelN={current.n}/><div className="eyebrow">NIVEL {current.n} · {current.name}</div><strong>{state.xp.toLocaleString()} <small>XP</small></strong><div className="progress-track"><div style={{ width: `${pct}%` }}/></div><p>{next ? `${next.xp - state.xp} XP para el siguiente nivel` : '¡Llegaste al nivel máximo!'}</p></div></section>
        <section className="summary-grid" aria-label="Resumen">{[{ icon: 'grid', value: state.goals.length - completed, label: 'Metas en marcha', note: 'Un paso a la vez', color: 'blue' }, { icon: 'star', value: maxStreak, label: 'Mayor racha actual', note: 'Días de constancia', color: 'accent' }, { icon: 'check', value: completed, label: 'Metas cumplidas', note: 'Esfuerzo que da frutos', color: 'green' }].map(s => <div className="summary-card" key={s.label}><span className={`stat-icon ${s.color}`}><Icon name={s.icon}/></span><div><span>{s.label}</span><strong>{s.value}<small>{s.label.includes('racha') ? ' días' : ''}</small></strong><p>{s.note}</p></div></div>)}</section>
        <section className="goals-section"><div className="section-heading"><div><h2>Mis metas <span className="count-badge">{state.goals.length}</span></h2><p>Tu intención de hoy, tu progreso de mañana.</p></div><input className="search-input" aria-label="Buscar metas" placeholder="Buscar una meta…" value={search} onChange={e => setSearch(e.target.value)}/></div><div className="filter-row">{[['all', 'Todas'], ['active', 'En marcha'], ['done', 'Cumplidas']].map(([id, label]) => <button key={id} className={filter === id ? 'selected' : ''} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}</div>
          {visibleGoals.length ? <div className="goals-grid">{visibleGoals.map(goal => <GoalCard key={goal.id} goal={goal} onDetail={g => setDetailId(g.id)} onUpdate={g => setDetailId(g.id)} onHabit={habit} onDelete={id => { if (window.confirm('¿Eliminar esta meta?')) app.deleteGoal(id) }}/>)}</div> : <div className="empty-state"><div className="empty-symbol"><Icon name="plus" size={28}/></div><h3>{state.goals.length ? 'Un espacio para nuevas posibilidades' : 'Todo empieza con una pequeña meta'}</h3><p>{state.goals.length ? 'No hay metas que coincidan con tu búsqueda o filtro.' : 'Eso que tienes en mente puede empezar aquí. Dale un nombre y da el primer paso.'}</p><button className="primary" onClick={() => setShowAdd(true)}><Icon name="plus" size={17}/>{state.goals.length ? 'Nueva meta' : 'Crear mi primera meta'}</button></div>}
        </section><footer className="page-footer"><span>HECHO PARA AVANZAR A TU RITMO</span><span>El progreso también está en volver a intentarlo.</span></footer>
      </>}
      {tab === 'notas' && <section className="content-panel"><NotesTab notes={state.notes || []} onAdd={app.addNote} onDelete={id => { if (window.confirm('¿Eliminar esta nota?')) app.deleteNote(id) }} onUpdate={app.updateNote}/></section>}
      {tab === 'logros' && <><section className="achievement-intro"><LevelRing pct={pct} levelN={current.n}/><div><span className="eyebrow">TU NIVEL ACTUAL</span><h2>{current.name}</h2><p>{state.xp.toLocaleString()} XP acumulados · {completed} metas cumplidas</p></div></section><div className="levels-grid">{LEVELS.map(l => <div key={l.n} className={`milestone ${l.n <= current.n ? 'unlocked' : ''}`}><Icon name="star" size={26}/><span>NIVEL {l.n}</span><h3>{l.name}</h3><p>{l.xp.toLocaleString()} XP</p><small>{l.n < current.n ? 'Alcanzado' : l.n === current.n ? 'Estás aquí' : 'Por descubrir'}</small></div>)}</div><div className="reset-area"><div><h3>Empezar de nuevo</h3><p>Elimina las metas, notas y el progreso de LifeLevel.</p></div><button className="danger-button" onClick={app.resetAll}>Restablecer progreso</button></div></>}
      {tab === 'stats' && <section className="content-panel stats-panel"><div className="section-heading"><h2>Progreso por meta</h2><span>{state.goals.length} metas</span></div>{!state.goals.length && <div className="empty-state"><Icon name="chart" size={36}/><h3>Tu historia está por comenzar</h3><p>Crea una meta para ver tu progreso aquí.</p><button className="primary" onClick={() => setShowAdd(true)}>Crear una meta</button></div>}{state.goals.map(g => <div className="stat-goal" key={g.id}><div><strong>{g.name}</strong><span>{CATEGORIES[g.cat]?.label} · {g.current} / {g.target} {g.unit}</span></div><b>{Math.min(100, Math.round(g.current / g.target * 100))}%</b><div className="progress-track"><div style={{ width: `${Math.min(100, g.current / g.target * 100)}%` }}/></div></div>)}</section>}
    </main>
    {detail && <GoalDetailSheet key={detail.id} goal={detail} onClose={() => setDetailId(null)} onUpdate={(id, changes) => { app.editGoal(id, changes); notify('Meta actualizada.') }} onSaveNote={app.saveGoalNote} onAddEntry={app.addGoalEntry} onDeleteEntry={app.deleteGoalEntry} onUpdateProgress={update} onHabit={habit}/>}
    {showAdd && <AddGoalSheet onAdd={g => { app.addGoal(g); notify('Tu nueva meta está lista.') }} onClose={() => setShowAdd(false)}/>}
    {state.pendingLevelUp && <RewardModal levelN={state.pendingLevelUp} onClose={app.clearPendingLevelUp}/>}
    {toast && <Toast key={toast.id} message={toast.message} onDone={() => setToast(null)}/>}
  </div>
}

