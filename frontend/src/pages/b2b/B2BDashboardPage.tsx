import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import { apiClient } from '@/services/apiClient';
import { useAuthStore } from '@/store/authStore';

interface OrderRow {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
  shipping: string;
}

interface ApprovalRequestRow {
  id: string;
  status: string;
  createdAt: string;
  approver?: string;
  items: number;
  comment?: string;
}

interface ReplenishmentAlert {
  productId: string;
  name: string;
  averageCycleDays: number;
  daysSinceLast: number;
  suggestedOrderId: string;
  message: string;
}

const statusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'status-pendente';
    case 'approved': return 'status-processado';
    case 'rejected': return 'status-cancelled';
    case 'confirmed': return 'status-processado';
    case 'processing': return 'status-processando';
    case 'shipped': return 'status-enviado';
    case 'delivered': return 'status-completed';
    case 'cancelled': return 'status-cancelled';
    case 'refunded': return 'status-refunded';
    default: return 'status-pendente';
  }
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function B2BDashboardPage() {
  const user = useAuthStore(state => state.user);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequestRow[]>([]);
  const [replenishmentAlerts, setReplenishmentAlerts] = useState<ReplenishmentAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [ordersResponse, approvalsResponse, alertsResponse] = await Promise.allSettled([
          apiClient.get<{ orders: any[] }>('/account/orders'),
          apiClient.get<{ requests: any[] }>('/b2b/approval-requests'),
          apiClient.get<{ alerts: any[] }>('/b2b/replenishment-alerts'),
        ]);

        if (ordersResponse.status === 'fulfilled' && ordersResponse.value.success && ordersResponse.value.data) {
          setOrders(ordersResponse.value.data.orders.map((order: any) => ({
            id: order._id ?? order.id ?? '---',
            date: order.createdAt ?? '',
            total: typeof order.total === 'number' ? order.total : Number(order.total || 0),
            status: order.status ?? 'pending',
            items: Array.isArray(order.items) ? order.items.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0) : 0,
            shipping: order.shippingMethod ?? 'Padrão',
          })));
        }

        if (approvalsResponse.status === 'fulfilled' && approvalsResponse.value.success && approvalsResponse.value.data) {
          setApprovalRequests(approvalsResponse.value.data.requests.map((request: any) => ({
            id: request._id ?? request.id ?? '---',
            status: request.status ?? 'pending',
            createdAt: request.createdAt ?? request.created_at ?? new Date().toISOString(),
            approver: request.approver?.name ?? request.approver?.email ?? 'Equipe B2B',
            items: Array.isArray(request.items) ? request.items.length : 0,
            comment: request.comment ?? '',
          })));
        }

        if (alertsResponse.status === 'fulfilled' && alertsResponse.value.success && alertsResponse.value.data) {
          setReplenishmentAlerts(alertsResponse.value.data.alerts || []);
        }

        if (
          ordersResponse.status === 'rejected' &&
          approvalsResponse.status === 'rejected' &&
          alertsResponse.status === 'rejected'
        ) {
          throw new Error('Não foi possível carregar os dados operacionais do painel B2B.');
        }
      } catch (err: any) {
        setError(err?.message || 'Erro ao carregar o painel B2B.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (filterStatus === 'all') return true;
      return order.status.toLowerCase() === filterStatus;
    });
  }, [orders, filterStatus]);

  const dashboardStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const openOrders = orders.filter(order => ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status.toLowerCase())).length;
    const pendingApprovals = approvalRequests.filter(request => request.status.toLowerCase() === 'pending').length;
    return {
      totalOrders: orders.length,
      totalRevenue,
      openOrders,
      averageOrder: orders.length ? totalRevenue / orders.length : 0,
      pendingApprovals,
      replenishmentAlerts: replenishmentAlerts.length,
    };
  }, [orders, approvalRequests, replenishmentAlerts]);

  const companyName = user?.profile?.company || user?.name || 'Cliente B2B';

  return (
    <AppLayout>
      <Helmet>
        <title>Painel B2B - Tranzor</title>
        <meta name="description" content="Acompanhe as operações e pedidos B2B da Tranzor." />
        <link rel="canonical" href="https://Tranzor.pt/b2b/dashboard" />
      </Helmet>

      <section className="page-hero">
        <h1>Painel B2B</h1>
        <p className="page-copy">
          Bem-vindo, {companyName}. Veja seus pedidos, aprovações, alertas de reposição e ações rápidas da conta empresarial.
          {user?.b2bDiscountRate ? ` Você tem ${user.b2bDiscountRate}% de desconto B2B aplicado.` : ''}
        </p>
      </section>

      <section className="container">
        <div className="page-grid" style={{ marginBottom: '3rem' }}>
          <div className="page-card">
            <h3 className="page-heading">Pedidos B2B</h3>
            <p className="page-copy">Total de pedidos no seu histórico de compras.</p>
            <div className="kpi-value">{dashboardStats.totalOrders}</div>
          </div>
          <div className="page-card">
            <h3 className="page-heading">Receita acumulada</h3>
            <p className="page-copy">Receita bruta de todas as encomendas.</p>
            <div className="kpi-value">{formatCurrency(dashboardStats.totalRevenue)}</div>
          </div>
          <div className="page-card">
            <h3 className="page-heading">Pedidos em aberto</h3>
            <p className="page-copy">Pedidos que ainda não foram concluídos.</p>
            <div className="kpi-value">{dashboardStats.openOrders}</div>
          </div>
          <div className="page-card">
            <h3 className="page-heading">Valor médio por pedido</h3>
            <p className="page-copy">Média dos pedidos processados até agora.</p>
            <div className="kpi-value">{formatCurrency(dashboardStats.averageOrder)}</div>
          </div>
          <div className="page-card">
            <h3 className="page-heading">Aprovações pendentes</h3>
            <p className="page-copy">Pedidos de aprovação que aguardam validação.</p>
            <div className="kpi-value">{dashboardStats.pendingApprovals}</div>
          </div>
          <div className="page-card">
            <h3 className="page-heading">Alertas de reposição</h3>
            <p className="page-copy">Produtos com ciclo de compra recorrente que podem precisar de reposição.</p>
            <div className="kpi-value">{dashboardStats.replenishmentAlerts}</div>
          </div>
        </div>

        <div className="page-panel" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2>Operações B2B</h2>
              <p className="page-copy">Acesse rapidamente pedidos, aprovações, reposição e suporte do seu plano empresarial.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/cart" className="btn-primary">Abrir carrinho</Link>
              <Link to="/shop" className="btn-secondary">Ver Catálogo B2B</Link>
              <Link to="/account/orders" className="btn-ghost">Histórico de Pedidos</Link>
            </div>
          </div>
        </div>

        <div className="page-grid" style={{ marginBottom: '3rem', alignItems: 'start' }}>
          <div className="page-panel">
            <h2 style={{ marginTop: 0 }}>Aprovações</h2>
            <p className="page-copy">Pedidos de aprovação criados pela sua conta para validação do time B2B.</p>

            {loading ? (
              <p className="page-copy">Carregando aprovações...</p>
            ) : approvalRequests.length === 0 ? (
              <p className="page-copy">Nenhuma aprovação pendente ou registrada no momento.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {approvalRequests.map((request) => (
                  <div key={request.id} style={{ padding: '1rem', borderRadius: 14, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.015)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '0.35rem' }}>Pedido #{request.id.slice(-6).toUpperCase()}</strong>
                        <span className={`status-badge ${statusClass(request.status)}`}>{request.status}</span>
                      </div>
                      <div style={{ color: 'var(--muted-light)', fontSize: 14 }}>
                        {formatDate(request.createdAt)}
                      </div>
                    </div>
                    <p style={{ margin: '0.75rem 0 0', color: 'var(--muted-light)' }}>
                      Aprovador: {request.approver}
                    </p>
                    <p style={{ margin: '0.5rem 0 0', color: 'var(--muted-light)' }}>
                      Itens: {request.items}
                    </p>
                    {request.comment && (
                      <p style={{ margin: '0.75rem 0 0', color: 'var(--text)' }}>{request.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="page-panel">
            <h2 style={{ marginTop: 0 }}>Reposição inteligente</h2>
            <p className="page-copy">Alertas gerados a partir do histórico de compras para antecipar reposições.</p>

            {loading ? (
              <p className="page-copy">Carregando alertas...</p>
            ) : replenishmentAlerts.length === 0 ? (
              <p className="page-copy">Nenhum alerta de reposição encontrado no momento.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {replenishmentAlerts.map((alert) => (
                  <div key={alert.productId} style={{ padding: '1rem', borderRadius: 14, border: '1px solid rgba(217,4,41,0.2)', background: 'linear-gradient(135deg, rgba(217,4,41,0.08), rgba(217,4,41,0.02))' }}>
                    <p style={{ margin: 0, fontWeight: 800 }}>{alert.name}</p>
                    <p style={{ margin: '0.5rem 0 0', color: 'var(--muted-light)' }}>{alert.message}</p>
                    <p style={{ margin: '0.75rem 0 0', color: 'var(--muted-light)', fontSize: 14 }}>
                      Ciclo médio: {alert.averageCycleDays.toFixed(1)} dias · Última compra há {alert.daysSinceLast.toFixed(1)} dias
                    </p>
                    <p style={{ margin: '0.75rem 0 0', fontSize: 14 }}>
                      Sugestão: reordenar a partir da última encomenda <strong>{alert.suggestedOrderId}</strong>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="page-panel" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Pedidos Recentes</h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select"
              aria-label="Filtrar por status"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendente</option>
              <option value="confirmed">Confirmado</option>
              <option value="processing">A processar</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Data</th>
                  <th>Itens</th>
                  <th>Status</th>
                  <th>Envio</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem 1rem' }}>Carregando pedidos...</td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem 1rem' }}>Nenhum pedido B2B encontrado.</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="adm-td-mono">{order.id}</td>
                      <td>{formatDate(order.date)}</td>
                      <td>{order.items}</td>
                      <td><span className={`status-badge ${statusClass(order.status)}`}>{order.status}</span></td>
                      <td>{order.shipping}</td>
                      <td>{formatCurrency(order.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
