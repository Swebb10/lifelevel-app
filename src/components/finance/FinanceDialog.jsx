import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useDialog } from '../../hooks/useDialog.js'
import { ACCOUNT_TYPES, CURRENCIES, EXPENSE_CATEGORIES, balances, reservedByAccount, formatMoney, localDate, moneyInput, parseMoney } from '../../utils/finance.js'

function Field({ label, hint, children }) {
  return <label className="finance-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>
}
const id = () => crypto.randomUUID?.() || Array.from(crypto.getRandomValues(new Uint32Array(4)), n => n.toString(16).padStart(8, '0')).join('')

export default function FinanceDialog({ modal, finance, currency, month, onAction, onClose }) {
  const ref = useDialog(onClose)
  const item = modal.item
  const type = modal.kind
  const isPayment = type === 'payment'
  const accounts = finance.accounts.filter(a => a.currency === (item?.currency || currency))
  const totals = balances(finance)
  const reserved = reservedByAccount(finance)
  const [error, setError] = useState('')
  const [form, setForm] = useState(() => ({
    name: item?.name || '', kind: item?.kind || 'bank', currency: item?.currency || currency,
    opening: moneyInput(item?.opening || 0), amount: (isPayment || type === 'bill') && item ? moneyInput(item.amount) : '',
    target: item?.target ? moneyInput(item.target) : '', day: item?.day || 1,
    startMonth: item?.startMonth || month, deadline: item?.deadline || '',
    type: isPayment ? 'expense' : 'expense', accountId: accounts[0]?.id || '',
    toAccountId: accounts[1]?.id || '', direction: 'reserve', date: localDate(),
    description: isPayment ? `${item.name} · ${month}` : '', category: 'Otros',
  }))
  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
  const titles = { account: item ? 'Editar cuenta' : 'Añadir cuenta', transaction: 'Registrar movimiento', payment: `Pagar ${item?.name}`, bill: item ? 'Editar gasto fijo' : 'Nuevo gasto fijo', saving: item ? 'Editar objetivo de ahorro' : 'Nuevo objetivo de ahorro', allocation: 'Apartar o liberar ahorro' }
  function submit(event) {
    event.preventDefault()
    try {
      let action
      if (type === 'account') action = { type: 'account.save', payload: { id: item?.id || id(), name: form.name, kind: form.kind, currency: form.currency, opening: parseMoney(form.opening, true) } }
      if (type === 'bill') action = { type: 'bill.save', payload: { id: item?.id || id(), name: form.name, currency: form.currency, amount: parseMoney(form.amount), day: Number(form.day), startMonth: form.startMonth } }
      if (type === 'saving') action = { type: 'saving.save', payload: { id: item?.id || id(), name: form.name, currency: form.currency, target: parseMoney(form.target), deadline: form.deadline } }
      if (type === 'allocation') action = { type: 'saving.allocate', payload: { id: item.id, accountId: form.accountId, direction: form.direction, amount: parseMoney(form.amount) } }
      if (type === 'transaction' || isPayment) action = { type: 'transaction.add', payload: { id: id(), type: form.type, accountId: form.accountId, toAccountId: form.toAccountId, amount: parseMoney(form.amount), date: form.date, category: form.category, description: form.description, ...(isPayment ? { billId: item.id, billMonth: month } : {}) } }
      onAction(action)
      onClose()
    } catch (e) { setError(e.message) }
  }
  const accountSelect = (key, label, list = accounts) => <Field label={label}><select required value={form[key]} onChange={e => set(key, e.target.value)}><option value="" disabled>Selecciona una cuenta</option>{list.map(a => <option key={a.id} value={a.id}>{a.name} · {formatMoney(totals[a.id] - reserved[a.id], a.currency)} libre</option>)}</select></Field>
  const amountField = (key, label, options = {}) => <Field label={label} hint={options.hint}><input required type="text" inputMode="decimal" placeholder="0.00" value={form[key]} readOnly={options.readOnly} onChange={e => set(key, e.target.value)} /></Field>
  return createPortal(<div className="modal-overlay finance-overlay" onClick={onClose}>
    <div className="finance-dialog" role="dialog" aria-modal="true" aria-labelledby="finance-dialog-title" ref={ref} tabIndex={-1} onClick={e => e.stopPropagation()}>
      <div className="finance-dialog-heading"><div><span className="eyebrow">TUS FINANZAS, EN ORDEN</span><h2 id="finance-dialog-title">{titles[type]}</h2></div><button className="icon-button" onClick={onClose} aria-label="Cerrar formulario">×</button></div>
      <form onSubmit={submit} className="finance-form">
        {['account', 'bill', 'saving'].includes(type) && <>
          <Field label="Nombre"><input required maxLength={80} value={form.name} onChange={e => set('name', e.target.value)} placeholder={type === 'account' ? 'Ej. Tarjeta A, efectivo, cuenta digital…' : type === 'bill' ? 'Ej. Alquiler, internet…' : 'Ej. Computadora nueva…'} /></Field>
          <Field label="Moneda"><select disabled={!!item} value={form.currency} onChange={e => set('currency', e.target.value)}>{Object.entries(CURRENCIES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></Field>
        </>}
        {type === 'account' && <>
          <Field label="Tipo de cuenta"><select value={form.kind} onChange={e => set('kind', e.target.value)}>{Object.entries(ACCOUNT_TYPES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></Field>
          {amountField('opening', 'Saldo inicial', { hint: item ? 'Es el saldo anterior a tus movimientos registrados. Al corregirlo, se recalcula el saldo actual.' : 'Dinero propio que tienes hoy. No incluyas el límite disponible de una tarjeta de crédito.' })}
        </>}
        {type === 'bill' && <>
          <Field label="Monto mensual"><input required inputMode="decimal" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0.00" /></Field>
          <div className="finance-form-pair"><Field label="Día de vencimiento"><input required type="number" min="1" max="31" value={form.day} onChange={e => set('day', e.target.value)} /></Field><Field label="Desde el mes"><input required type="month" value={form.startMonth} disabled={!!item} onInput={e => set('startMonth', e.currentTarget.value)} onChange={e => set('startMonth', e.target.value)} /></Field></div>
          <p className="finance-help">Se repetirá cada mes. El saldo se descuenta solo cuando registres el pago. Si el mes tiene menos días, vence el último día.</p>
        </>}
        {type === 'saving' && <>
          {amountField('target', 'Monto objetivo')}
          <Field label="Fecha objetivo (opcional)" hint="Calcularemos cuánto falta apartar por mes, contando el mes actual y el de la fecha objetivo."><input type="date" value={form.deadline} onInput={e => set('deadline', e.currentTarget.value)} onChange={e => set('deadline', e.target.value)} /></Field>
        </>}
        {type === 'allocation' && <>
          <p className="finance-help">{item.name}. Apartar no mueve dinero entre bancos: lo reserva dentro de una de tus cuentas. Liberarlo vuelve a dejarlo disponible.</p>
          <Field label="Operación"><select value={form.direction} onChange={e => set('direction', e.target.value)}><option value="reserve">Apartar dinero</option><option value="release">Liberar dinero</option></select></Field>
          {accountSelect('accountId', 'Cuenta del ahorro')}
          {form.accountId && <p className="finance-help">Apartado para este objetivo en esta cuenta: {formatMoney(item.allocations[form.accountId] || 0, item.currency)}</p>}
          {amountField('amount', 'Monto')}
        </>}
        {(type === 'transaction' || isPayment) && <>
          {!isPayment && <Field label="Tipo de movimiento"><select value={form.type} onChange={e => set('type', e.target.value)}><option value="expense">Gasto</option><option value="income">Ingreso</option><option value="transfer">Transferencia entre mis cuentas</option></select></Field>}
          {isPayment && <p className="finance-help">Pago de {month}. Se creará un gasto en la cuenta que elijas y quedará marcado como pagado este mes.</p>}
          {accountSelect('accountId', form.type === 'income' ? 'Cuenta que recibe' : 'Cuenta de origen')}
          {form.type === 'transfer' && accountSelect('toAccountId', 'Cuenta de destino', accounts.filter(a => a.id !== form.accountId))}
          {form.type === 'transfer' && <p className="finance-help">Puedes transferir entre cuentas de la misma moneda. No se suma a tus ingresos ni a tus gastos.</p>}
          {amountField('amount', `Monto (${item?.currency || currency})`, { readOnly: isPayment })}
          <Field label="Fecha"><input required type="date" max={localDate()} value={form.date} onInput={e => set('date', e.currentTarget.value)} onChange={e => set('date', e.target.value)} /></Field>
          {form.type === 'expense' && <Field label="Categoría"><select value={form.category} onChange={e => set('category', e.target.value)}>{EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>}
          <Field label="Descripción (opcional)"><input maxLength={160} value={form.description} onChange={e => set('description', e.target.value)} placeholder="¿A qué corresponde este movimiento?" /></Field>
        </>}
        {error && <p className="finance-error" role="alert">{error}</p>}
        <div className="finance-form-actions"><button type="button" className="secondary" onClick={onClose}>Cancelar</button><button className="primary" type="submit">{isPayment ? 'Confirmar pago' : 'Guardar'}</button></div>
      </form>
    </div>
  </div>, document.body)
}
