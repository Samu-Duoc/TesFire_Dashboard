import { useMemo } from 'react'
import { formatDate } from '../common/dashboardUtils'

function getDuration(execution) {
  if (execution?.duracion || execution?.duration || execution?.duracion_segundos) return execution.duracion || execution.duration || `${execution.duracion_segundos}s`
  if (execution?.fecha_inicio && execution?.fecha_fin) {
    const duration = new Date(execution.fecha_fin).getTime() - new Date(execution.fecha_inicio).getTime()
    if (Number.isFinite(duration) && duration >= 0) return `${Math.round(duration / 1000)}s`
  }
  return 'N/D'
}

function ExecutionsTable({ executions = [] }) {
  const orderedExecutions = useMemo(() => [...executions].sort((a, b) => String(b?.fecha_inicio || b?.fecha_recepcion || '').localeCompare(String(a?.fecha_inicio || a?.fecha_recepcion || ''))), [executions])
  const summary = useMemo(() => {
    const successful = orderedExecutions.filter((execution) => execution?.estado === 'procesada').length
    return { successful, failed: orderedExecutions.length - successful, total: orderedExecutions.length }
  }, [orderedExecutions])
  const successRate = summary.total ? Math.round((summary.successful / summary.total) * 100) : 0

  return <section className="panel analysis-table-panel"><div className="execution-summary"><span>Exitosas <strong>{summary.successful}</strong></span><span>Fallidas <strong>{summary.failed}</strong></span><span>Total <strong>{summary.total}</strong></span><span>% de éxito <strong>{successRate}%</strong></span></div><div className="panel-heading"><div><h2>Ejecuciones registradas</h2><p>Procesos ordenados de más reciente a más antiguo.</p></div></div><div className="table-scroll analysis-executions-scroll"><table><thead><tr><th>Fecha</th><th>Hora de inicio</th><th>Resultado</th><th>Procesadas</th><th>Duración</th></tr></thead><tbody>{orderedExecutions.length ? orderedExecutions.map((execution, index) => { const successful = execution?.estado === 'procesada'; return <tr key={execution?._id || index}><td>{formatDate(execution?.fecha_inicio || execution?.fecha_recepcion)}</td><td>{formatDate(execution?.fecha_inicio || execution?.fecha_recepcion, true)}</td><td><span className={`execution-result ${successful ? 'success' : 'failed'}`}>{successful ? 'Exitosa' : 'Fallida'}</span></td><td>{execution?.total_guardado ?? execution?.total_transacciones ?? 0}</td><td>{getDuration(execution)}</td></tr> }) : <tr><td colSpan="5"><div className="empty-table">Sin ejecuciones registradas</div></td></tr>}</tbody></table></div></section>
}

export default ExecutionsTable
