import { Activity, ArrowDownLeft, BarChart3, Clock3 } from 'lucide-react'
import StatCard from '../components/dashboard/StatCard'
import TransactionCharts from '../components/dashboard/TransactionCharts'

function AnalysisPage({ data, metrics, chartData, pieData, amountData, executionStatusData }) {
  const activeDays = new Set(data.transactions.map((item) => item.date).filter(Boolean)).size
  const averagePerDay = activeDays ? (metrics.total / activeDays).toFixed(1) : '0'
  const creditRate = metrics.total ? `${Math.round((metrics.credits / metrics.total) * 100)}%` : '0%'
  return <><div className="stats-grid analysis-stats"><StatCard title="Promedio diario" value={averagePerDay} caption="Movimientos por día activo" icon={Activity} tone="blue" /><StatCard title="Tasa de créditos" value={creditRate} caption="Sobre el total registrado" icon={ArrowDownLeft} tone="green" /><StatCard title="Días con actividad" value={activeDays} caption="Fechas con movimientos" icon={Clock3} tone="purple" /><StatCard title="Ejecuciones recibidas" value={data.executions.length} caption="Historial disponible" icon={BarChart3} tone="red" /></div><TransactionCharts metrics={metrics} chartData={chartData} pieData={pieData} amountData={amountData} executionStatusData={executionStatusData} /></>
}

export default AnalysisPage
