import { useMemo } from 'react'
import DailySummary from '../components/dashboard/DailySummary'
import { getDayKey } from '../components/dashboard/dailySummaryUtils'

function DailySummaryPage({ data }) {
  const transactions = data?.transactions
  const executions = data?.executions
  const dailySummary = useMemo(() => {
    const executionCounts = (executions || []).reduce((result, execution) => {
      const date = getDayKey(execution?.fecha_recepcion)
      if (date) result[date] = (result[date] || 0) + 1
      return result
    }, {})
    const grouped = (transactions || []).reduce((result, item) => {
      const date = getDayKey(item?.date)
      if (!date) return result
      result[date] ||= { date, total: 0, credits: 0, debits: 0, executions: executionCounts[date] || 0 }
      result[date].total += 1
      if (item?.movement_type === 'Credit') result[date].credits += 1
      if (item?.movement_type === 'Debit') result[date].debits += 1
      return result
    }, {})
    return Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date))
  }, [executions, transactions])

  return <DailySummary rows={dailySummary} transactions={transactions} executions={executions} />
}

export default DailySummaryPage
