import { useCallback, useEffect, useState } from 'react'
import { fetchDashboardData } from './api'

const initialData = { transactions: [], executions: [], health: null, logs: [] }

function useDashboardData() {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')
  const [healthFailures, setHealthFailures] = useState(0)
  const [apiStatus, setApiStatus] = useState('online')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const nextData = await fetchDashboardData()
      const nextHealthFailures = nextData.healthError ? healthFailures + 1 : 0
      setHealthFailures(nextHealthFailures)
      setApiStatus(nextData.healthError?.status === 503
        ? 'problems'
        : nextHealthFailures >= 2 ? 'offline' : 'online')
      setData(nextData)
      if (nextData.healthError) setError(nextData.healthError?.sentence || nextData.healthError?.message || 'La API no respondió correctamente.')
      setLastUpdated(new Date().toISOString())
    } catch (requestError) {
      const nextHealthFailures = requestError?.healthOk
        ? 0
        : requestError?.healthError ? healthFailures + 1 : healthFailures
      if (requestError?.healthOk || requestError?.healthError) {
        setHealthFailures(nextHealthFailures)
        setApiStatus(requestError.healthError?.status === 503
          ? 'problems'
          : nextHealthFailures >= 2 ? 'offline' : 'online')
      }
      setError(requestError?.sentence || requestError?.message || 'No se pudo acceder a la API.')
    } finally {
      setLoading(false)
    }
  }, [healthFailures])

  useEffect(() => {
    const timer = setTimeout(loadData, 0)
    return () => clearTimeout(timer)
  }, [loadData])

  useEffect(() => {
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [loadData])

  return { data, loading, error, lastUpdated, loadData, apiStatus }
}

export default useDashboardData
