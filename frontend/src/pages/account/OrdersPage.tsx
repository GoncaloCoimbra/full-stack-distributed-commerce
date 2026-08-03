import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import { apiClient } from '@/services/apiClient';

interface OrderItem {
  product: {
    name: string;
  };
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  total: string;
  status: string;
  shipping: string;
  items: number;
}

const statusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'status-pendente';
    case 'confirmed': return 'status-processado';
    case 'processing': return 'status-processando';
    case 'shipped': return 'status-enviado';
    case 'delivered': return 'status-completed';
    case 'cancelled': return 'status-cancelled';
    case 'refunded': return 'status-refunded';
    default: return 'status-pendente';
  }
};

const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<{ orders: any[] }>('/account/orders');
        if (!response.success || !response.data) {
          throw new Error(response.error?.message || 'Não foi possível carregar as encomendas.');
        }

        const mapped = response.data.orders.map(order => ({
          id: order._id ?? order.id ?? '---',
          date: order.createdAt ? formatDate(order.createdAt) : '–',
          total: typeof order.total === 'number'
            ? new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(order.total)
            : String(order.total ?? '–'),
          status: order.status ?? 'pending',
          shipping: order.shippingMethod ?? 'Padrão',
          items: Array.isArray(order.items)
            ? order.items.reduce((sum: number, item: OrderItem) => sum + Number(item.quantity), 0)
            : 0,
        }));

        setOrders(mapped);
      } catch (err: any) {
        setError(err?.message || 'Erro ao carregar encomendas.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = search
        ? [order.id, order.status, order.shipping].some(value => value.toLowerCase().includes(search.toLowerCase()))
        : true;
      const matchesFilter = filter === 'all' || order.status.toLowerCase() === filter;
      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  const latestOrder = useMemo(() => orders[0], [orders]);

  return (
    <AppLayout title="Encomendas" description="Veja o histórico de encomendas, status e detalhes de entregas." canonical="/account/orders">
      <section className="page-hero">
        <h1>As minhas encomendas</h1>
        <p className="page-copy">
          Acompanhe o estado das suas encomendas, veja detalhes de entrega e encontre facilmente os seus pedidos recentes.
        </p>
      </section>

      <section className="container" style={{ marginBottom: '2rem' }}>
        <div className="page-grid page-grid-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="page-card">
            <h2 className="page-heading">Total de encomendas</h2>
            <p className="page-copy">{orders.length} encomenda{orders.length !== 1 ? 's' : ''} registada{orders.length !== 1 ? 's' : ''}.</p>
          </div>
          <div className="page-card">
            <h2 className="page-heading">Última encomenda</h2>
            <p className="page-copy">
              {latestOrder
                ? `${latestOrder.id} — ${latestOrder.shipping} em ${latestOrder.date}.`
                : 'Ainda não existem encomendas.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <input
            type="search"
            className="form-input"
            placeholder="Pesquisar encomenda, estado ou envio..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '220px' }}
          />
          <select
            className="form-select"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ minWidth: '220px' }}
          >
            <option value="all">Todos os estados</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="processing">A processar</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
            <option value="refunded">Reembolsado</option>
          </select>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: 12, background: '#fee2e2', color: '#991b1b' }}>
            {error}
          </div>
        )}

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Encomenda</th>
                <th>Data</th>
                <th>Itens</th>
                <th>Status</th>
                <th>Envio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <Link to={`/account/orders/${order.id}`} className="order-link">
                      {order.id}
                    </Link>
                  </td>
                  <td>{order.date}</td>
                  <td>{order.items}</td>
                  <td><span className={`status-badge ${statusClass(order.status)}`}>{order.status}</span></td>
                  <td>{order.shipping}</td>
                  <td>{order.total}</td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    Nenhuma encomenda corresponde aos filtros selecionados.
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
