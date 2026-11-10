import { parseAmount } from '../components/common/dashboardUtils'

export function getMetrics(data) {
  const credits = data.transactions.filter((item) => item.movement_type === 'Credit').length
  const debits = data.transactions.filter((item) => item.movement_type === 'Debit').length
  return { credits, debits, total: data.transactions.length, lastExecution: data.executions[0]?.fecha_recepcion }
}

export function getChartData(transactions) {
  const byDate = transactions.reduce((result, item) => {
    const key = item.date || 'Sin fecha'
    result[key] ||= { date: key, credits: 0, debits: 0 }
    if (item.movement_type === 'Credit') result[key].credits += 1
    if (item.movement_type === 'Debit') result[key].debits += 1
    return result
  }, {})
  return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date))
}

export function getAmountData(transactions) {
  const byDate = transactions.reduce((result, item) => {
    const key = item.date || 'Sin fecha'
    result[key] ||= { date: key, amount: 0 }
    result[key].amount += parseAmount(item.amount)
    return result
  }, {})
  return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date))
}

export function getExecutionStatusData(executions) {
  const totals = executions.reduce((result, execution) => {
    const key = execution.estado || 'Sin estado'
    result[key] = (result[key] || 0) + 1
    return result
  }, {})
  return Object.entries(totals).map(([name, total]) => ({ name, total }))
}

export function getPieData(metrics) {
  return [{ name: 'Créditos', value: metrics.credits, color: '#18a979' }, { name: 'Débitos', value: metrics.debits, color: '#ef6b68' }].filter((item) => item.value > 0)
}
