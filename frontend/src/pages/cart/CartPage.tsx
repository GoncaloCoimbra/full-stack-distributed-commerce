import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import { useCartStore, useCartComputed, fmt } from '../../store/cartStore';
import { trackEvent } from '../../services/analytics';
import { getVariant } from '../../services/experiments';
import RFQUploadZone from '../../components/cart/RFQUploadZone';
import BarcodeScannerPanel from '../../components/cart/BarcodeScannerPanel';

/* ─────────────────────────────────────────
   ÍCONE DE PRODUTO (placeholder SVG)
   ───────────────────────────────────────── */
function ProductIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
      stroke="rgba(217,4,41,0.6)" strokeWidth="1.3"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="7.5,4.27 12,6.11 16.5,4.27"/>
      <line x1="12" y1="22.76" x2="12" y2="12"/>
    </svg>
  );
}

/* ─────────────────────────────────────────
   ESTADO VAZIO
   ───────────────────────────────────────── */
function EmptyCart() {
  return (
    <div className="cart-empty" role="status" aria-label="Carrinho vazio">
      <div className="cart-empty-icon" aria-hidden>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
          stroke="var(--red)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 6L8 18H16L18 6H6Z"/>
          <circle cx="9" cy="20.5" r="1.5" fill="var(--red)" stroke="none"/>
          <circle cx="15" cy="20.5" r="1.5" fill="var(--red)" stroke="none"/>
          <path d="M6 6L4 3H1" strokeLinecap="round"/>
          <line x1="9" y1="10" x2="15" y2="16" stroke="var(--red)" strokeWidth="1.5"/>
          <line x1="15" y1="10" x2="9" y2="16" stroke="var(--red)" strokeWidth="1.5"/>
        </svg>
      </div>
      <h2 className="cart-empty-title">O seu carrinho está vazio</h2>
      <p className="cart-empty-desc">
        Ainda não adicionou nenhum produto. Explore o nosso catálogo
        e encontre o que precisa.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/shop" className="btn-primary-cart">
          Ver Catálogo
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <Link to="/shop/ofertas" className="btn-ghost-cart">
          Ver Promoções
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   LINHA DE PRODUTO
   ───────────────────────────────────────── */
interface CartRowProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  to: string;
  quantity: number;
  onQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

function CartRow({ id, name, price, originalPrice, badge, to, quantity, onQty, onRemove }: CartRowProps) {
  return (
    <article className="cart-row" aria-label={name}>
      {/* thumbnail */}
      <Link to={to} className="cart-thumb" tabIndex={-1} aria-hidden>
        <ProductIcon />
        {badge && (
          <span className={`cart-badge badge-${badge.toLowerCase()}`}>{badge}</span>
        )}
      </Link>

      {/* info */}
      <div className="cart-row-info">
        <Link to={to} className="cart-row-name">{name}</Link>
        <div className="cart-row-meta">
          <span className="cart-price-main">{fmt(price)}</span>
          {originalPrice && (
            <span className="cart-price-original">{fmt(originalPrice)}</span>
          )}
        </div>
      </div>

      {/* controlo de quantidade */}
      <div className="cart-qty-wrap" role="group" aria-label={`Quantidade de ${name}`}>
        <button
          onClick={() => onQty(id, quantity - 1)}
          aria-label="Diminuir quantidade"
          className="cart-qty-btn"
          disabled={quantity <= 1}
        >−</button>
        <span className="cart-qty-val" aria-live="polite">{quantity}</span>
        <button
          onClick={() => onQty(id, quantity + 1)}
          aria-label="Aumentar quantidade"
          className="cart-qty-btn"
        >+</button>
      </div>

      {/* subtotal da linha */}
      <div className="cart-row-subtotal" aria-label={`Subtotal: ${fmt(price * quantity)}`}>
        {fmt(price * quantity)}
      </div>

      {/* remover */}
      <button
        onClick={() => onRemove(id)}
        aria-label={`Remover ${name} do carrinho`}
        className="cart-remove-btn"
        title="Remover produto"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <polyline points="3,6 5,6 21,6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </article>
  );
}

/* ─────────────────────────────────────────
   RESUMO DO PEDIDO
   ───────────────────────────────────────── */
const SHIPPING_THRESHOLD = 35;

function OrderSummary({
  subtotal, shipping, total, itemCount, onClear,
}: {
  subtotal: number; shipping: number; total: number;
  itemCount: number; onClear: () => void;
}) {
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const remaining = Math.max(0, SHIPPING_THRESHOLD - subtotal);

  const handleCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('cart_coupon_applied', { coupon: coupon.trim() || 'empty' });
    setCouponMsg(coupon.trim() ? 'Cupão inválido ou já utilizado.' : 'Introduza um código.');
  };

  return (
    <aside className="order-summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="summary-title">Resumo do pedido</h2>

      {/* barra de progresso de envio grátis */}
      {shipping > 0 && (
        <div className="free-shipping-bar" aria-label={`Faltam ${fmt(remaining)} para envio gratuito`}>
          <div className="free-shipping-top">
            <span>Envio grátis a partir de {fmt(SHIPPING_THRESHOLD)}</span>
            <span className="free-shipping-rem">faltam {fmt(remaining)}</span>
          </div>
          <div className="free-shipping-track" role="progressbar"
            aria-valuenow={Math.round((subtotal / SHIPPING_THRESHOLD) * 100)}
            aria-valuemin={0} aria-valuemax={100}>
            <div className="free-shipping-fill"
              style={{ width: `${Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100)}%` }} />
          </div>
        </div>
      )}
      {shipping === 0 && subtotal > 0 && (
        <div className="free-shipping-achieved" role="status">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          Envio gratuito incluído!
        </div>
      )}

      {/* linha de valores */}
      <dl className="summary-rows">
        <div className="summary-row">
          <dt>Subtotal <span className="summary-count">({itemCount} item{itemCount !== 1 ? 's' : ''})</span></dt>
          <dd>{fmt(subtotal)}</dd>
        </div>
        <div className="summary-row">
          <dt>Envio</dt>
          <dd className={shipping === 0 ? 'summary-free' : ''}>
            {shipping === 0 ? 'Grátis' : fmt(shipping)}
          </dd>
        </div>
        <div className="summary-row summary-row-total">
          <dt>Total</dt>
          <dd>{fmt(total)}</dd>
        </div>
      </dl>

      {/* cupão */}
      <form onSubmit={handleCoupon} className="coupon-form" aria-label="Código de cupão">
        <label htmlFor="coupon-input" className="coupon-label">Código de desconto</label>
        <div className="coupon-row">
          <input
            id="coupon-input"
            type="text"
            value={coupon}
            onChange={e => { setCoupon(e.target.value); setCouponMsg(null); }}
            placeholder="ex: Tranzor10"
            className="coupon-input"
            autoComplete="off"
          />
          <button type="submit" className="coupon-btn">Aplicar</button>
        </div>
        {couponMsg && (
          <p className="coupon-msg" role="alert">{couponMsg}</p>
        )}
      </form>

      {/* CTA */}
      <Link data-testid="checkout-btn" to="/checkout" className="btn-checkout" aria-label="Finalizar compra" onClick={() => trackEvent('checkout_started', { source: 'cart' })}>
        Finalizar compra
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>

      <div className="summary-guarantees">
        {[
          { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Pagamento seguro' },
          { icon: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5', label: 'Devolução 30 dias' },
        ].map(({ icon, label }) => (
          <div key={label} className="summary-guarantee-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="var(--red)" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d={icon}/>
            </svg>
            {label}
          </div>
        ))}
      </div>

      <button onClick={onClear} className="clear-cart-btn" aria-label="Esvaziar carrinho">
        Esvaziar carrinho
      </button>
    </aside>
  );
}

/* ─────────────────────────────────────────
   PÁGINA PRINCIPAL
   ───────────────────────────────────────── */
export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, addItem } = useCartStore();
  const { itemCount, subtotal, shipping, total } = useCartComputed();
  const count   = itemCount;
  const sub     = subtotal;
  const ship    = shipping;
  const tot     = total;
  const isEmpty = items.length === 0;
  const upsellVariant = getVariant('cart_upsell');

  const upsellItems = [
    { id: 'upsell-pen', name: 'Ponta esferográfica padrão', price: 4.90, description: 'Ideal para completar o escritório com rapidez.' },
    { id: 'upsell-tape', name: 'Fita adesiva dupla face', price: 6.50, description: 'Excelente para organizar e montar com segurança.' },
    { id: 'upsell-notes', name: 'Bloco de notas A5', price: 5.20, description: 'Prático para tarefas rápidas e lembretes diários.' },
  ];

  useEffect(() => {
    trackEvent('experiment_exposed', { experiment: 'cart_upsell', variant: upsellVariant });
    trackEvent('upsell_viewed', { section: 'cart', variant: upsellVariant });
  }, [upsellVariant]);

  const handleAddUpsell = (item: { id: string; name: string; price: number; description: string }) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      to: '/shop',
      quantity: 1,
    });
    trackEvent('upsell_added', { id: item.id, name: item.name, price: item.price });
    window.dispatchEvent(new CustomEvent('Tranzor:cart-add'));
  };

  return (
    <AppLayout
      title="Carrinho — Tranzor"
      description="Revise os itens do carrinho, veja o progresso para envio grátis e finalize a compra com confiança."
      canonical="/cart"
    >
      {/* ── cabeçalho ── */}
      <header className="cart-header" role="banner">
        <div className="cart-header-inner">
          <div>
            <Link to="/shop" className="cart-back-link" aria-label="Continuar a comprar">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Continuar a comprar
            </Link>
            <h1 className="cart-title">
              Carrinho
              {count > 0 && (
                <span className="cart-title-badge" aria-label={`${count} itens`}>{count}</span>
              )}
            </h1>
          </div>
          <div className="cart-header-steps" aria-label="Etapas da compra">
            {['Carrinho', 'Entrega', 'Pagamento', 'Confirmação'].map((step, i) => (
              <React.Fragment key={step}>
                <div className={`cart-step ${i === 0 ? 'cart-step-active' : ''}`} aria-current={i === 0 ? 'step' : undefined}>
                  <span className="cart-step-num" aria-hidden>{i + 1}</span>
                  <span className="cart-step-label">{step}</span>
                </div>
                {i < 3 && <div className="cart-step-sep" aria-hidden />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1.75rem 2rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
          <RFQUploadZone />
          <BarcodeScannerPanel />
        </div>
      </div>

      {/* ── conteúdo ── */}
      <main className="cart-main">
        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="cart-layout">
            {/* lista de itens */}
            <section aria-labelledby="cart-items-heading">
              <h2 id="cart-items-heading" className="sr-only">Produtos no carrinho</h2>

              {/* cabeçalho da tabela (desktop) */}
              <div className="cart-list-header" aria-hidden>
                <span style={{ flex: 1 }}>Produto</span>
                <span style={{ width: 110, textAlign: 'center' }}>Quantidade</span>
                <span style={{ width: 80, textAlign: 'right' }}>Total</span>
                <span style={{ width: 40 }} />
              </div>

              <div className="cart-list" role="list">
                {items.map(item => (
                  <div key={item.id} role="listitem" data-testid="cart-item">
                    <CartRow
                      {...item}
                      onQty={updateQuantity}
                      onRemove={removeItem}
                    />
                  </div>
                ))}
              </div>

              {/* rodapé da lista */}
              <div className="cart-list-footer">
                <Link to="/shop" className="cart-back-link">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Adicionar mais produtos
                </Link>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem 1.1rem', borderRadius: 14, background: 'var(--charcoal-2)', border: '1px solid var(--border)' }}>
                <p style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)' }}>
                  {upsellVariant === 'variant' ? 'Complete o pedido com confiança' : 'Compare antes de fechar o pedido'}
                </p>
                <p style={{ margin: '0 0 12px', color: 'var(--muted-light)', fontSize: 14, lineHeight: 1.6 }}>
                  {upsellVariant === 'variant'
                    ? 'Adicione itens rápidos ao carrinho para reduzir a desistência e aproveitar a conveniência de uma entrega única.'
                    : 'Se ainda está indeciso, compare os melhores produtos e evite arrependimento por compra.'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <Link
                    to="/shop/compare"
                    onClick={() => trackEvent('compare_opened', { source: 'cart' })}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--red)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}
                  >
                    Abrir comparador
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  <Link
                    to="/shop/ofertas"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--muted-light)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}
                  >
                    Ver promoções
                  </Link>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem 1.1rem', borderRadius: 14, background: 'linear-gradient(135deg, rgba(217,4,41,0.12), rgba(217,4,41,0.02))', border: '1px solid rgba(217,4,41,0.2)' }}>
                <p style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text)' }}>
                  Complemente o carrinho
                </p>
                <p style={{ margin: '0 0 14px', color: 'var(--muted-light)', fontSize: 14, lineHeight: 1.6 }}>
                  Itens rápidos para fechar a compra sem sair da página.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                  {upsellItems.map(item => (
                    <div key={item.id} style={{ background: 'rgba(24,24,24,0.95)', borderRadius: 12, padding: 12, border: '1px solid var(--border)' }}>
                      <p style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)' }}>{item.name}</p>
                      <p style={{ margin: '0 0 10px', color: 'var(--muted-light)', fontSize: 13, lineHeight: 1.5 }}>{item.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'var(--red)', fontWeight: 800 }}>{fmt(item.price)}</span>
                        <button
                          type="button"
                          onClick={() => handleAddUpsell(item)}
                          style={{ border: 'none', borderRadius: 999, background: 'var(--red)', color: 'white', padding: '8px 12px', fontFamily: 'var(--font-display)', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* resumo */}
            <OrderSummary
              subtotal={sub} shipping={ship} total={tot}
              itemCount={count} onClear={clearCart}
            />
          </div>
        )}
      </main>

      {/* ── estilos ── */}
      <style>{`
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

        /* ── Header ── */
        .cart-header {
          border-bottom: 1px solid var(--border);
          background: var(--charcoal-2);
          padding: 5.5rem 2rem 0;
        }
        .cart-header-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: flex-end;
          justify-content: space-between;
          gap: 2rem; flex-wrap: wrap;
          padding-bottom: 1.5rem;
        }
        .cart-back-link {
          display: inline-flex; align-items: center; gap: 6px;
          color: var(--muted-light); font-family: var(--font-display);
          font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
          text-decoration: none; text-transform: uppercase;
          margin-bottom: 10px;
          transition: color 0.2s;
        }
        .cart-back-link:hover { color: var(--red); }
        .cart-title {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(2rem, 5vw, 3rem);
          color: var(--text); letter-spacing: -0.5px;
          display: flex; align-items: center; gap: 14px; margin: 0;
        }
        .cart-title-badge {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 32px; height: 32px; padding: 0 8px;
          background: var(--red); color: white;
          font-size: 14px; font-weight: 700;
          border-radius: 99px;
          box-shadow: 0 0 12px rgba(217,4,41,0.4);
        }

        /* etapas */
        .cart-header-steps {
          display: flex; align-items: center; gap: 0;
          font-family: var(--font-display); font-size: 12px;
        }
        .cart-step {
          display: flex; align-items: center; gap: 7px;
          color: var(--muted); opacity: 0.45;
        }
        .cart-step.cart-step-active { color: var(--red); opacity: 1; }
        .cart-step-num {
          width: 22px; height: 22px; border-radius: 50%;
          border: 1.5px solid currentColor;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; flex-shrink: 0;
        }
        .cart-step-active .cart-step-num {
          background: var(--red); border-color: var(--red); color: white;
        }
        .cart-step-label { font-weight: 600; white-space: nowrap; }
        .cart-step-sep {
          width: 28px; height: 1px;
          background: var(--border); margin: 0 6px;
        }
        @media (max-width: 600px) {
          .cart-step-label { display: none; }
          .cart-header-steps { gap: 4px; }
        }

        /* ── Main ── */
        .cart-main {
          max-width: 1280px; margin: 0 auto;
          padding: 2.5rem 2rem 6rem;
        }

        /* ── Empty ── */
        .cart-empty {
          text-align: center; padding: 6rem 2rem;
          max-width: 480px; margin: 0 auto;
        }
        .cart-empty-icon {
          width: 100px; height: 100px; border-radius: 24px;
          background: rgba(217,4,41,0.08); border: 1px solid rgba(217,4,41,0.15);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 2rem;
        }
        .cart-empty-title {
          font-family: var(--font-display); font-weight: 700;
          font-size: 1.6rem; color: var(--text); margin-bottom: 12px;
        }
        .cart-empty-desc {
          color: var(--muted-light); font-size: 15px; line-height: 1.7;
          margin-bottom: 2rem;
        }
        .btn-primary-cart {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--red); color: white;
          font-family: var(--font-display); font-weight: 700; font-size: 13px;
          letter-spacing: 1px; text-transform: uppercase;
          padding: 13px 26px; border-radius: 10px;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(217,4,41,0.25);
          transition: background 0.2s, transform 0.2s;
        }
        .btn-primary-cart:hover { background: #b8031c; transform: translateY(-2px); }
        .btn-ghost-cart {
          display: inline-flex; align-items: center;
          background: transparent; color: var(--muted-light);
          font-family: var(--font-display); font-weight: 600; font-size: 13px;
          padding: 13px 22px; border-radius: 10px;
          border: 1px solid var(--border);
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-ghost-cart:hover { border-color: var(--red); color: var(--red); }

        /* ── Layout ── */
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 2.5rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .cart-layout { grid-template-columns: 1fr; }
        }

        /* ── Cabeçalho da lista ── */
        .cart-list-header {
          display: flex; align-items: center; gap: 16px;
          padding: 0 1rem 10px;
          font-family: var(--font-display); font-size: 11px;
          font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--muted); border-bottom: 1px solid var(--border);
          margin-bottom: 4px;
        }
        @media (max-width: 600px) { .cart-list-header { display: none; } }

        /* ── Item row ── */
        .cart-list { display: flex; flex-direction: column; gap: 0; }
        .cart-row {
          display: flex; align-items: center; gap: 16px;
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--border);
          transition: background 0.2s;
        }
        .cart-row:hover { background: rgba(217,4,41,0.03); border-radius: 8px; }
        .cart-thumb {
          width: 72px; height: 72px; flex-shrink: 0;
          background: linear-gradient(135deg, var(--charcoal-2) 0%, var(--mid, #2a2a2a) 100%);
          border-radius: 12px; border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          text-decoration: none;
          transition: border-color 0.2s;
        }
        .cart-thumb:hover { border-color: rgba(217,4,41,0.4); }
        .cart-badge {
          position: absolute; top: 5px; left: 5px;
          font-size: 8px; font-weight: 800;
          font-family: var(--font-display); letter-spacing: 1px;
          padding: 2px 5px; border-radius: 3px; color: white;
          text-transform: uppercase;
        }
        .badge-sale { background: #d90429; }
        .badge-novo { background: #2ecc71; }
        .cart-row-info { flex: 1; min-width: 0; }
        .cart-row-name {
          display: block; font-family: var(--font-display);
          font-weight: 600; font-size: 14px; color: var(--text);
          text-decoration: none; line-height: 1.4;
          margin-bottom: 6px; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
          transition: color 0.2s;
        }
        .cart-row-name:hover { color: var(--red); }
        .cart-row-meta { display: flex; align-items: center; gap: 8px; }
        .cart-price-main {
          font-family: var(--font-display); font-weight: 800;
          font-size: 16px; color: var(--red);
        }
        .cart-price-original {
          font-size: 12px; color: var(--muted);
          text-decoration: line-through;
        }

        /* controlo de quantidade */
        .cart-qty-wrap {
          display: flex; align-items: center; gap: 0;
          width: 110px; flex-shrink: 0;
          background: var(--charcoal-2); border: 1px solid var(--border);
          border-radius: 8px; overflow: hidden;
        }
        .cart-qty-btn {
          width: 34px; height: 34px; background: transparent;
          border: none; cursor: pointer; color: var(--text);
          font-size: 18px; font-weight: 300; line-height: 1;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s;
          flex-shrink: 0;
        }
        .cart-qty-btn:hover:not(:disabled) { background: rgba(217,4,41,0.12); color: var(--red); }
        .cart-qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .cart-qty-val {
          flex: 1; text-align: center;
          font-family: var(--font-display); font-weight: 700; font-size: 14px;
          color: var(--text); border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
          line-height: 34px;
        }

        /* subtotal da linha */
        .cart-row-subtotal {
          width: 80px; text-align: right; flex-shrink: 0;
          font-family: var(--font-display); font-weight: 700;
          font-size: 15px; color: var(--text);
        }

        /* remover */
        .cart-remove-btn {
          width: 34px; height: 34px; flex-shrink: 0;
          background: transparent; border: 1px solid transparent;
          border-radius: 8px; cursor: pointer;
          color: var(--muted); display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .cart-remove-btn:hover {
          background: rgba(217,4,41,0.08);
          color: var(--red); border-color: rgba(217,4,41,0.25);
        }

        /* rodapé */
        .cart-list-footer {
          padding: 1.25rem 1rem 0;
          display: flex; justify-content: flex-start;
        }

        /* ── Resumo ── */
        .order-summary {
          background: var(--charcoal-2); border: 1px solid var(--border);
          border-radius: 16px; padding: 2rem;
          position: sticky; top: 90px;
        }
        .summary-title {
          font-family: var(--font-display); font-weight: 700;
          font-size: 18px; color: var(--text);
          margin: 0 0 1.5rem;
          padding-bottom: 1rem; border-bottom: 1px solid var(--border);
        }

        /* barra de envio grátis */
        .free-shipping-bar {
          margin-bottom: 1.25rem;
          background: rgba(217,4,41,0.06); border: 1px solid rgba(217,4,41,0.15);
          border-radius: 10px; padding: 12px 14px;
        }
        .free-shipping-top {
          display: flex; justify-content: space-between; align-items: center;
          font-family: var(--font-display); font-size: 11px; font-weight: 600;
          color: var(--muted-light); margin-bottom: 8px;
        }
        .free-shipping-rem { color: var(--red); font-weight: 700; }
        .free-shipping-track {
          height: 4px; background: rgba(217,4,41,0.15); border-radius: 99px; overflow: hidden;
        }
        .free-shipping-fill {
          height: 100%; background: var(--red); border-radius: 99px;
          transition: width 0.5s cubic-bezier(.22,1,.36,1);
        }
        .free-shipping-achieved {
          display: flex; align-items: center; gap: 6px;
          background: rgba(46,204,113,0.1); border: 1px solid rgba(46,204,113,0.25);
          border-radius: 8px; padding: 8px 12px; margin-bottom: 1.25rem;
          font-family: var(--font-display); font-size: 12px; font-weight: 700;
          color: #2ecc71;
        }

        /* valores */
        .summary-rows { margin: 0 0 1.5rem; display: flex; flex-direction: column; gap: 10px; }
        .summary-row {
          display: flex; justify-content: space-between; align-items: center;
          font-family: var(--font-display); font-size: 13px;
          color: var(--muted-light);
        }
        .summary-row dt { font-weight: 500; }
        .summary-row dd { font-weight: 700; color: var(--text); }
        .summary-count { font-weight: 400; color: var(--muted); }
        .summary-free { color: #2ecc71 !important; }
        .summary-row-total {
          margin-top: 6px; padding-top: 14px;
          border-top: 1px solid var(--border);
          font-size: 16px !important;
        }
        .summary-row-total dt { color: var(--text) !important; font-weight: 700 !important; }
        .summary-row-total dd { color: var(--red) !important; font-size: 20px !important; }

        /* cupão */
        .coupon-form { margin-bottom: 1.5rem; }
        .coupon-label {
          display: block; font-family: var(--font-display);
          font-size: 11px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 8px;
        }
        .coupon-row { display: flex; gap: 0; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
        .coupon-input {
          flex: 1; padding: 10px 14px; background: var(--charcoal-3, #1a1a1a);
          border: none; outline: none; color: var(--text);
          font-family: var(--font-display); font-size: 13px;
        }
        .coupon-input:focus { box-shadow: none; }
        .coupon-btn {
          padding: 10px 16px; background: var(--charcoal-2); color: var(--red);
          border: none; border-left: 1px solid var(--border);
          font-family: var(--font-display); font-size: 12px;
          font-weight: 700; letter-spacing: 0.5px; cursor: pointer;
          transition: background 0.15s;
        }
        .coupon-btn:hover { background: rgba(217,4,41,0.1); }
        .coupon-msg {
          font-family: var(--font-display); font-size: 12px;
          color: #e67e22; margin: 6px 0 0;
        }

        /* botão checkout */
        .btn-checkout {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 15px; margin-bottom: 1.25rem;
          background: var(--red); color: white;
          font-family: var(--font-display); font-weight: 800;
          font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase;
          border-radius: 10px; text-decoration: none;
          box-shadow: 0 8px 28px rgba(217,4,41,0.3);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .btn-checkout:hover {
          background: #b8031c; transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(217,4,41,0.4);
        }

        /* garantias */
        .summary-guarantees {
          display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 1.25rem;
        }
        .summary-guarantee-item {
          display: flex; align-items: center; gap: 5px;
          font-family: var(--font-display); font-size: 11px;
          color: var(--muted); font-weight: 500;
        }

        /* esvaziar */
        .clear-cart-btn {
          width: 100%; padding: 10px; background: transparent;
          border: 1px solid rgba(217,4,41,0.2); border-radius: 8px;
          font-family: var(--font-display); font-size: 12px; font-weight: 600;
          color: var(--muted); cursor: pointer; letter-spacing: 0.5px;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .clear-cart-btn:hover {
          border-color: rgba(217,4,41,0.5); color: var(--red);
          background: rgba(217,4,41,0.05);
        }

        /* ── Focus ── */
        a:focus-visible, button:focus-visible, input:focus-visible {
          outline: 2px solid var(--red); outline-offset: 3px; border-radius: 4px;
        }
      `}</style>
    </AppLayout>
  );
}