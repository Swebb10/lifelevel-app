import React, { useState } from 'react'
import FinanceDialog from './FinanceDialog.jsx'
import { ACCOUNT_TYPES, CURRENCIES, balances, reservedByAccount, overview, savedAmount, monthlySaving, dueDate, billPaid, formatMoney, localDate } from '../../utils/finance.js'
import './finance.css'

const SECTIONS = [['overview', 'Resumen'], ['accounts', 'Cuentas'], ['bills', 'Gastos fijos'], ['savings', 'Ahorros'], ['transactions', 'Movimientos']]
const TYPE_LABELS = { income: 'Ingreso', expense: 'Gasto', transfer: 'Transferencia' }
function Empty({ title, children, action, onAction }) {
  return <div className="finance-empty"><span aria-hidden="true">↗</span><h3>{title}</h3><p>{children}</p>{action && <button className="secondary" onClick={onAction}>{action}</button>}</div>
}
function Heading({ title, subtitle, action, onClick }) {
  return <div className="finance-section-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action && <button className="secondary" onClick={onClick}>+ {action}</button>}</div>
}
function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a'); a.href = url; a.download = name; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export default function FinanceTab({ finance, onAction, notify }) {
  const [section, setSection] = useState('overview')
  const [month, setMonth] = useState(localDate().slice(0, 7))
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [movementType, setMovementType] = useState('all')
  const [error, setError] = useState('')
  const currency = finance.currency
  const fmt = n => formatMoney(n, currency)
  const totals = balances(finance), reserved = reservedByAccount(finance)
  const summary = overview(finance, currency, month)
  const current = overview(finance, currency, localDate().slice(0, 7))
  const accounts = finance.accounts.filter(a => a.currency === currency)
  const bills = finance.bills.filter(b => b.currency === currency && b.startMonth <= month).sort((a, b) => a.day - b.day)
  const savings = finance.savings.filter(g => g.currency === currency)
  const transactions = finance.transactions.filter(t => t.currency === currency && t.date.startsWith(month) && (movementType === 'all' || t.type === movementType) && `${t.description} ${finance.accounts.find(a => a.id === t.accountId)?.name || ''} ${t.category}`.toLowerCase().includes(search.toLowerCase())).slice().reverse().sort((a, b) => b.date.localeCompare(a.date))
  const nameOf = id => finance.accounts.find(a => a.id === id)?.name || 'Cuenta eliminada'
  const open = (kind, item) => { setError(''); setModal({ kind, item }) }
  const apply = action => { onAction(action); setError(''); notify('Finanzas actualizadas.') }
  function remove(type, item) {
    const messages = { account: `¿Eliminar ${item.name} y su saldo inicial?`, bill: `¿Dejar de planificar ${item.name}? Los pagos ya registrados permanecerán en el historial.`, saving: `¿Eliminar ${item.name}? Su dinero apartado volverá a estar disponible en las mismas cuentas.`, transaction: '¿Eliminar este movimiento? Se recalcularán los saldos. Si es un pago mensual, volverá a quedar pendiente.' }
    if (!window.confirm(messages[type])) return
    try { apply({ type: `${type}.delete`, payload: { id: item.id } }) } catch (e) { setError(e.message) }
  }
  function exportCSV() {
    // Prefix formula-like user text so spreadsheet apps cannot execute it.
    const cell = value => { const s = String(value); return `"${(/^[=+\-@\t\r]/.test(s) ? "'" + s : s).replaceAll('"', '""')}"` }
    const rows = [['Fecha', 'Tipo', 'Cuenta', 'Destino', 'Moneda', 'Monto', 'Categoría', 'Descripción'], ...transactions.map(t => [t.date, TYPE_LABELS[t.type], nameOf(t.accountId), t.toAccountId ? nameOf(t.toAccountId) : '', t.currency, (t.amount / 100).toFixed(2), t.category, t.description])]
    download(`lifelevel-${month}-${currency}.csv`, '\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n'), 'text/csv;charset=utf-8')
  }
  const accountsView = <section className="finance-section">
    <Heading title="Dónde está tu dinero" subtitle="Tus cuentas, tarjetas de débito y efectivo en un solo lugar." action="Añadir cuenta" onClick={() => open('account')} />
    {!accounts.length ? <Empty title={`Tu primera cuenta en ${currency}`} action="Añadir cuenta" onAction={() => open('account')}>Registra lo que tienes en una tarjeta, billetera digital o en efectivo.</Empty> : <div className="finance-account-grid">{accounts.map(a => <article className={`finance-account ${a.kind}`} key={a.id}>
      <div className="finance-account-top"><span className="finance-account-icon" aria-hidden="true">{a.kind === 'cash' ? '▤' : a.kind === 'digital' ? '◈' : '▣'}</span><span>{a.currency}</span><button className="finance-link" aria-label={`Editar cuenta ${a.name}`} onClick={() => open('account', a)}>Editar</button></div>
      <h3>{a.name}</h3><span className="finance-account-kind">{ACCOUNT_TYPES[a.kind]}</span><strong>{fmt(totals[a.id])}</strong>
      <div className="finance-account-bottom"><span>Apartado <b>{fmt(reserved[a.id])}</b></span><span>Libre en cuenta <b>{fmt(totals[a.id] - reserved[a.id])}</b></span></div>
      {section === 'accounts' && <button className="finance-delete" onClick={() => remove('account', a)}>Eliminar cuenta</button>}
    </article>)}</div>}
  </section>
  const billsView = <section className="finance-section">
    <Heading title="Tus compromisos del mes" subtitle={`${fmt(summary.monthly)} de gastos fijos · ${fmt(summary.pending)} por pagar`} action="Gasto fijo" onClick={() => open('bill')} />
    {!bills.length ? <Empty title="Anticípate a los gastos de cada mes" action="Añadir gasto fijo" onAction={() => open('bill')}>Alquiler, internet, suscripciones… Define el monto y el día de pago.</Empty> : <div className="finance-bill-list">{bills.map(b => {
      const paid = billPaid(finance, b.id, month), due = dueDate(b, month), overdue = !paid && due < localDate()
      return <article className="finance-bill" key={b.id}><span className={`finance-due ${paid ? 'paid' : overdue ? 'overdue' : ''}`}><small>DÍA</small>{Number(due.slice(-2))}</span><div className="finance-bill-name"><h3>{b.name}</h3><span className={overdue ? 'finance-negative' : ''}>{paid ? '✓ Pagado' : overdue ? 'Vencido · pendiente' : 'Pendiente de pago'}</span></div><strong>{fmt(b.amount)}</strong><div className="finance-row-actions"><button className="secondary" disabled={paid || !accounts.length} onClick={() => open('payment', b)}>{paid ? 'Pagado' : 'Registrar pago'}</button><button className="finance-link" aria-label={`Editar gasto ${b.name}`} onClick={() => open('bill', b)}>Editar</button>{section === 'bills' && <button className="finance-delete" aria-label={`Eliminar gasto ${b.name}`} onClick={() => remove('bill', b)}>Eliminar</button>}</div></article>
    })}</div>}
    {!!bills.length && !accounts.length && <p className="finance-help">Añade una cuenta en {currency} para registrar los pagos.</p>}
  </section>
  const savingsView = <section className="finance-section">
    <Heading title="Dale un propósito a tu ahorro" subtitle="Aparta dinero que ya tienes para las cosas que quieres lograr." action="Objetivo" onClick={() => open('saving')} />
    {!savings.length ? <Empty title="Tu próxima compra empieza aquí" action="Crear objetivo" onAction={() => open('saving')}>Ponle un nombre, un monto y, si quieres, una fecha. Verás cuánto falta apartar cada mes.</Empty> : <div className="finance-savings-grid">{savings.map(g => {
      const saved = savedAmount(g), pct = Math.min(100, Math.round(saved / g.target * 100)), plan = monthlySaving(g)
      return <article className="finance-saving" key={g.id}><div className="finance-saving-title"><span className="finance-account-icon" aria-hidden="true">◎</span><div><h3>{g.name}</h3><small>{g.deadline ? `Objetivo: ${new Date(g.deadline + 'T12:00:00').toLocaleDateString('es-CR')}` : 'A tu propio ritmo'}</small></div><button className="finance-link" aria-label={`Editar ahorro ${g.name}`} onClick={() => open('saving', g)}>Editar</button></div><div className="finance-saving-amount"><strong>{fmt(saved)}</strong><span>de {fmt(g.target)}</span></div><div className="progress-track" role="progressbar" aria-label={`Ahorro para ${g.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><div style={{ width: `${pct}%` }} /></div><div className="finance-saving-plan"><span>{pct}% apartado</span><span>{pct === 100 ? '¡Objetivo alcanzado!' : g.deadline ? `${fmt(plan)} / mes desde hoy` : `Faltan ${fmt(g.target - saved)}`}</span></div><div className="finance-saving-allocations">{Object.entries(g.allocations).filter(([, amount]) => amount > 0).map(([accountId, amount]) => <span key={accountId}>{nameOf(accountId)} · {fmt(amount)}</span>)}</div><div className="finance-saving-actions"><button className="secondary" disabled={!accounts.length} onClick={() => open('allocation', g)}>Apartar / liberar</button>{section === 'savings' && <button className="finance-delete" onClick={() => remove('saving', g)}>Eliminar objetivo</button>}</div></article>
    })}</div>}
  </section>
  return <div className="finance-page fade-in">
    <div className="finance-toolbar"><div className="finance-currencies" aria-label="Moneda de las finanzas">{Object.keys(CURRENCIES).map(c => <button key={c} aria-pressed={c === currency} className={c === currency ? 'selected' : ''} onClick={() => onAction({ type: 'currency', payload: { currency: c } })}><span>{c}</span><strong>{formatMoney(overview(finance, c, month).total, c)}</strong></button>)}</div><label className="finance-month">Mes de planificación<input type="month" aria-label="Mes de planificación" value={month} onInput={e => { if (e.currentTarget.value) setMonth(e.currentTarget.value) }} onChange={e => { if (e.target.value) setMonth(e.target.value) }} /></label></div>
    <section className="finance-hero"><div className="finance-hero-main"><span className="eyebrow">TU DINERO · {currency}</span><h2>Más claridad.<br/><em>Más tranquilidad.</em></h2><span className="finance-balance-label">Saldo total actual</span><strong className="finance-total">{fmt(summary.total)}</strong><p>La suma de tus {accounts.length} cuentas en {currency}. Incluye tu ahorro apartado.</p><button className="primary" disabled={!accounts.length} onClick={() => open('transaction')}>+ Registrar movimiento</button></div><div className="finance-budget"><span className="eyebrow">TU PLAN PARA {month}</span><div><span>Gastos fijos del mes</span><strong>{fmt(summary.monthly)}</strong></div><div><span>Aporte pendiente a objetivos</span><strong>{fmt(summary.savingPlan)}</strong></div><div className="finance-plan-total"><span>Prever este mes</span><strong>{fmt(summary.monthly + summary.savingPlan)}</strong></div><p>Gastos del mes completo + ahorro pendiente repartido hasta la fecha de cada objetivo. Los objetivos sin fecha no se incluyen.</p></div></section>
    <div className="finance-metrics"><article><span>Disponible hoy</span><strong className={current.available < 0 ? 'finance-negative' : ''}>{fmt(current.available)}</strong><small>Saldo − ahorro apartado − pagos pendientes del mes actual.</small></article><article><span>Ahorro apartado</span><strong>{fmt(summary.reserved)}</strong><small>Ya está incluido en tu saldo total.</small></article><article><span>Balance de {month}</span><strong className={summary.income - summary.expense < 0 ? 'finance-negative' : ''}>{fmt(summary.income - summary.expense)}</strong><small>Ingresos {fmt(summary.income)} · Gastos {fmt(summary.expense)}</small></article></div>
    {current.available < 0 && <p className="finance-notice" role="status">Faltan {fmt(-current.available)} para cubrir los pagos pendientes de este mes sin tocar el ahorro apartado.</p>}
    <div className="finance-tabs" role="group" aria-label="Secciones de finanzas">{SECTIONS.map(([key, label]) => <button key={key} aria-pressed={section === key} className={section === key ? 'selected' : ''} onClick={() => { setSection(key); setError('') }}>{label}</button>)}</div>
    {error && <p className="finance-error" role="alert">{error}</p>}
    {(section === 'overview' || section === 'accounts') && accountsView}
    {(section === 'overview' || section === 'bills') && billsView}
    {(section === 'overview' || section === 'savings') && savingsView}
    {section === 'transactions' && <section className="finance-section"><Heading title="Cada movimiento, en su lugar" subtitle="Los saldos iniciales y transferencias no cuentan como ingresos ni gastos." action="Movimiento" onClick={() => accounts.length ? open('transaction') : open('account')} /><div className="finance-movement-toolbar"><input className="search-input" placeholder="Buscar descripción o cuenta…" aria-label="Buscar movimientos" value={search} onChange={e => setSearch(e.target.value)} /><select aria-label="Tipo de movimientos" value={movementType} onChange={e => setMovementType(e.target.value)}><option value="all">Todos los movimientos</option>{Object.entries(TYPE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><button className="secondary" disabled={!transactions.length} onClick={exportCSV}>Exportar CSV</button></div>{!transactions.length ? <Empty title="Sin movimientos en esta vista">Los ingresos, gastos y transferencias que registres aparecerán aquí. Puedes cambiar el mes o los filtros.</Empty> : <div className="finance-transaction-list">{transactions.map(t => <article key={t.id} className="finance-transaction"><span className={`finance-transaction-icon ${t.type}`} aria-hidden="true">{t.type === 'income' ? '↙' : t.type === 'transfer' ? '⇄' : '↗'}</span><div><h3>{t.description || TYPE_LABELS[t.type]}</h3><p>{t.date} · {nameOf(t.accountId)}{t.toAccountId ? ` → ${nameOf(t.toAccountId)}` : ` · ${t.category}`}{t.billMonth ? ` · Pago de ${t.billMonth}` : ''}</p></div><strong className={t.type === 'income' ? 'finance-positive' : ''}>{t.type === 'income' ? '+' : t.type === 'expense' ? '−' : ''}{fmt(t.amount)}</strong><button className="icon-button" aria-label={`Eliminar movimiento ${t.description || TYPE_LABELS[t.type]} del ${t.date}`} onClick={() => remove('transaction', t)}>×</button></article>)}</div>}</section>}
    <footer className="finance-footer"><p>Registro manual, guardado en este navegador. Las cuentas no están conectadas a tu banco. CRC y USD se muestran por separado.</p><button className="finance-link" onClick={() => download(`lifelevel-finanzas-${localDate()}.json`, JSON.stringify({ exportedAt: new Date().toISOString(), finance }, null, 2), 'application/json')}>Descargar copia de mis finanzas</button></footer>
    {modal && <FinanceDialog key={`${modal.kind}-${modal.item?.id || 'new'}`} modal={modal} finance={finance} currency={currency} month={month} onAction={apply} onClose={() => setModal(null)} />}
  </div>
}
