import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Produto Linha A', price: '€14,90', badge: 'Destaque' },
  { id: 2, name: 'Produto Linha B', price: '€9,50',  badge: null },
  { id: 3, name: 'Produto Linha C', price: '€22,00', badge: 'Novo' },
  { id: 4, name: 'Produto Linha D', price: '€7,80',  badge: null },
];

export default function BrandPage() {
  const { brand } = useParams<{ brand?: string }>();
  const label = brand
    ? brand.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Marca';

  return (
    <AppLayout
      title={`${label} — Tranzor`}
      description={`Descubra todos os produtos da marca ${label} disponíveis na Tranzor.`}
    >
      {/* ── HERO ── */}
      <section style={{
        position: 'relative', padding: '6rem 2rem 4rem',
        borderBottom: '1px solid rgba(0,0,0,0.08)', background: '#fff', overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(217,4,41,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(217,4,41,0.04) 1px,transparent 1px)`,
          backgroundSize: '72px 72px',
        }} />
        <div aria-hidden style={{
          position: 'absolute', bottom: '-30%', left: '-5%',
          width: 400, height: 400,
          background: 'radial-gradient(circle,rgba(217,4,41,0.06) 0%,transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem', fontSize: 12, color: '#999' }}>
            <Link to="/shop" style={{ color: '#D90429', textDecoration: 'none', fontWeight: 600 }}>Loja</Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M9 18l6-6-6-6"/></svg>
            <span style={{ color: '#111', fontWeight: 600 }}>{label}</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {/* logo placeholder */}
            <div style={{
              width: 64, height: 64, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg,#f0f0f0,#e0e0e0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(0,0,0,0.08)',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" aria-hidden>
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#D90429' }}>— Marca</span>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.1,
                color: '#111', letterSpacing: -0.5,
              }}>{label}</h1>
            </div>
          </div>
          <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, maxWidth: 520 }}>
            Conheça a gama completa de produtos desta marca, disponíveis na Tranzor com entrega rápida.
          </p>
        </div>
      </section>

      {/* ── GRID ── */}
      <section style={{ background: '#f5f5f3', padding: '3rem 2rem 5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#666' }}>{MOCK_PRODUCTS.length} produtos da marca</span>
            <select style={{
              fontSize: 12, fontWeight: 600, color: '#111',
              border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8,
              padding: '7px 12px', background: '#fff', cursor: 'pointer',
            }}>
              <option>Ordenar: Relevância</option>
              <option>Preço crescente</option>
              <option>Preço decrescente</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {MOCK_PRODUCTS.map(p => (
              <Link key={p.id} to={`/shop/product/${p.id}`} style={{ textDecoration: 'none' }}>
                <article style={{
                  background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 12, overflow: 'hidden',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                  }}
                >
                  <div style={{
                    height: 160, background: 'linear-gradient(135deg,#f5f5f5,#eaeaea)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" aria-hidden>
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21,15 16,10 5,21"/>
                    </svg>
                    {p.badge && (
                      <span style={{
                        position: 'absolute', top: 10, left: 10,
                        background: '#D90429', color: '#fff',
                        fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
                      }}>{p.badge}</span>
                    )}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#111', marginBottom: 6 }}>{p.name}</p>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#D90429' }}>{p.price}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}