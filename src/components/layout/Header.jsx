import { Menu, RefreshCw, X } from 'lucide-react'
import { formatDate } from '../common/dashboardUtils'

function Header({ onRefresh, loading, lastUpdated, onMenuToggle, menuOpen, sidebarOpen }) {
  return <header className={`topbar ${sidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}><div className="header-title"><button className="menu-toggle" onClick={onMenuToggle} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button><div><div className="breadcrumb">MONITOREO / CUENTA 800002</div><h1>Panel de monitoreo</h1></div></div><div className="topbar-actions"><div className="last-sync"><span>Última actualización</span><strong>{lastUpdated ? formatDate(lastUpdated, true) : 'Pendiente'}</strong></div><button className="refresh-button" onClick={onRefresh} disabled={loading} aria-label="Actualizar datos"><RefreshCw size={17} className={loading ? 'spin' : ''} /><span>Actualizar</span></button></div></header>
}

export default Header
