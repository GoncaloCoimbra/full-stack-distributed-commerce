import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import { apiClient } from '@/services/apiClient';
import { getPaymentStatusConfig, normalizePaymentStatus } from '../cart/checkoutUtils';

interface OrderItem {
  product: {
    name: string;
    images?: string[];
  };
  name: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

interface Address {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface OrderDetail {
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
  trackingNumber?: string;
  notes?: string;
}

const statusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'confirmed': return 'Confirmado';
    case 'processing': return 'A processar';
    case 'shipped': return 'Enviado';
    case 'delivered': return 'Entregue';
    case 'cancelled': return 'Cancelado';
    case 'refunded': return 'Reembolsado';
    default: return 'Desconhecido';
  }
};

const formatDate = (dateValue: string) => {
  return new Date(dateValue).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) {
        setError('ID da encomenda inválido.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<{ order: OrderDetail }>(`/account/orders/${id}`);
        if (!response.success || !response.data?.order) {
          throw new Error(response.error?.message || 'Não foi possível carregar a encomenda.');
        }

        setOrder(response.data.order);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar os detalhes da encomenda.');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  return (
    <AppLayout title="Detalhes da Encomenda" description="Veja o detalhe completo da sua encomenda." canonical={`/account/orders/${id}`}>
      <section className="page-hero">
        <h1>Detalhes da Encomenda</h1>
        <p className="page-copy">
          Consulte o estado do pedido, produtos incluídos, endereço de envio e método de pagamento.
        </p>
      </section>

      <section className="container" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link to="/account/orders" className="btn-secondary">
            ← Voltar para encomendas
          </Link>
          {order && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Pedido #{order.orderNumber}</span>
              <span className={`status-badge ${order.status}`}>{statusLabel(order.status)}</span>
            </div>
          )}
        </div>

        {loading && (
          <div className="page-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            A carregar detalhes da encomenda...
          </div>
        )}

        {error && (
          <div className="alert alert-error" style={{ padding: '1.5rem', borderRadius: 12, background: '#fee2e2', color: '#991b1b' }}>
            {error}
          </div>
        )}

        {order && !loading && (
          <div className="page-grid page-grid-3" style={{ gap: '1.5rem' }}>
            <div className="page-card">
              <h2>Resumo</h2>
              <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                <div>
                  <strong>Data do Pedido:</strong>
                  <div>{formatDate(order.createdAt)}</div>
                </div>
                <div>
                  <strong>Método de Pagamento:</strong>
                  <div>{order.paymentMethod}</div>
                </div>
                <div>
                  <strong>Status de Pagamento:</strong>
                  <div>{getPaymentStatusConfig(normalizePaymentStatus(order.paymentStatus)).label}</div>
                </div>
                <div>
                  <strong>Envio:</strong>
                  <div>{order.shippingMethod}</div>
                </div>
                {order.trackingNumber && (
                  <div>
                    <strong>Número de tracking:</strong>
                    <div>{order.trackingNumber}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="page-card" style={{ gridColumn: 'span 2' }}>
              <h2>Detalhes da encomenda</h2>
              <div className="order-detail-items" style={{ marginTop: '1rem' }}>
                {order.items.map((item, index) => (
                  <div key={`${item.sku}-${index}`} className="order-detail-item" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #e5e5e5' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>SKU: {item.sku}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Quantidade: {item.quantity}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: 700 }}>{formatCurrency(item.total)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="page-card">
              <h2>Endereço de Envio</h2>
              <div style={{ marginTop: '1rem', lineHeight: 1.6 }}>
                <div>{order.shippingAddress.name}</div>
                <div>{order.shippingAddress.email}</div>
                <div>{order.shippingAddress.phone}</div>
                <div>{order.shippingAddress.street}</div>
                <div>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</div>
                <div>{order.shippingAddress.country}</div>
              </div>
            </div>

            <div className="page-card">
              <h2>Endereço de Faturação</h2>
              <div style={{ marginTop: '1rem', lineHeight: 1.6 }}>
                <div>{order.billingAddress.name}</div>
                <div>{order.billingAddress.email}</div>
                <div>{order.billingAddress.phone}</div>
                <div>{order.billingAddress.street}</div>
                <div>{order.billingAddress.city}, {order.billingAddress.postalCode}</div>
                <div>{order.billingAddress.country}</div>
              </div>
            </div>

            <div className="page-card" style={{ gridColumn: 'span 2' }}>
              <h2>Totais</h2>
              <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <strong>{formatCurrency(order.subtotal)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Taxas</span>
                  <strong>{formatCurrency(order.tax)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Envio</span>
                  <strong>{formatCurrency(order.shipping)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Desconto</span>
                  <strong>{formatCurrency(order.discount)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #e5e5e5', paddingTop: '1rem' }}>
                  <span>Total</span>
                  <strong>{formatCurrency(order.total)}</strong>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="page-card" style={{ gridColumn: 'span 3' }}>
                <h2>Observações</h2>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>{order.notes}</p>
              </div>
            )}
          </div>
        )}
      </section>

      <style>{`
        .status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.45rem 0.9rem;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .status-badge.pending { background: #fef3c7; color: #92400e; }
        .status-badge.confirmed { background: #d1fae5; color: #065f46; }
        .status-badge.processing { background: #e0f2fe; color: #035388; }
        .status-badge.shipped { background: #f0fdfa; color: #0f766e; }
        .status-badge.delivered { background: #ecfdf5; color: #166534; }
        .status-badge.cancelled { background: #fee2e2; color: #991b1b; }
        .status-badge.refunded { background: #eef2ff; color: #3730a3; }

        .page-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 1.75rem;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
        }

        .page-card h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .btn-secondary {
          padding: 0.85rem 1.3rem;
          border-radius: 8px;
          background: white;
          border: 1px solid #e5e7eb;
          color: var(--text-primary);
          font-weight: 600;
          text-decoration: none;
        }

        .btn-secondary:hover {
          background: #f8fafc;
        }

        @media (max-width: 980px) {
          .page-grid {
            display: block;
          }

          .page-card {
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </AppLayout>
  );
}
