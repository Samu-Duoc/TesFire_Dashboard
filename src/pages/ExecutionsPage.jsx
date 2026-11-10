import { useState } from 'react'
import { ChevronDown, Clock3 } from 'lucide-react'
import MovementTable from '../components/transactions/MovementTable'
import { formatDate } from '../components/common/dashboardUtils'

function ExecutionsPage({ executions, transactions }) {
  const [expanded, setExpanded] = useState(null)
  return <section className="panel execution-panel"><div className="panel-heading"><div><h2>Historial de ejecuciones</h2><p>Procesos reportados por FastAPI y Rocketbot</p></div><span className="record-count">{executions.length} ejecuciones</span></div>{executions.length ? <div className="execution-list">{executions.map((execution) => { const records = transactions.filter((item) => item.ejecucion_id === execution._id); const isOpen = expanded === execution._id; return <div className="execution-item" key={execution._id}><button className="execution-row" onClick={() => setExpanded(isOpen ? null : execution._id)}><div className="execution-icon"><Clock3 size={17} /></div><div className="execution-main"><strong>{execution.ejecucion || 'Ejecución sin nombre'}</strong><span>{formatDate(execution.fecha_recepcion, true)} · ID: {execution._id || 'No disponible'}</span></div><div className="execution-meta"><strong>{execution.total_transacciones ?? records.length} transacciones</strong><span className={`execution-status ${execution.estado === 'procesada' ? 'success' : ''}`}>{execution.estado || 'Resultado no disponible'}</span></div><ChevronDown size={17} className={isOpen ? 'chevron open' : 'chevron'} /></button>{isOpen && <div className="execution-details"><p><strong>Origen:</strong> {execution.origen || 'No disponible'} &nbsp; <strong>Guardado:</strong> {execution.total_guardado ?? 'No disponible'}</p>{records.length ? <MovementTable transactions={records} showHeading={false} /> : <span className="detail-empty">No hay registros asociados disponibles para esta ejecución.</span>}</div>}</div> })}</div> : <div className="empty-table">La API no devolvió ejecuciones.</div>}</section>
}

export default ExecutionsPage
