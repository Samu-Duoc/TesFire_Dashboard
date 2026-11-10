import { useCallback, useEffect, useState } from 'react'
import { fetchDashboardData } from './api'

const initialData = { transactions: [], executions: [], health: null, logs: [] }

function useDashboardData() {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(await fetchDashboardData())
      setLastUpdated(new Date().toISOString())
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
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

  return { data, loading, error, lastUpdated, loadData }
}

export default useDashboardData
