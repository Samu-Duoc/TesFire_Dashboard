import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchDashboardData } from './api'

const initialData = { transactions: [], executions: [], health: null, logs: [] }

function useDashboardData() {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')
  const [apiStatus, setApiStatus] = useState('online')
  const isLoadingRef = useRef(false)
  const healthFailuresRef = useRef(0)

  const loadData = useCallback(async () => {
    if (isLoadingRef.current) return
    isLoadingRef.current = true
    setLoading(true)
    setError('')
    try {
      const nextData = await fetchDashboardData()
      const nextHealthFailures = nextData.healthError ? healthFailuresRef.current + 1 : 0
      healthFailuresRef.current = nextHealthFailures
      setApiStatus(nextData.healthError?.status === 503
        ? 'problems'
        : nextHealthFailures >= 2 ? 'offline' : 'online')
      setData(nextData)
      const requestError = nextData.errors?.[0]?.error
      setError(requestError?.sentence || requestError?.message || '')
      setLastUpdated(new Date().toISOString())
    } catch (requestError) {
      setError(requestError?.sentence || requestError?.message || 'No se pudo acceder a la API.')
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
  }, [])

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
