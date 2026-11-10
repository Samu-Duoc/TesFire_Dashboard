import DashboardCards from '../components/dashboard/DashboardCards'
import TransactionCharts from '../components/dashboard/TransactionCharts'

function DashboardPage({ data, metrics, chartData, pieData }) {
  return <><DashboardCards data={data} metrics={metrics} /><TransactionCharts metrics={metrics} chartData={chartData} pieData={pieData} compact /></>
}

export default DashboardPage
