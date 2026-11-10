import { useMemo, useState } from 'react'
import { formatDate } from '../components/common/dashboardUtils'

function LogsPage({ logs, executions }) {
  const [level, setLevel] = useState('all')
  const [executionId, setExecutionId] = useState('all')
  const filteredLogs = useMemo(() => logs.filter((log) => (level === 'all' || log.nivel === level) && (executionId === 'all' || log.ejecucion_id === executionId)), [executionId, level, logs])
  return <section className="panel logs-panel"><div className="panel-heading table-heading"><div><h2>Logs y trazabilidad</h2><p>Eventos registrados durante el procesamiento de la cuenta 800002</p></div><div className="table-controls"><select value={level} onChange={(event) => setLevel(event.target.value)} aria-label="Filtrar logs por nivel"><option value="all">Todos los niveles</option><option value="INFO">INFO</option><option value="WARNING">WARNING</option><option value="ERROR">ERROR</option></select><select value={executionId} onChange={(event) => setExecutionId(event.target.value)} aria-label="Filtrar logs por ejecución"><option value="all">Todas las ejecuciones</option>{executions.map((execution) => <option value={execution._id} key={execution._id}>{execution._id}</option>)}</select></div></div><div className="logs-list">{filteredLogs.length ? filteredLogs.map((log) => <article className={`log-row ${log.nivel?.toLowerCase() || ''}`} key={log._id}><div className="log-level">{log.nivel || 'N/D'}</div><div className="log-content"><strong>{log.evento || 'Evento sin nombre'}</strong><p>{log.mensaje || 'Sin mensaje'}</p><span>{formatDate(log.fecha_hora, true)}{log.ejecucion_id ? ` · Ejecución ${log.ejecucion_id}` : ''}</span></div></article>) : <div className="empty-table">No existen logs para los filtros seleccionados.</div>}</div><div className="table-footer">{filteredLogs.length} {filteredLogs.length === 1 ? 'evento' : 'eventos'} encontrados</div></section>
}

export default LogsPage
