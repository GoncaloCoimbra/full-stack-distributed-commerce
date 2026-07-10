import React from 'react';
import AppLayout from '../../layouts/AppLayout';

const returns = [
  { id: 'RET-7892', order: 'ORD-3398', status: 'Em análise', requested: '29/04/2026', expected: '10/05/2026' },
  { id: 'RET-7721', order: 'ORD-3310', status: 'Aprovado', requested: '16/04/2026', expected: '05/05/2026' },
];

const statusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'em análise': return 'status-pendente';
    case 'aprovado': return 'status-completed';
    case 'enviado': return 'status-enviado';
    default: return 'status-pendente';
  }
};

export default function ReturnStatusPage() {
  return (
    <AppLayout title="Estado de devoluções" description="Veja o progresso dos seus pedidos de devolução e o prazo estimado." canonical="/account/returns/status">
      <section className="page-hero">
        <h1>Estado das devoluções</h1>
        <p className="page-copy">
          Acompanhe cada etapa do processo de devolução e veja quando o seu crédito ou substituição será liberado.
        </p>
      </section>

      <section className="container page-card" style={{ marginBottom: '2rem' }}>
        <div className="alert alert-info">
          <span className="alert-icon">i</span>
          <div>As devoluções podem demorar até 10 dias úteis para serem processadas após receção do artigo.</div>
        </div>
      </section>

      <section className="container page-panel">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Devolução</th>
                <th>Encomenda</th>
                <th>Solicitado</th>
                <th>Previsão</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {returns.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.order}</td>
                  <td>{item.requested}</td>
                  <td>{item.expected}</td>
                  <td><span className={`status-badge ${statusClass(item.status)}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  );
}
