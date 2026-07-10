import React, { useMemo, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

const invoices = [
  { id: 'INV-3452', date: '03/05/2026', due: '17/05/2026', amount: '€248,80', status: 'Pendente' },
  { id: 'INV-3390', date: '22/04/2026', due: '06/05/2026', amount: '€1.124,50', status: 'Pago' },
  { id: 'INV-3348', date: '15/04/2026', due: '29/04/2026', amount: '€79,90', status: 'Pago' },
  { id: 'INV-3281', date: '05/04/2026', due: '19/04/2026', amount: '€632,20', status: 'Atrasado' },
];

const statusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pago': return 'status-completed';
    case 'pendente': return 'status-pendente';
    case 'atrasado': return 'status-cancelado';
    default: return 'status-pendente';
  }
};

export default function InvoicesPage() {
  const [filter, setFilter] = useState('all');

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => filter === 'all' || invoice.status.toLowerCase() === filter);
  }, [filter]);

  const totalDue = invoices
    .filter(inv => inv.status.toLowerCase() === 'pendente')
    .reduce((sum, inv) => sum + Number(inv.amount.replace('€', '').replace('.', '').replace(',', '.')), 0);

  return (
    <AppLayout title="Faturas" description="Veja as faturas emitidas e faça a gestão dos pagamentos." canonical="/account/invoices">
      <section className="page-hero">
        <h1>As minhas faturas</h1>
        <p className="page-copy">
          Consulte o estado de pagamento das suas faturas Tranzor e aceda rapidamente aos detalhes de cada emissão.
        </p>
      </section>

      <section className="container" style={{ marginBottom: '2rem' }}>
        <div className="page-grid page-grid-3" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="page-card">
            <h3 className="kpi-label">Total em aberto</h3>
            <div className="kpi-value">€{totalDue.toFixed(2).replace('.', ',')}</div>
          </div>
          <div className="page-card">
            <h3 className="kpi-label">Faturas pagas</h3>
            <div className="kpi-value">{invoices.filter(inv => inv.status.toLowerCase() === 'pago').length}</div>
          </div>
          <div className="page-card">
            <h3 className="kpi-label">Faturas atrasadas</h3>
            <div className="kpi-value">{invoices.filter(inv => inv.status.toLowerCase() === 'atrasado').length}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <span className="section-label">Filtrar</span>
          <select
            className="form-select"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ minWidth: '220px' }}
          >
            <option value="all">Todos os estados</option>
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
            <option value="atrasado">Atrasado</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fatura</th>
                <th>Data</th>
                <th>Vencimento</th>
                <th>Montante</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(invoice => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.date}</td>
                  <td>{invoice.due}</td>
                  <td>{invoice.amount}</td>
                  <td><span className={`status-badge ${statusClass(invoice.status)}`}>{invoice.status}</span></td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    Não existem faturas com o estado selecionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  );
}
