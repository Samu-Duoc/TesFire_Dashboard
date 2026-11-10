import { useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, WalletCards } from 'lucide-react'
import { formatDate } from '../common/dashboardUtils'

function MovementTable({ transactions, showHeading = true }) {
  const [filter, setFilter] = useState('all')
  const filtered = useMemo(() => transactions.filter((item) => filter === 'all' || item.movement_type === filter), [filter, transactions])
  return <section className="panel table-panel">
    {showHeading && <div className="panel-heading table-heading"><div><h2>Movimientos</h2><p>Detalle de transacciones de la cuenta 800002</p></div><div className="table-controls"><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filtrar por tipo de movimiento"><option value="all">Todos los tipos</option><option value="Credit">Créditos</option><option value="Debit">Débitos</option></select></div></div>}
    <div className="table-scroll"><table><thead><tr><th>Cuenta</th><th>Fecha</th><th>Tipo de movimiento</th><th className="amount-cell">Monto</th></tr></thead><tbody>
      {filtered.length ? filtered.map((item) => <tr key={item._id || `${item.account}-${item.date}-${item.amount}`}><td className="account-cell"><span className="account-avatar"><WalletCards size={14} /></span>{item.account}</td><td>{formatDate(item.date)}</td><td><span className={`movement-badge ${item.movement_type === 'Credit' ? 'credit' : 'debit'}`}>{item.movement_type === 'Credit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}{item.movement_type === 'Credit' ? 'Crédito' : 'Débito'}</span></td><td className={`amount-cell ${item.movement_type === 'Credit' ? 'credit-text' : 'debit-text'}`}>{item.amount}</td></tr>) : <tr><td colSpan="4"><div className="empty-table">No existen movimientos para este filtro.</div></td></tr>}
    </tbody></table></div><div className="table-footer">{filtered.length} {filtered.length === 1 ? 'registro' : 'registros'} encontrados</div>
  </section>
}

export default MovementTable
