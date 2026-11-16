import { useMemo } from 'react'
import { formatAmount, formatDate, parseAmount } from '../common/dashboardUtils'

function getHour(value) {
  const match = String(value || '').match(/[T ](\d{2}):(\d{2})/)
  return match ? `${match[1]}:${match[2]}` : 'Sin hora'
}

function TransactionsTable({ transactions = [], executions = [], mode = 'analysis' }) {
  const isAnalysis = mode === 'analysis'
  const hasDescription = useMemo(() => transactions.some((item) => item?.description || item?.descripcion || item?.mensaje), [transactions])
  const executionsById = useMemo(() => new Map(executions.map((execution) => [execution?._id, execution])), [executions])
  const orderedTransactions = useMemo(() => [...transactions].sort((a, b) => String(b?.date || '').localeCompare(String(a?.date || ''))), [transactions])
  const totals = useMemo(() => orderedTransactions.reduce((result, item) => {
    const amount = parseAmount(item?.amount)
    if (item?.movement_type === 'Credit') result.credits += amount
    if (item?.movement_type === 'Debit') result.debits += amount
    return result
  }, { credits: 0, debits: 0 }), [orderedTransactions])

  return <section className={`panel ${isAnalysis ? 'analysis-table-panel' : 'day-transactions-panel'}`}>{isAnalysis && <div className="transaction-summary"><span>Total créditos <strong>{formatAmount(totals.credits)}</strong></span><span>Total débitos <strong>{formatAmount(totals.debits)}</strong></span><span>Neto <strong>{formatAmount(totals.credits - totals.debits)}</strong></span></div>}<div className="panel-heading"><div><h2>{isAnalysis ? 'Transacciones del periodo' : 'Transacciones del día'}</h2><p>{isAnalysis ? 'Movimientos ordenados de más reciente a más antigua.' : 'Detalle de los movimientos registrados.'}</p></div></div><div className={`table-scroll ${isAnalysis ? 'analysis-transactions-scroll' : 'day-transactions-scroll'}`}><table><thead>{isAnalysis ? <tr><th>Fecha</th><th>Hora de inicio</th><th>Cuenta</th><th>Tipo</th><th>Monto</th>{hasDescription && <th>Descripción</th>}</tr> : <tr><th>Hora</th><th>Tipo</th><th>Monto</th><th>Cuenta</th><th>Ejecución</th></tr>}</thead><tbody>{orderedTransactions.length ? orderedTransactions.map((item, index) => { const execution = executionsById.get(item?.ejecucion_id); return <tr key={item?._id || `${item?.account || 'sin-cuenta'}-${item?.date || index}`}>{isAnalysis ? <><td>{formatDate(item?.date)}</td><td>{formatDate(execution?.fecha_inicio || execution?.fecha_recepcion || item?.date, true)}</td><td>{item?.account || 'Sin cuenta'}</td><td className={item?.movement_type === 'Credit' ? 'credit-text' : 'debit-text'}>{item?.movement_type === 'Credit' ? 'Crédito' : 'Débito'}</td><td className={item?.movement_type === 'Credit' ? 'credit-text' : 'debit-text'}>{formatAmount(parseAmount(item?.amount))}</td>{hasDescription && <td>{item?.description || item?.descripcion || item?.mensaje || 'Sin descripción'}</td>}</> : <><td>{getHour(item?.date)}</td><td>{item?.movement_type === 'Credit' ? 'Crédito' : 'Débito'}</td><td>{item?.amount || '0'}</td><td>{item?.account || 'Sin cuenta'}</td><td>{item?.ejecucion_id || 'Sin ejecución'}</td></>}</tr> }) : <tr><td colSpan={isAnalysis ? hasDescription ? 6 : 5 : 5}><div className="empty-table">{isAnalysis ? 'Sin transacciones en el periodo' : 'Sin actividad registrada para este día'}</div></td></tr>}</tbody></table></div></section>
}

export default TransactionsTable
