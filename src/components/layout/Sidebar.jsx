import { Activity, BarChart3, Clock3, FileText, Menu, ShieldCheck, WalletCards, X } from 'lucide-react'

const menuItems = [
  { label: 'Resumen general', path: '/', icon: BarChart3 },
  { label: 'Movimientos', path: '/movimientos', icon: WalletCards },
  { label: 'Análisis de transacciones', path: '/analisis', icon: Activity },
  { label: 'Historial de ejecuciones', path: '/ejecuciones', icon: Clock3 },
  { label: 'Estado del sistema', path: '/estado', icon: ShieldCheck },
  { label: 'Logs del sistema', path: '/logs', icon: FileText },
]

function Sidebar({ activePath, onNavigate, isOpen, onClose, onToggle }) {
  return (
    <>
    <div className={`sidebar-backdrop ${isOpen ? 'visible' : ''}`} onClick={onClose} aria-hidden="true" />
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="brand"><div className="brand-mark"><Activity size={21} /></div><div><strong>TestFire</strong><span>ANALYTICS</span></div></div>
      <button className="sidebar-toggle" onClick={onToggle} aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={isOpen}>{isOpen ? <X size={20} /> : <Menu size={20} />}</button>
      <nav className="navigation" aria-label="Navegación principal">
        <span className="nav-label">Panel de control</span>
        {menuItems.map(({ label, path, icon: Icon }) => <button className={`nav-item ${activePath === path ? 'active' : ''}`} key={path} onClick={() => onNavigate(path)}><Icon size={18} strokeWidth={activePath === path ? 2.4 : 2} /><span>{label}</span></button>)}
      </nav>
      <div className="sidebar-footer"><div className="connection-dot" /><div><strong>API local</strong><span>127.0.0.1:8000</span></div></div>
    </aside>
    </>
  )
}

export default Sidebar
