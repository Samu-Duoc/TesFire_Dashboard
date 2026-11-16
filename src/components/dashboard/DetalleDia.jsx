import { ArrowDownLeft, ArrowUpRight, BarChart3, WalletCards } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts'
import ChartCard from '../common/ChartCard'
import StatCard from './StatCard'
import TransactionsTable from './TransactionsTable'
import { formatAmount, formatDate, parseAmount } from '../common/dashboardUtils'

function formatDay(value) {
  const parts = String(value || '').slice(0, 10).split('-')
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value || 'Sin fecha'
}

function getHour(value) {
  const match = String(value || '').match(/[T ](\d{2}):(\d{2})/)
  return match ? Number(match[1]) : null
}

function ScatterTooltip({ active, payload }) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null
  return <div className="detail-tooltip"><strong>{point.type}</strong><span>Hora: {point.hour}:00</span><span>Monto: {formatAmount(point.amount)}</span></div>
}

function DetalleDia({ date, row, transactions = [], executions = [], metrics, availableDays = [], selectedIndex, onBack, onPrevious, onNext, onSelect }) {
  const hasHourlyData = transactions.some((item) => getHour(item?.date) !== null)
  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({ hour: String(hour).padStart(2, '0'), credits: 0, debits: 0 }))
  const scatterCredits = []
  const scatterDebits = []
  transactions.forEach((item) => {
    const hour = getHour(item?.date)
    if (hour === null) return
    const type = item?.movement_type === 'Credit' ? 'Crédito' : 'Débito'
    hourlyData[hour][item?.movement_type === 'Credit' ? 'credits' : 'debits'] += 1
    const point = { hour, amount: parseAmount(item?.amount), type }
    if (item?.movement_type === 'Credit') scatterCredits.push(point)
    if (item?.movement_type === 'Debit') scatterDebits.push(point)
  })
  const pieData = [{ name: 'Créditos', value: metrics?.credits || 0, color: '#18a979' }, { name: 'Débitos', value: metrics?.debits || 0, color: '#ef6b68' }].filter((item) => item.value > 0)
  const isFirst = selectedIndex <= 0
  const isLast = selectedIndex < 0 || selectedIndex >= availableDays.length - 1

  return <div className="day-detail">
    <div className="day-detail-navigation">
      <button type="button" className="day-back-button" onClick={onBack}>← Volver al resumen</button>
      <div className="day-step-controls">
        <button type="button" onClick={onPrevious} disabled={isFirst} aria-label="Día anterior">‹ Día anterior</button>
        <select value={date} onChange={(event) => onSelect(event.target.value)} aria-label="Seleccionar día">{availableDays.map((day) => <option value={day} key={day}>{formatDay(day)}</option>)}</select>
        <button type="button" onClick={onNext} disabled={isLast} aria-label="Día siguiente">Día siguiente ›</button>
      </div>
    </div>
    <div className="panel-heading"><div><h2>Detalle del día · {formatDay(date)}</h2><p>Movimientos y actividad registrados para esta fecha.</p></div></div>
    {!row || !transactions.length ? <div className="empty-table">Sin actividad registrada para este día</div> : <>
      <div className="stats-grid day-detail-stats">
        <StatCard title="Total movimientos" value={metrics?.total || 0} caption="Movimientos del día" icon={WalletCards} tone="blue" />
        <StatCard title="Créditos" value={metrics?.credits || 0} caption="Depósitos identificados" icon={ArrowDownLeft} tone="green" />
        <StatCard title="Débitos" value={metrics?.debits || 0} caption="Retiros identificados" icon={ArrowUpRight} tone="red" />
        <StatCard title="% Créditos" value={`${metrics?.total ? Math.round((metrics.credits / metrics.total) * 100) : 0}%`} caption="Sobre el total del día" icon={BarChart3} tone="purple" />
      </div>
      <div className="charts-grid day-detail-charts">
        <ChartCard title="Créditos vs. débitos" subtitle="Cantidad de movimientos por tipo"><ResponsiveContainer width="100%" height={260}><BarChart data={[{ name: 'Movimientos', Créditos: metrics?.credits || 0, Débitos: metrics?.debits || 0 }]} barGap={14}><CartesianGrid vertical={false} stroke="#edf0f4" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} width={30} /><Tooltip /><Bar dataKey="Créditos" fill="#18a979" radius={[5, 5, 0, 0]} barSize={42} /><Bar dataKey="Débitos" fill="#ef6b68" radius={[5, 5, 0, 0]} barSize={42} /></BarChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Distribución de transacciones" subtitle="Proporción por tipo de movimiento">{pieData.length ? <div className="pie-wrap"><ResponsiveContainer width="52%" height={260}><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" paddingAngle={4} stroke="none">{pieData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="pie-legend">{pieData.map((item) => <div key={item.name}><span className="legend-dot" style={{ background: item.color }} /><span>{item.name}</span><strong>{Math.round((item.value / (metrics?.total || 1)) * 100)}%</strong></div>)}</div></div> : <div className="empty-chart">Sin actividad registrada</div>}</ChartCard>
        {hasHourlyData ? <><ChartCard title="Movimientos por hora" subtitle="Cantidad de movimientos por hora"><ResponsiveContainer width="100%" height={260}><LineChart data={hourlyData}><CartesianGrid vertical={false} stroke="#edf0f4" /><XAxis dataKey="hour" axisLine={false} tickLine={false} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} width={30} /><Tooltip /><Line type="monotone" dataKey="credits" name="Créditos" stroke="#18a979" strokeWidth={3} dot={{ r: 4, fill: '#18a979', strokeWidth: 0 }} /><Line type="monotone" dataKey="debits" name="Débitos" stroke="#ef6b68" strokeWidth={3} dot={{ r: 4, fill: '#ef6b68', strokeWidth: 0 }} /></LineChart></ResponsiveContainer></ChartCard><ChartCard title="Hora vs. monto" subtitle="Monto de cada transacción"><ResponsiveContainer width="100%" height={260}><ScatterChart><CartesianGrid stroke="#edf0f4" /><XAxis type="number" dataKey="hour" domain={[0, 23]} tickFormatter={(value) => String(value).padStart(2, '0')} name="Hora" /><YAxis type="number" dataKey="amount" name="Monto" tickFormatter={(value) => `$${value}`} /><Tooltip content={<ScatterTooltip />} /><Scatter name="Créditos" data={scatterCredits} fill="#18a979" /><Scatter name="Débitos" data={scatterDebits} fill="#ef6b68" /></ScatterChart></ResponsiveContainer></ChartCard></> : <div className="detail-hour-notice">Sin información de hora disponible</div>}
      </div>
      <TransactionsTable transactions={transactions} mode="day" />
      {executions.length ? <section className="panel day-executions-panel"><div className="panel-heading"><div><h2>Ejecuciones del día</h2><p>Hora de inicio y resultado.</p></div></div><div className="day-executions-list">{executions.map((execution, index) => <div className="day-execution-row" key={execution?._id || index}><span>{formatDate(execution?.fecha_inicio || execution?.fecha_recepcion, true)}</span><strong>{execution?.estado || 'Resultado no disponible'}</strong></div>)}</div></section> : null}
    </>}
  </div>
}

export default DetalleDia
