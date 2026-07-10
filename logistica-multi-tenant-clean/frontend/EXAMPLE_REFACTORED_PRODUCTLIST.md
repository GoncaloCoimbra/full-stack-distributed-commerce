# 📊 Refactored Components Example — ProductList

This shows the BEFORE and AFTER for a list/table page.

## BEFORE (Old Design)

```tsx
// ProductList.tsx - OLD VERSION with Tailwind classes
const ProductList: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Produtos</h1>
        <p className="text-slate-400 mt-1">Gerencie seus produtos</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Procurar..."
          className="flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-amber-500/30 text-white placeholder-slate-400"
        />
        <select className="px-4 py-2 rounded-lg bg-slate-700 border border-amber-500/30 text-white">
          <option>Todos os status</option>
          <option>Ativo</option>
          <option>Inativo</option>
        </select>
        <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
          + Novo
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border-2 border-amber-500/30 bg-gradient-to-br from-slate-800 to-slate-900">
        <table className="w-full">
          <thead className="bg-slate-900 border-b-2 border-amber-500/20">
            <tr>
              <th className="px-6 py-4 text-left text-white font-bold">SKU</th>
              <th className="px-6 py-4 text-left text-white font-bold">Nome</th>
              <th className="px-6 py-4 text-left text-white font-bold">Categoria</th>
              <th className="px-6 py-4 text-left text-white font-bold">Status</th>
              <th className="px-6 py-4 text-left text-white font-bold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-amber-500/20 hover:bg-amber-500/5">
                <td className="px-6 py-4 text-white font-mono">{product.sku}</td>
                <td className="px-6 py-4 text-white">{product.name}</td>
                <td className="px-6 py-4 text-slate-400">{product.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    product.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/40">
                    Ver
                  </button>
                  <button className="px-3 py-1 text-xs bg-amber-500/20 text-amber-400 rounded hover:bg-amber-500/40">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

## AFTER (New Design System)

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, Badge } from '../components/common';
import { useProducts } from '../hooks/useProducts';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data: products = [], isLoading } = useProducts({
    search: searchTerm,
    status: statusFilter,
  });

  return (
    <div style={{ padding: 'var(--space-2xl)' }}>
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 'var(--space-2xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 'var(--fs-3xl)', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
            📦 Produtos
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Gerencie seus produtos</p>
        </div>
        
        <Button variant="primary" size="md" onClick={() => navigate('/products/new')}>
          + Novo Produto
        </Button>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <Card>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          gap: 'var(--space-md)',
          alignItems: 'flex-end',
        }}>
          <Input
            type="text"
            label="Procurar"
            placeholder="SKU, nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div>
            <label style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 'var(--space-sm)' }}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: 'var(--space-md) var(--space-lg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: 'var(--fs-sm)',
                cursor: 'pointer',
                minWidth: '160px',
              }}
            >
              <option value="">Todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="pending">Pendente</option>
            </select>
          </div>

          <Button variant="secondary" size="md" onClick={() => { setSearchTerm(''); setStatusFilter(''); }}>
            Limpar
          </Button>
        </div>
      </Card>

      {/* ── Products Table ─────────────────────────────────────────────── */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid var(--color-border)',
            borderTopColor: 'var(--color-brand-red)',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      ) : (
        <Card style={{ marginTop: 'var(--space-lg)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 'var(--fs-sm)',
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)' }}>SKU</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)' }}>Nome</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)' }}>Categoria</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)' }}>Status</th>
                  <th style={{ padding: 'var(--space-md)', textAlign: 'center', fontWeight: 700, color: 'var(--color-text-muted)' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr
                    key={product.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      transition: 'background-color 150ms ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
                  >
                    <td style={{ padding: 'var(--space-md)', fontFamily: 'var(--font-mono)' }}>
                      {product.sku}
                    </td>
                    <td style={{ padding: 'var(--space-md)' }}>{product.name}</td>
                    <td style={{ padding: 'var(--space-md)', color: 'var(--color-text-muted)' }}>
                      {product.category}
                    </td>
                    <td style={{ padding: 'var(--space-md)' }}>
                      <Badge variant={product.status === 'active' ? 'success' : product.status === 'pending' ? 'warning' : 'error'}>
                        {product.status}
                      </Badge>
                    </td>
                    <td style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/products/${product.id}/edit`)}
                        >
                          Editar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-muted)' }}>
                <p style={{ fontSize: 'var(--fs-base)', marginBottom: 'var(--space-md)' }}>📭 Nenhum produto encontrado</p>
                <Button variant="primary" onClick={() => navigate('/products/new')}>
                  Criar primeiro produto
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProductList;
```

---

## Key Changes Explained

### 1. **Padding/Layout**
```tsx
// OLD
<div className="px-6 py-8">

// NEW
<div style={{ padding: 'var(--space-2xl)' }}>
```

### 2. **Typography**
```tsx
// OLD
<h1 className="text-3xl font-bold text-white">

// NEW
<h1 style={{ fontSize: 'var(--fs-3xl)', fontWeight: 700 }}>
```

### 3. **Components**
```tsx
// OLD
<button className="px-4 py-2 bg-amber-500 text-white rounded-lg">

// NEW
<Button variant="primary" size="md">
```

### 4. **Colors**
```tsx
// OLD
<input className="bg-slate-700 border-amber-500/30 text-white">

// NEW
<Input placeholder="..." />  {/* Auto applies theme colors */}
```

### 5. **Tables**
```tsx
// OLD - Complex Tailwind classes
<table className="w-full border-collapse">
  <th className="px-6 py-4 text-left text-white font-bold">

// NEW - Inline styles with CSS variables
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
  <th style={{ padding: 'var(--space-md)', color: 'var(--color-text-muted)' }}>
```

### 6. **Badge/Status**
```tsx
// OLD - Manual classes
<span className={`${product.status === 'active' ? 'bg-green-500/20 text-green-400' : '...'}`}>

// NEW - Component abstraction
<Badge variant={product.status === 'active' ? 'success' : 'error'}>
```

---

## Migration Pattern

1. **Replace button elements** with `<Button>` component
2. **Replace input elements** with `<Input>` component
3. **Replace card/container divs** with `<Card>` component
4. **Replace status spans** with `<Badge>` component
5. **Replace bg/text classes** with `style={{ color: 'var(--color-*)' }}`

---

**Total refactor time: ~20-30 minutes per list page**
