import { AlertCircle, CheckCircle2, Database, RefreshCw, Server } from 'lucide-react'
import { formatDate } from '../components/common/dashboardUtils'

function SystemStatusPage({ health, loading, lastUpdated, error, apiStatus }) {
  const connected = Boolean(health?.success)
  const hasProblems = apiStatus === 'problems'
  const isOffline = apiStatus === 'offline'
  const statusText = hasProblems ? 'API con problemas' : apiStatus === 'offline' ? 'Sin conexión' : 'Conectado'
  return <div className="system-grid"><section className="panel system-summary"><div className={`system-hero ${connected || !isOffline && !hasProblems ? 'online' : 'offline'}`}><div className="system-hero-icon">{connected ? <CheckCircle2 size={30} /> : <AlertCircle size={30} />}</div><div><h2>{connected ? 'Sistema operativo' : hasProblems ? 'API con problemas' : isOffline ? 'Sistema sin conexión' : 'API operativa'}</h2><p>{connected ? 'FastAPI respondió correctamente a la última consulta.' : (error || 'No hay una respuesta disponible de FastAPI.')}</p></div></div><div className="status-list"><div><Server size={18} /><span>FastAPI<strong>{statusText}</strong></span><b className={connected ? 'status-ok' : hasProblems ? 'status-error' : isOffline ? 'status-error' : 'status-neutral'}>{connected ? 'OK' : hasProblems ? 'WARN' : isOffline ? 'ERROR' : 'N/D'}</b></div><div><Database size={18} /><span>MongoDB Atlas<strong>{health?.database || 'Estado no disponible'}</strong></span><b className={health?.database ? 'status-ok' : 'status-neutral'}>{health?.database ? 'OK' : 'N/D'}</b></div><div><RefreshCw size={18} /><span>Actualización<strong>{lastUpdated ? formatDate(lastUpdated, true) : 'Sin actualización'}</strong></span><b className={loading ? 'status-neutral' : 'status-ok'}>{loading ? 'EN CURSO' : 'ACTUALIZADO'}</b></div></div></section><section className="panel endpoint-panel"><h2>Endpoints supervisados</h2><p>Fuentes consultadas por el dashboard.</p><div className="endpoint-row"><span>GET</span><code>/api/health</code></div><div className="endpoint-row"><span>GET</span><code>/api/transacciones?account=800002</code></div><div className="endpoint-row"><span>GET</span><code>/api/ejecuciones</code></div></section></div>
}

export default SystemStatusPage
