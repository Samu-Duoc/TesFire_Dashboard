function StatCard({ title, value, caption, icon: Icon, tone, className = '', onClick, onKeyDown, role, tabIndex }) {
  return <article className={`stat-card ${className}`} onClick={onClick} onKeyDown={onKeyDown} role={role} tabIndex={tabIndex}><div className={`stat-icon ${tone}`}><Icon size={20} /></div><div className="stat-copy"><span>{title}</span><strong>{value}</strong><small>{caption}</small></div></article>
}

export default StatCard
