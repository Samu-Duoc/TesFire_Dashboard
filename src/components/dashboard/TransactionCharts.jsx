import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartCard from '../common/ChartCard'
import EmptyChart from '../common/EmptyChart'
import ExecutionsTable from './ExecutionsTable'
import TransactionsTable from './TransactionsTable'

function TransactionCharts({ metrics, chartData, pieData, transactions = [], executions = [], compact = false }) {
  const hasData = metrics.total > 0
  return <div className={`charts-grid ${compact ? 'compact-charts' : ''}`}>
    <ChartCard title="Créditos vs. débitos" subtitle="Cantidad de movimientos por tipo" className="bar-panel">{hasData ? <ResponsiveContainer width="100%" height={260}><BarChart data={[{ name: 'Movimientos', Créditos: metrics.credits, Débitos: metrics.debits }]} barGap={14}><CartesianGrid vertical={false} stroke="#edf0f4" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} width={30} /><Tooltip cursor={{ fill: '#f5f8fc' }} /><Bar dataKey="Créditos" fill="#18a979" radius={[5, 5, 0, 0]} barSize={42} /><Bar dataKey="Débitos" fill="#ef6b68" radius={[5, 5, 0, 0]} barSize={42} /></BarChart></ResponsiveContainer> : <EmptyChart />}</ChartCard>
    <ChartCard title="Distribución de transacciones" subtitle="Proporción por tipo de movimiento" className="pie-panel">{pieData.length ? <div className="pie-wrap"><ResponsiveContainer width="52%" height={260}><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" paddingAngle={4} stroke="none">{pieData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="pie-legend">{pieData.map((item) => <div key={item.name}><span className="legend-dot" style={{ background: item.color }} /><span>{item.name}</span><strong>{Math.round((item.value / metrics.total) * 100)}%</strong></div>)}</div></div> : <EmptyChart />}</ChartCard>
    <ChartCard title="Movimientos por fecha" subtitle="Evolución diaria de créditos y débitos" className="line-panel">{hasData ? <ResponsiveContainer width="100%" height={260}><LineChart data={chartData}><CartesianGrid vertical={false} stroke="#edf0f4" /><XAxis dataKey="date" axisLine={false} tickLine={false} tickFormatter={(value) => value.slice(5)} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} width={30} /><Tooltip /><Line type="monotone" dataKey="credits" name="Créditos" stroke="#18a979" strokeWidth={3} dot={{ r: 4, fill: '#18a979', strokeWidth: 0 }} /><Line type="monotone" dataKey="debits" name="Débitos" stroke="#ef6b68" strokeWidth={3} dot={{ r: 4, fill: '#ef6b68', strokeWidth: 0 }} /></LineChart></ResponsiveContainer> : <EmptyChart />}</ChartCard>
    {!compact && <><TransactionsTable transactions={transactions} executions={executions} /><ExecutionsTable executions={executions} /></>}
  </div>
}

export default TransactionCharts
