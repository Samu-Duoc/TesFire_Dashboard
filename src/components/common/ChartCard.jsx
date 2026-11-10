function ChartCard({ title, subtitle, children, className = '' }) {
  return <section className={`panel chart-panel ${className}`}><div className="panel-heading"><div><h2>{title}</h2><p>{subtitle}</p></div></div>{children}</section>
}

export default ChartCard
