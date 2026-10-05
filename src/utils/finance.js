// All stored amounts are integer minor units (centimos/cents).
export const CURRENCIES = { CRC: 'Colones · CRC', USD: 'Dólares · USD' }
export const ACCOUNT_TYPES = { bank: 'Cuenta / tarjeta de débito', cash: 'Efectivo', digital: 'Billetera digital' }
export const EXPENSE_CATEGORIES = ['Vivienda', 'Alimentación', 'Transporte', 'Servicios', 'Salud', 'Educación', 'Ocio', 'Otros']
export const createFinance = () => ({ version: 1, currency: 'CRC', accounts: [], transactions: [], bills: [], savings: [] })
export function normalizeFinance(value) {
  const empty = createFinance()
  if (!value || value.version !== 1) return empty
  return { ...empty, ...value, currency: CURRENCIES[value.currency] ? value.currency : 'CRC', ...Object.fromEntries(['accounts', 'transactions', 'bills', 'savings'].map(key => [key, Array.isArray(value[key]) ? value[key] : []])) }
}
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export function parseMoney(value, allowZero = false) {
  const text = String(value).trim().replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(text)) throw new Error('Escribe un monto válido, sin separadores de miles y con hasta dos decimales.')
  const [whole, fraction = ''] = text.split('.')
  const amount = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  if (!Number.isSafeInteger(amount) || amount > 100_000_000_000_000 || (allowZero ? amount < 0 : amount <= 0)) throw new Error('El monto debe ser positivo y estar dentro del límite permitido.')
  return amount
}
export const moneyInput = cents => (cents / 100).toFixed(2)
export const formatMoney = (cents, currency) => new Intl.NumberFormat('es-CR', { style: 'currency', currency, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 2 }).format(cents / 100)
const sum = values => values.reduce((total, n) => total + n, 0)
const requireThat = (condition, message) => { if (!condition) throw new Error(message) }
const validAmount = (n, zero = false) => Number.isSafeInteger(n) && n >= (zero ? 0 : 1) && n <= 100_000_000_000_000
const validDate = text => typeof text === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(text) && localDate(new Date(`${text}T12:00:00`)) === text
const validMonth = text => /^\d{4}-(0[1-9]|1[0-2])$/.test(text)
const named = value => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 80
export function balances(finance) {
  const result = Object.fromEntries(finance.accounts.map(a => [a.id, a.opening]))
  for (const t of finance.transactions) {
    result[t.accountId] += t.type === 'income' ? t.amount : -t.amount
    if (t.type === 'transfer') result[t.toAccountId] += t.amount
  }
  return result
}
export function reservedByAccount(finance) {
  const result = Object.fromEntries(finance.accounts.map(a => [a.id, 0]))
  for (const goal of finance.savings) for (const [id, amount] of Object.entries(goal.allocations)) result[id] = (result[id] || 0) + amount
  return result
}
export const savedAmount = goal => sum(Object.values(goal.allocations))
export function monthlySaving(goal, month = localDate().slice(0, 7)) {
  const remaining = Math.max(0, goal.target - savedAmount(goal))
  if (!goal.deadline) return 0
  const [y, m] = month.split('-').map(Number)
  const [dy, dm] = goal.deadline.split('-').map(Number)
  return Math.ceil(remaining / Math.max(1, (dy - y) * 12 + dm - m + 1))
}
export function dueDate(bill, month) {
  const [year, m] = month.split('-').map(Number)
  return `${month}-${String(Math.min(bill.day, new Date(year, m, 0).getDate())).padStart(2, '0')}`
}
export const billPaid = (finance, id, month) => finance.transactions.some(t => t.billId === id && t.billMonth === month)
export function overview(finance, currency, month) {
  const accountBalances = balances(finance)
  const total = sum(finance.accounts.filter(a => a.currency === currency).map(a => accountBalances[a.id]))
  const savings = finance.savings.filter(g => g.currency === currency)
  const reserved = sum(savings.map(savedAmount))
  const bills = finance.bills.filter(b => b.currency === currency && b.startMonth <= month)
  const pending = sum(bills.filter(b => !billPaid(finance, b.id, month)).map(b => b.amount))
  const monthly = sum(bills.map(b => b.amount))
  const savingPlan = sum(savings.map(g => monthlySaving(g, month)))
  const movements = finance.transactions.filter(t => t.currency === currency && t.date.startsWith(month))
  return { total, reserved, pending, monthly, savingPlan, available: total - reserved - pending, income: sum(movements.filter(t => t.type === 'income').map(t => t.amount)), expense: sum(movements.filter(t => t.type === 'expense').map(t => t.amount)) }
}
function checkFunds(finance) {
  const totals = balances(finance), reserved = reservedByAccount(finance)
  for (const a of finance.accounts) {
    requireThat(Number.isSafeInteger(totals[a.id]), 'El saldo supera el límite permitido.')
    requireThat(totals[a.id] >= reserved[a.id], `Saldo insuficiente en ${a.name}. Si tienes dinero apartado, libéralo primero desde Ahorros.`)
  }
}
export function applyFinance(finance, action) {
  const f = normalizeFinance(finance)
  const p = action.payload || {}
  let next = f
  switch (action.type) {
    case 'currency':
      requireThat(CURRENCIES[p.currency], 'Moneda no válida.')
      return { ...f, currency: p.currency }
    case 'account.save': {
      const old = f.accounts.find(a => a.id === p.id)
      requireThat(p.id && named(p.name) && ACCOUNT_TYPES[p.kind] && CURRENCIES[p.currency] && validAmount(p.opening, true), 'Revisa el nombre, tipo, moneda y saldo inicial de la cuenta.')
      requireThat(!old || old.currency === p.currency, 'La moneda de una cuenta existente no se puede cambiar.')
      const account = { id: p.id, name: p.name.trim(), kind: p.kind, currency: p.currency, opening: p.opening }
      next = { ...f, accounts: old ? f.accounts.map(a => a.id === p.id ? account : a) : [...f.accounts, account] }
      break
    }
    case 'account.delete':
      requireThat(!f.transactions.some(t => t.accountId === p.id || t.toAccountId === p.id) && !f.savings.some(g => (g.allocations[p.id] || 0) > 0), 'Esta cuenta tiene movimientos o ahorros apartados. Consérvala para mantener tu historial.')
      next = { ...f, accounts: f.accounts.filter(a => a.id !== p.id) }
      break
    case 'bill.save': {
      requireThat(p.id && named(p.name) && CURRENCIES[p.currency] && validAmount(p.amount) && Number.isInteger(p.day) && p.day >= 1 && p.day <= 31 && validMonth(p.startMonth), 'Revisa el nombre, monto, moneda y día de pago.')
      const old = f.bills.find(b => b.id === p.id)
      requireThat(!old || old.currency === p.currency, 'La moneda de un gasto existente no se puede cambiar.')
      const bill = { id: p.id, name: p.name.trim(), amount: p.amount, currency: p.currency, day: p.day, startMonth: old?.startMonth || p.startMonth }
      return { ...f, bills: old ? f.bills.map(b => b.id === p.id ? bill : b) : [...f.bills, bill] }
    }
    case 'bill.delete':
      return { ...f, bills: f.bills.filter(b => b.id !== p.id) }
    case 'saving.save': {
      requireThat(p.id && named(p.name) && CURRENCIES[p.currency] && validAmount(p.target) && (!p.deadline || validDate(p.deadline)), 'Revisa el nombre, monto y fecha del objetivo.')
      const old = f.savings.find(g => g.id === p.id)
      requireThat(!old || old.currency === p.currency, 'La moneda de un ahorro existente no se puede cambiar.')
      requireThat(!old || p.target >= savedAmount(old), 'El objetivo no puede ser menor que el dinero ya apartado.')
      const goal = { id: p.id, name: p.name.trim(), target: p.target, currency: p.currency, deadline: p.deadline || '', allocations: old?.allocations || {} }
      return { ...f, savings: old ? f.savings.map(g => g.id === p.id ? goal : g) : [...f.savings, goal] }
    }
    case 'saving.delete':
      return { ...f, savings: f.savings.filter(g => g.id !== p.id) }
    case 'saving.allocate': {
      const goal = f.savings.find(g => g.id === p.id), account = f.accounts.find(a => a.id === p.accountId)
      requireThat(goal && account && goal.currency === account.currency && validAmount(p.amount) && ['reserve', 'release'].includes(p.direction), 'Selecciona una cuenta de la misma moneda y un monto válido.')
      const amount = (goal.allocations[account.id] || 0) + (p.direction === 'release' ? -p.amount : p.amount)
      requireThat(amount >= 0, 'No puedes liberar más de lo apartado en esta cuenta.')
      const updated = { ...goal, allocations: { ...goal.allocations, [account.id]: amount } }
      requireThat(savedAmount(updated) <= goal.target, 'El aporte supera lo que falta para alcanzar el objetivo.')
      next = { ...f, savings: f.savings.map(g => g.id === p.id ? updated : g) }
      break
    }
    case 'transaction.add': {
      const account = f.accounts.find(a => a.id === p.accountId)
      requireThat(p.id && !f.transactions.some(t => t.id === p.id) && account && validAmount(p.amount) && ['income', 'expense', 'transfer'].includes(p.type) && validDate(p.date) && p.date <= localDate(), 'Revisa el monto, cuenta y fecha. No se admiten movimientos futuros.')
      if (p.type === 'transfer') {
        const to = f.accounts.find(a => a.id === p.toAccountId)
        requireThat(to && to.id !== account.id && to.currency === account.currency, 'Elige otra cuenta de la misma moneda.')
      }
      if (p.billId) {
        const bill = f.bills.find(b => b.id === p.billId)
        requireThat(bill && p.type === 'expense' && bill.currency === account.currency && validMonth(p.billMonth) && p.billMonth >= bill.startMonth && p.amount === bill.amount, 'El pago debe coincidir con el gasto mensual.')
        requireThat(!billPaid(f, bill.id, p.billMonth), 'Este gasto ya está pagado en el mes seleccionado.')
      }
      const transaction = { id: p.id, type: p.type, accountId: account.id, currency: account.currency, amount: p.amount, date: p.date, description: String(p.description || '').trim().slice(0, 160), category: EXPENSE_CATEGORIES.includes(p.category) ? p.category : 'Otros', ...(p.type === 'transfer' ? { toAccountId: p.toAccountId } : {}), ...(p.billId ? { billId: p.billId, billMonth: p.billMonth } : {}) }
      next = { ...f, transactions: [...f.transactions, transaction] }
      break
    }
    case 'transaction.delete':
      next = { ...f, transactions: f.transactions.filter(t => t.id !== p.id) }
      break
    default: throw new Error('Operación no reconocida.')
  }
  checkFunds(next)
  return next
}
