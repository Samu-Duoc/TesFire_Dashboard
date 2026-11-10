import { ArrowDownLeft, ArrowUpRight, Clock3, WalletCards } from 'lucide-react'
import { formatDate } from '../common/dashboardUtils'
import StatCard from './StatCard'

function DashboardCards({ data, metrics }) {
  return <div className="stats-grid"><StatCard title="Movimientos registrados" value={metrics.total} caption="Registros en cuenta 800002" icon={WalletCards} tone="blue" /><StatCard title="Total de créditos" value={metrics.credits} caption="Depósitos identificados" icon={ArrowDownLeft} tone="green" /><StatCard title="Total de débitos" value={metrics.debits} caption="Retiros identificados" icon={ArrowUpRight} tone="red" /><StatCard title="Última ejecución" value={metrics.lastExecution ? formatDate(metrics.lastExecution, true) : 'Sin registro'} caption={data.executions[0]?.estado || 'Sin ejecuciones'} icon={Clock3} tone="purple" /></div>
}

export default DashboardCards
