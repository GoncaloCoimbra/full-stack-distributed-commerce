import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { getStatusBadgeClass, statusLabels } from '../theme.config';
import { useFilters } from '../hooks/useFilters';
import FilterChips from '../components/FilterChips';
import FilterSelector from '../components/FilterSelector';
import { Button, Input, Card, Badge, Alert } from '../components/common';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const { activeFilters, addFilter, removeFilter, clearAllFilters, getFilter } = useFilters();
  
  const [searchTerm, setSearchTerm] = useState(getFilter('search'));
  const [statusFilter, setStatusFilter] = useState(getFilter('status'));
  const [filterLocation, setFilterLocation] = useState(getFilter('location'));
  const [filterDateFrom, setFilterDateFrom] = useState(getFilter('dateFrom'));
  const [filterDateTo, setFilterDateTo] = useState(getFilter('dateTo'));

  const filters = {
    search: searchTerm,
    status: statusFilter,
    location: filterLocation,
    dateFrom: filterDateFrom,
    dateTo: filterDateTo,
  };

  interface Product {
    id: string;
    internalCode: string;
    description: string;
    quantity: number;
    unit: string;
    status: string;
    supplier?: { id: string; name: string; nif: string };
    currentLocation?: string;
    createdAt: string;
    updatedAt: string;
  }

  const { data: products = [], isLoading: loading, error } = useProducts(filters) as { data?: Product[]; isLoading: boolean; error?: unknown };

  useEffect(() => {
    console.log('[ProductList] Current state:', {
      loading,
      error: error instanceof Error ? error.message : JSON.stringify(error),
      productsCount: products.length,
      products: products,
      filters: filters,
    });
  }, [products, loading, error, filters]);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value) {
      addFilter('search', value);
    } else {
      removeFilter('search');
    }
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    if (value) {
      addFilter('status', value);
    } else {
      removeFilter('status');
    }
  };

  const handleLocationChange = (value: string) => {
    setFilterLocation(value);
    if (value) {
      addFilter('location', value);
    } else {
      removeFilter('location');
    }
  };

  const handleDateFromChange = (value: string) => {
    setFilterDateFrom(value);
    if (value) {
      addFilter('dateFrom', value);
    } else {
      removeFilter('dateFrom');
    }
  };

  const handleDateToChange = (value: string) => {
    setFilterDateTo(value);
    if (value) {
      addFilter('dateTo', value);
    } else {
      removeFilter('dateTo');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-2xl)', minHeight: '100vh', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
          <div style={{ animation: 'spin 1s linear infinite', width: '32px', height: '32px', borderRadius: '50%', borderTop: '2px solid var(--color-brand-red)' }}></div>
          <span style={{ marginLeft: 'var(--space-md)', color: 'var(--color-text-muted)' }}>Carregando produtos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 'var(--space-2xl)', minHeight: '100vh', backgroundColor: 'var(--color-surface)' }}>
        <Alert type="error" title="Erro ao carregar" message={(error as any)?.message || 'Falha na conexão'} />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-2xl)', minHeight: '100vh', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--fs-3xl)', fontWeight: 'bold', color: 'var(--color-text)' }}>Produtos</h1>
        <Button variant="primary" onClick={() => navigate('/products/new')}>+ Novo Produto</Button>
      </div>

      <FilterChips filters={activeFilters} onRemove={removeFilter} onClearAll={clearAllFilters} />

      <Card header={<h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: '600' }}>Filtros Avançados</h2>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-lg)' }}>
          <Input label="Localização" placeholder="Ex: Corredor A" value={filterLocation} onChange={(e) => handleLocationChange(e.target.value)} />
          <Input label="De (Data)" type="date" value={filterDateFrom} onChange={(e) => handleDateFromChange(e.target.value)} />
          <Input label="Até (Data)" type="date" value={filterDateTo} onChange={(e) => handleDateToChange(e.target.value)} />
        </div>
      </Card>

      <Card header={<h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: '600' }}>Pesquisa e Status</h2>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-lg)' }}>
          <Input label="Pesquisar" placeholder="Código, descrição..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} />
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: '500', marginBottom: 'var(--space-sm)', color: 'var(--color-text-muted)' }}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: 'var(--fs-sm)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <option value="">Todos</option>
              {Object.entries(statusLabels.product).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card header={<h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: '600' }}>Produtos</h2>}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <p style={{ fontSize: 'var(--fs-lg)', fontWeight: '600', marginBottom: 'var(--space-md)', color: 'var(--color-text-muted)' }}>Nenhum produto encontrado</p>
            {activeFilters.length === 0 && (
              <Button variant="secondary" onClick={() => navigate('/products/new')}>Criar Primeiro Produto</Button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--fs-sm)', fontWeight: '600', color: 'var(--color-text-muted)' }}>Código</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--fs-sm)', fontWeight: '600', color: 'var(--color-text-muted)' }}>Descrição</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--fs-sm)', fontWeight: '600', color: 'var(--color-text-muted)' }}>Qtd</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--fs-sm)', fontWeight: '600', color: 'var(--color-text-muted)' }}>Fornecedor</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--fs-sm)', fontWeight: '600', color: 'var(--color-text-muted)' }}>Status</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--fs-sm)', fontWeight: '600', color: 'var(--color-text-muted)' }}>Local</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--fs-sm)', fontWeight: '600', color: 'var(--color-text-muted)' }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: Product) => (
                  <tr
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    style={{
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--color-border)',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: 'var(--space-md)', fontSize: 'var(--fs-sm)', fontWeight: '500', color: 'var(--color-text)' }}>{product.internalCode}</td>
                    <td style={{ padding: 'var(--space-md)', fontSize: 'var(--fs-sm)', color: 'var(--color-text)' }}>{product.description}</td>
                    <td style={{ padding: 'var(--space-md)', fontSize: 'var(--fs-sm)', color: 'var(--color-text)' }}>{product.quantity} {product.unit}</td>
                    <td style={{ padding: 'var(--space-md)', fontSize: 'var(--fs-sm)', color: 'var(--color-text)' }}>{product.supplier?.name || '—'}</td>
                    <td style={{ padding: 'var(--space-md)' }}>
                      <Badge variant={product.status === 'active' ? 'success' : 'warning'}>{statusLabels.product[product.status] || product.status}</Badge>
                    </td>
                    <td style={{ padding: 'var(--space-md)', fontSize: 'var(--fs-sm)', color: 'var(--color-text)' }}>{product.currentLocation || '—'}</td>
                    <td style={{ padding: 'var(--space-md)', fontSize: 'var(--fs-sm)', color: 'var(--color-text)' }}>{new Date(product.createdAt).toLocaleDateString('pt-PT')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
        Exibindo {products.length} produto{products.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default ProductList;