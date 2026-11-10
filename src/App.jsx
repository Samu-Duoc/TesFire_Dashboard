import { useEffect, useMemo, useState } from 'react'
import './App.css'
import MainLayout from './components/layout/MainLayout'
import LoadingState from './components/common/LoadingState'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import AnalysisPage from './pages/AnalysisPage'
import ExecutionsPage from './pages/ExecutionsPage'
import SystemStatusPage from './pages/SystemStatusPage'
import LogsPage from './pages/LogsPage'
import useDashboardData from './services/useDashboardData'
import { getAmountData, getChartData, getExecutionStatusData, getMetrics, getPieData } from './services/dashboardSelectors'

const routes = {
  '/': { title: 'Vista general', page: DashboardPage },
  '/movimientos': { title: 'Movimientos', page: TransactionsPage },
  '/analisis': { title: 'Análisis de transacciones', page: AnalysisPage },
  '/ejecuciones': { title: 'Historial de ejecuciones', page: ExecutionsPage },
  '/estado': { title: 'Estado del sistema', page: SystemStatusPage },
  '/logs': { title: 'Logs', page: LogsPage },
}

function App() {
  const [path, setPath] = useState(() => routes[window.location.pathname] ? window.location.pathname : '/')
  const { data, loading, error, lastUpdated, loadData } = useDashboardData()

  useEffect(() => {
    const handlePopState = () => setPath(routes[window.location.pathname] ? window.location.pathname : '/')
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (nextPath) => {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
  }

  const metrics = useMemo(() => getMetrics(data), [data])
  const chartData = useMemo(() => getChartData(data.transactions), [data.transactions])
  const amountData = useMemo(() => getAmountData(data.transactions), [data.transactions])
  const executionStatusData = useMemo(() => getExecutionStatusData(data.executions), [data.executions])
  const pieData = useMemo(() => getPieData(metrics), [metrics])
  const route = routes[path]
  const Page = route.page
  const pageProps = { data, metrics, chartData, pieData, amountData, executionStatusData, transactions: data.transactions, executions: data.executions, logs: data.logs, health: data.health, loading, lastUpdated, error }

  return <MainLayout activePath={path} onNavigate={navigate} onRefresh={loadData} loading={loading} lastUpdated={lastUpdated} error={error} title={route.title}>{loading && !data.transactions.length ? <LoadingState /> : <Page {...pageProps} />}</MainLayout>
}

export default App
