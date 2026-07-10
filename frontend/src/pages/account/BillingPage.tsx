import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

const paymentMethods = [
  { id: 'pm-card', label: 'Cartão de crédito', details: 'Visa termina em 4242', active: true },
  { id: 'pm-mb', label: 'Multibanco', details: 'Pagamento por referência', active: false },
  { id: 'pm-invoice', label: 'Pagamento por fatura', details: 'Condições B2B', active: false },
];

export default function BillingPage() {
  const [selectedMethod, setSelectedMethod] = useState('pm-card');

  return (
    <AppLayout title="Faturação" description="Gerencie métodos de pagamento e moradas de faturação." canonical="/account/billing">
      <section className="page-hero">
        <h1>Faturação e pagamentos</h1>
        <p className="page-copy">
          Atualize os métodos de pagamento e a morada de faturação da sua conta Tranzor de forma segura.
        </p>
      </section>

      <section className="container page-grid page-grid-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="page-card">
          <h2 className="page-heading">Método de pagamento principal</h2>
          <p className="page-copy">Selecione o método que será usado como padrão para novos pedidos.</p>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
            {paymentMethods.map(method => (
              <label key={method.id} className="page-panel" style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                  style={{ marginRight: '0.85rem' }}
                />
                <strong>{method.label}</strong>
                <div style={{ marginTop: '0.35rem', color: 'var(--muted-light)' }}>{method.details}</div>
              </label>
            ))}
          </div>
        </div>

        <div className="page-card">
          <h2 className="page-heading">Resumo de faturação</h2>
          <dl className="page-list">
            <dt>Morada de faturação</dt>
            <dd>Rua do Comércio, 45<br />4500-123 São João da Madeira</dd>
            <dt>Último pagamento</dt>
            <dd>€248,80 em 03/05/2026</dd>
            <dt>Limite de crédito</dt>
            <dd>Até 30 dias para clientes B2B aprovados.</dd>
          </dl>
          <button className="btn btn-primary btn-full" type="button">Atualizar dados de faturação</button>
        </div>
      </section>

      <section className="container page-card">
        <h2 className="page-heading">Notas rápidas</h2>
        <div className="alert alert-info">
          <span className="alert-icon">i</span>
          <div>
            Mantenha o seu método de pagamento ativo para evitar atrasos na entrega de encomendas e processamento de pedidos.
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
