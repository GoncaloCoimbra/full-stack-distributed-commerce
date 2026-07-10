import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import { fmt } from '../../store/cartStore';
import { getPaymentMethodLabel, getPaymentStatusConfig, normalizePaymentMethod, normalizePaymentStatus, type PaymentMethod, type PaymentStatus } from './checkoutUtils';

interface CheckoutSuccessState {
  orderNumber?: string;
  paymentMethod?: PaymentMethod | string;
  paymentStatus?: PaymentStatus | string;
  total?: number;
  shipping?: number;
}

export default function CheckoutSuccessPage() {
  const location = useLocation();
  const successState = (location.state as CheckoutSuccessState | undefined) ?? {};
  const paymentMethod = normalizePaymentMethod(successState.paymentMethod);
  const paymentStatus = normalizePaymentStatus(successState.paymentStatus);
  const paymentState = getPaymentStatusConfig(paymentStatus);
  const paymentLabel = getPaymentMethodLabel(paymentMethod);

  return (
    <AppLayout>
      <section className="page-hero">
        <div className="success-icon">
          {paymentStatus === 'paid' ? (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
          ) : paymentStatus === 'failed' ? (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          ) : (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
          )}
        </div>
        <h1>
          {paymentStatus === 'paid'
            ? 'Pedido Confirmado!'
            : paymentStatus === 'failed'
              ? 'Pagamento não concluído'
              : paymentStatus === 'requires_action'
                ? 'Ação necessária para concluir o pagamento'
                : 'Pedido em análise'}
        </h1>
        <p className="page-copy">
          {paymentState.description}
        </p>
      </section>

      <section className="container page-panel" style={{ marginBottom: '4rem', textAlign: 'left' }}>
        <div className="success-content">
          <div className="success-details">
            <div className="success-overview" style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem', borderRadius: 16, background: 'rgba(46,204,113,0.08)', border: '1px solid rgba(46,204,113,0.2)' }}>
              <p style={{ margin: 0, color: 'var(--muted-light)', fontSize: '0.95rem' }}>
                {successState.orderNumber ? `Número do pedido: ${successState.orderNumber}` : 'Pedido concluído com sucesso'}
              </p>
              <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: '1rem' }}>
                <div>
                  <strong>Método de pagamento</strong>
                  <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)' }}>{paymentLabel}</p>
                </div>
                <div>
                  <strong>Status</strong>
                  <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)' }}>{paymentState.label}</p>
                </div>
                <div>
                  <strong>Total</strong>
                  <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)' }}>{typeof successState.total === 'number' ? fmt(successState.total) : '—'}</p>
                </div>
                <div>
                  <strong>Entrega</strong>
                  <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)' }}>{typeof successState.shipping === 'number' ? fmt(successState.shipping) : '—'}</p>
                </div>
              </div>
            </div>

            <h2>O que acontece agora?</h2>
            <div className="success-steps">
              <div className="success-step">
                <div className="step-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="step-content">
                  <h3>Email de Confirmação</h3>
                  <p>Receberá um email com os detalhes da sua encomenda.</p>
                </div>
              </div>
              <div className="success-step">
                <div className="step-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <div className="step-content">
                  <h3>Preparação</h3>
                  <p>A sua encomenda está a ser preparada para envio.</p>
                </div>
              </div>
              <div className="success-step">
                <div className="step-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m-8-4v10l8 4 8-4V7"/>
                    <line x1="12" y1="22" x2="12" y2="14"/>
                  </svg>
                </div>
                <div className="step-content">
                  <h3>Envio</h3>
                  <p>Receberá atualizações sobre o envio da sua encomenda.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/shop" className="btn-primary">
              Continuar Comprando
            </Link>
            <Link to="/account/orders" className="btn-secondary">
              Ver Pedidos
            </Link>
          </div>
          <div className="success-support">
            <p>
              Dúvidas? <Link to="/contact">Contacte-nos</Link> ou consulte os nossos <Link to="/faq">FAQs</Link>
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-hero {
          text-align: center;
          padding: 4rem 0;
        }

        .success-icon {
          margin-bottom: 2rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(217, 4, 41, 0.1);
        }

        .page-hero h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .page-copy {
          font-size: 1.125rem;
          color: var(--text-secondary);
          max-width: 700px;
          margin: 0 auto;
        }

        .success-content {
          max-width: 860px;
          margin: 0 auto;
        }

        .success-details h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2rem;
        }

        .success-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .success-step {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: #f8f8f8;
          border-radius: 12px;
        }

        .step-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: rgba(217, 4, 41, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--red);
        }

        .step-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .step-content p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .success-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .btn-primary,
        .btn-secondary {
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .btn-primary {
          background: var(--red);
          color: white;
        }

        .btn-primary:hover {
          background: #b91c1c;
        }

        .btn-secondary {
          background: white;
          color: var(--text-primary);
          border: 1px solid #e5e5e5;
        }

        .btn-secondary:hover {
          background: #f8f8f8;
        }

        .success-support {
          padding-top: 2rem;
          border-top: 1px solid #e5e5e5;
        }

        .success-support p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .success-support a {
          color: var(--red);
          text-decoration: none;
        }

        .success-support a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .page-hero h1 {
            font-size: 2rem;
          }

          .success-steps {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .success-actions {
            flex-direction: column;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </AppLayout>
  );
}