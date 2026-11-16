import { useMemo, useRef, useState } from 'react'
import { Eye } from 'lucide-react'
import DetalleDia from './DetalleDia'
import { getMetrics } from '../../services/dashboardSelectors'
import { getDayKey } from './dailySummaryUtils'

function formatDay(value) {
  const parts = String(value || '').slice(0, 10).split('-')
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value || 'Sin fecha'
}

function DailySummary({ rows = [], transactions = [], executions = [] }) {
  const [selectedDay, setSelectedDay] = useState(null)
  const summaryRef = useRef(null)
  const availableDays = useMemo(() => rows.map((row) => row?.date).filter(Boolean), [rows])
  const selectedTransactions = useMemo(
    () => selectedDay ? transactions.filter((item) => getDayKey(item?.date) === selectedDay) : [],
    [selectedDay, transactions],
  )
  const selectedExecutions = useMemo(
    () => selectedDay ? executions.filter((execution) => getDayKey(execution?.fecha_recepcion) === selectedDay) : [],
    [selectedDay, executions],
  )
  const selectedRow = useMemo(() => rows.find((row) => row?.date === selectedDay), [rows, selectedDay])
  const totals = rows.reduce((result, row) => ({
    total: result.total + row.total,
    credits: result.credits + row.credits,
    debits: result.debits + row.debits,
    executions: result.executions + row.executions,
  }), { total: 0, credits: 0, debits: 0, executions: 0 })
  const totalCreditRate = totals.total ? Math.round((totals.credits / totals.total) * 100) : 0
  const openDetail = (date) => {
    setSelectedDay(date)
    requestAnimationFrame(() => summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
  const closeDetail = () => setSelectedDay(null)
  const selectedIndex = availableDays.indexOf(selectedDay)
  const selectPreviousDay = () => selectedIndex > 0 && openDetail(availableDays[selectedIndex - 1])
  const selectNextDay = () => selectedIndex >= 0 && selectedIndex < availableDays.length - 1 && openDetail(availableDays[selectedIndex + 1])

  return <section className="panel day-summary-panel" id="resumen-dias" ref={summaryRef}>{selectedDay ? <DetalleDia date={selectedDay} row={selectedRow} transactions={selectedTransactions} executions={selectedExecutions} metrics={getMetrics({ transactions: selectedTransactions, executions: selectedExecutions })} availableDays={availableDays} selectedIndex={selectedIndex} onBack={closeDetail} onPrevious={selectPreviousDay} onNext={selectNextDay} onSelect={openDetail} /> : <><div className="panel-heading"><div><h2>Resumen por día</h2><p>Movimientos agrupados por fecha</p></div></div><div className="table-scroll day-summary-scroll"><table><thead><tr><th>Fecha</th><th>Total movimientos</th><th>Créditos</th><th>Débitos</th><th>% Créditos</th><th>Ejecuciones</th><th>Detalle</th></tr></thead><tbody>{rows.length ? rows.map((row) => <tr key={row.date}><td>{formatDay(row.date)}</td><td>{row.total}</td><td>{row.credits}</td><td>{row.debits}</td><td>{row.total ? `${Math.round((row.credits / row.total) * 100)}%` : '0%'}</td><td>{row.executions}</td><td><button className="day-detail-button" type="button" onClick={() => openDetail(row.date)} aria-label="Ver detalle del día" title="Ver detalle del día"><Eye size={16} /></button></td></tr>) : <tr><td colSpan="7"><div className="empty-table">Sin actividad registrada</div></td></tr>}<tr className="day-summary-total"><td>Totales</td><td>{totals.total}</td><td>{totals.credits}</td><td>{totals.debits}</td><td>{totalCreditRate}%</td><td>{totals.executions}</td><td /></tr></tbody></table></div></>}</section>
}

export default DailySummary
