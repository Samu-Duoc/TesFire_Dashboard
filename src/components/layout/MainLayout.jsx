import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

function MainLayout({ activePath, onNavigate, onRefresh, loading, lastUpdated, error, title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 760)
  const handleNavigate = (path) => {
    onNavigate(path)
    setSidebarOpen(false)
  }

  return <div className="app-shell"><Sidebar activePath={activePath} onNavigate={handleNavigate} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onToggle={() => setSidebarOpen((open) => !open)} /><main className="main-content"><Header onRefresh={onRefresh} loading={loading} lastUpdated={lastUpdated} menuOpen={sidebarOpen} onMenuToggle={() => setSidebarOpen((open) => !open)} sidebarOpen={sidebarOpen} /><div className="content">{error && <div className="error-banner"><AlertCircle size={19} /><div><strong>No fue posible conectar con la API</strong><span>{error}</span></div><button onClick={onRefresh}>Reintentar</button></div>}<div className="page-intro"><div><p className="eyebrow">{activePath === '/' ? 'VISTA GENERAL' : 'MONITOREO'}</p><h2>{title}</h2><p className="intro-copy">Supervisa en tiempo real los movimientos procesados por Rocketbot.</p></div><div className={`api-status ${error ? 'offline' : 'online'}`}><span />{error ? 'API sin conexión' : 'API operativa'}</div></div>{children}</div></main></div>
}

export default MainLayout
