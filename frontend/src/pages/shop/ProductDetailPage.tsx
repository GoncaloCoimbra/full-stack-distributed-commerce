import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import { apiClient } from '@/services/apiClient';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '../../store/cartStore';
import { trackEvent } from '../../services/analytics';
import { getVariant } from '../../services/experiments';

/* ─────────────────────────────────────────
   TIPOS
   ───────────────────────────────────────── */
interface RecentlyViewedEntry {
  id: string;
  name: string;
  price: number;
  to: string;
  image?: string;
  badge?: string;
}

const RECENTLY_VIEWED_KEY = 'tranzor:recently-viewed';

function saveToRecentlyViewed(entry: RecentlyViewedEntry) {
  try {
    const prev: RecentlyViewedEntry[] = JSON.parse(
      localStorage.getItem(RECENTLY_VIEWED_KEY) ?? '[]'
    );
    const updated = [entry, ...prev.filter(p => p.id !== entry.id)].slice(0, 12);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch {
    /* silencioso — localStorage pode estar bloqueado */
  }
}

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct]   = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const addItem = useCartStore(state => state.addItem);
  const user    = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const loadProduct = async () => {
    if (!productId) {
      setError(t('shop.productDetail.errors.invalidProductId'));
      setLoading(false);
      return;
    }

    try {
      // Tenta buscar do backend
      const response = await apiClient.get<{ product: any; reviews: any[]; ratingStats: any }>(`/shop/products/${productId}`);
      if (!response.success || !response.data?.product) {
        throw new Error(response.error?.message || t('shop.productDetail.errors.loadProduct'));
      }

      const data = response.data.product;
      const accountPrice = data.accountPrice ?? data.currentPrice ?? data.price;
      setProduct({
        ...data,
        id: data._id?.toString() ?? data.id?.toString?.() ?? data.slug ?? '',
        slug: data.slug ?? data._id?.toString() ?? data.id?.toString?.(),
        image: data.images?.[0] || data.image || '',
        price: accountPrice,
        originalPrice: data.accountPrice ? (data.currentPrice ?? data.price) : undefined,
        rating: data.rating?.average ?? data.rating,
        reviews: response.data.reviews?.length ?? data.reviews ?? 0,
      });
    } catch (err: any) {
      setError(err?.message || t('shop.productDetail.errors.loadProduct'));
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const loadFavoriteStatus = async () => {
    if (!user || !productId) {
      setIsFavorite(false);
      return;
    }
    try {
      const response = await apiClient.get<{ favorites: any[] }>('/account/favorites');
      if (!response.success || !response.data) return;
      setIsFavorite(response.data.favorites.some(item => item._id === productId || item.id === productId));
    } catch {
      setIsFavorite(false);
    }
  };

  const compareVariant = getVariant('pdp_compare_cta');
  const compareCtaLabel = compareVariant === 'variant' ? t('shop.productDetail.compare.open') : t('shop.productDetail.compare.compare');

  useEffect(() => {
    loadProduct();
  }, [productId]);

  useEffect(() => {
    trackEvent('experiment_exposed', { experiment: 'pdp_compare_cta', variant: compareVariant });
  }, [compareVariant]);

  useEffect(() => {
    loadFavoriteStatus();
  }, [user, productId]);

  /* ── Guarda nos vistos recentemente ── */
  useEffect(() => {
    if (!product) return;
    saveToRecentlyViewed({
      id:    String(product.id),
      name:  product.name,
      price: product.price,
      to:    `/shop/product/${product.id}`,
      image: product.image,
      badge: product.badge,
    });
    trackEvent('product_viewed', {
      productId: String(product.id),
      productName: product.name,
      category: product.category,
    });
    // Dispara evento para que RecentlyViewedPage actualize se estiver aberta
    window.dispatchEvent(new CustomEvent('tranzor:product-viewed', { detail: { id: String(product.id) } }));
  }, [product]);

  /* ── Adicionar ao carrinho ── */
  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id:       product.id.toString(),
      name:     product.name,
      price:    product.price,
      to:       `/shop/product/${product.id}`,
      image:    product.image,
      quantity,
    });
    trackEvent('cart_add', {
      productId: String(product.id),
      productName: product.name,
      category: product.category,
      quantity,
    });
    window.dispatchEvent(new CustomEvent('tranzor:cart-add'));
    alert(t('shop.productDetail.cartAdded', { quantity, name: product.name }));
  };

  const handleToggleFavorite = async () => {
    if (!productId) return;
    if (!user) {
      navigate('/auth/login', { state: { from: `/shop/product/${productId}` } });
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await apiClient.delete(`/account/favorites/${productId}`);
        setIsFavorite(false);
      } else {
        await apiClient.post('/account/favorites', { productId });
        setIsFavorite(true);
      }
    } catch (err: any) {
      alert(err.message || t('shop.productDetail.errors.updateFavorites'));
    } finally {
      setFavoriteLoading(false);
    }
  };

  const relatedProducts = [
    { name: t('shop.productDetail.relatedProducts.pilot.name'), price: '€12,99', rating: '4.8★', link: '/shop/product/caneta-pilot-g2' },
    { name: t('shop.productDetail.relatedProducts.notebook.name'), price: '€5,49', rating: '4.6★', link: '/shop/product/caderno-oxford-a4' },
    { name: t('shop.productDetail.relatedProducts.markers.name'), price: '€8,29', rating: '4.7★', link: '/shop/product/marcadores-stabilo' },
    { name: t('shop.productDetail.relatedProducts.paper.name'), price: '€7,99', rating: '4.9★', link: '/shop/product/papel-navigator-a4' },
  ];

  const trustHighlights = [
    { title: t('shop.productDetail.trust.fastDelivery.title'), copy: t('shop.productDetail.trust.fastDelivery.copy') },
    { title: t('shop.productDetail.trust.securePayment.title'), copy: t('shop.productDetail.trust.securePayment.copy') },
    { title: t('shop.productDetail.trust.easyReturns.title'), copy: t('shop.productDetail.trust.easyReturns.copy') },
  ];

  const pageTitle = product ? `${product.name} — Tranzor` : t('shop.productDetail.pageTitle');
  const pageDescription = product
    ? product.description?.replace(/\s+/g, ' ').trim().slice(0, 160)
    : t('shop.productDetail.pageDescription');
  const canonicalUrl = `/shop/product/${productId}`;
  const structuredData = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: pageDescription,
    image: product.image ? [product.image] : undefined,
    sku: product.sku ?? String(product.id),
    offers: {
      '@type': 'Offer',
      url: `${window.location.origin}${canonicalUrl}`,
      priceCurrency: 'EUR',
      price: Number(product.price ?? 0),
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  } : undefined;

  if (loading) return <AppLayout title={pageTitle} description={pageDescription} canonical={canonicalUrl} structuredData={structuredData}><div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--muted)' }}>{t('shop.productDetail.loading')}</div></AppLayout>;
  if (error) return (
    <AppLayout title={pageTitle} description={pageDescription} canonical={canonicalUrl} structuredData={structuredData}>
      <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--red)' }}>
        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{t('common.error')}:</p>
        <p style={{ margin: '1rem 0 1.5rem', fontSize: '1rem' }}>{error}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={loadProduct}
            style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: 'var(--red)', color: 'white', cursor: 'pointer', fontWeight: 700 }}
          >
            {t('common.retry')}
          </button>
          <Link to="/shop" style={{ padding: '12px 24px', borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none', fontWeight: 700 }}>
            {t('shop.productDetail.backToShop')}
          </Link>
        </div>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout title={pageTitle} description={pageDescription} canonical={canonicalUrl} structuredData={structuredData}>
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" style={{ padding: '1.5rem 2rem 0', maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/"    style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'none', fontFamily: 'var(--font-display)' }}>{t('common.home')}</Link>
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>/</span>
        <Link to="/shop" style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'none', fontFamily: 'var(--font-display)' }}>{t('nav.shop')}</Link>
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>/</span>
        <span style={{ color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* ── Detalhe ── */}
      <section style={{ padding: '2.5rem 2rem 4rem', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48 }}>

          {/* Imagem */}
          <div>
            <div style={{ background: 'var(--charcoal-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {product.image ? (
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="7.5,4.27 12,6.11 16.5,4.27"/><line x1="12" y1="22.76" x2="12" y2="12"/>
                </svg>
              )}
            </div>
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: 'var(--text)', lineHeight: 1.2, marginBottom: 12 }}>
                {product.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 2 }} aria-label={t('shop.productDetail.ratingLabel', { rating: product.rating || 0 })}>
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(product.rating || 0) ? '#f39c12' : 'none'} stroke="#f39c12" strokeWidth="2" aria-hidden>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-display)' }}>
                  {product.rating || 0} ({t('products.reviewsCount', { count: product.reviews || 0 })})
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.2rem', color: 'var(--red)' }}>
                €{product.price?.toFixed(2) ?? '0.00'}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: 16, color: 'var(--muted)', textDecoration: 'line-through' }}>
                  €{product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.accountDiscountRate && (
                <span style={{ fontSize: 13, color: '#059669', fontWeight: 700, background: 'rgba(5,150,105,0.1)', padding: '6px 10px', borderRadius: 999, textTransform: 'uppercase' }}>
                  {t('products.b2bPrice', { rate: product.accountDiscountRate })}
                </span>
              )}
            </div>

            <p style={{ color: 'var(--muted-light)', fontSize: 15, lineHeight: 1.75 }}>{product.description}</p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, background: product.inStock ? 'rgba(46,204,113,0.1)' : 'rgba(217,4,41,0.08)', border: `1px solid ${product.inStock ? 'rgba(46,204,113,0.3)' : 'rgba(217,4,41,0.2)'}`, width: 'fit-content' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: product.inStock ? '#2ecc71' : 'var(--red)', flexShrink: 0 }} aria-hidden />
              <span style={{ fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 700, color: product.inStock ? '#2ecc71' : 'var(--red)', letterSpacing: 0.5 }}>
                {product.inStock ? t('products.inStock') : t('products.outOfStock')}
              </span>
            </div>

            {/* Quantidade */}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {t('products.quantity')}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'fit-content', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label={t('shop.productDetail.quantity.decrease')}
                  style={{ width: 44, height: 44, background: 'var(--charcoal-2)', border: 'none', color: 'var(--text)', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(217,4,41,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--charcoal-2)')}
                >−</button>
                <span style={{ minWidth: 52, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label={t('shop.productDetail.quantity.increase')}
                  style={{ width: 44, height: 44, background: 'var(--charcoal-2)', border: 'none', color: 'var(--text)', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(217,4,41,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--charcoal-2)')}
                >+</button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                data-testid="add-to-cart"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={{
                  flex: 1, minWidth: 180, padding: '14px 24px',
                  background: product.inStock ? 'var(--red)' : 'var(--charcoal-2)',
                  color: product.inStock ? 'white' : 'var(--muted)',
                  border: 'none', borderRadius: 10, fontSize: 14, cursor: product.inStock ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  letterSpacing: 1, textTransform: 'uppercase',
                  transition: 'background 0.2s, transform 0.15s',
                  boxShadow: product.inStock ? 'var(--shadow-red)' : 'none',
                }}
                onMouseEnter={e => { if (product.inStock) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; } }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                + {t('products.addToCart')}
              </button>
              <button
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
                style={{ padding: '14px 20px', background: isFavorite ? 'var(--red)' : 'transparent', color: isFavorite ? 'white' : 'var(--red)', border: '1px solid var(--red)', borderRadius: 10, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
                aria-label={isFavorite ? t('shop.productDetail.favorite.remove') : t('shop.productDetail.favorite.add')}
                onMouseEnter={e => (e.currentTarget.style.background = isFavorite ? 'var(--red)' : 'rgba(217,4,41,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = isFavorite ? 'var(--red)' : 'transparent')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {favoriteLoading ? t('shop.productDetail.favorite.updating') : isFavorite ? t('shop.productDetail.favorite.remove') : t('shop.productDetail.favorite.add')}
              </button>
            </div>

            {/* Garantias */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              {[
                { icon: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5', label: t('shop.productDetail.trust.easyReturns.title') },
                { icon: 'M5 12h14M12 5l7 7-7 7', label: t('home.trustShipping') },
                { icon: 'M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10', label: t('shop.productDetail.trust.securePayment.title') },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" aria-hidden><path d={icon}/></svg>
                  <span style={{ fontSize: 12, color: 'var(--muted-light)', fontFamily: 'var(--font-display)', fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 12 }}>
              {trustHighlights.map(highlight => (
                <div key={highlight.title} style={{ background: 'var(--charcoal-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>{highlight.title}</p>
                  <p style={{ margin: 0, color: 'var(--muted-light)', fontSize: 13, lineHeight: 1.5 }}>{highlight.copy}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 14 }}>
              <Link
                to="/shop/compare"
                onClick={() => trackEvent('compare_opened', { source: 'product_detail' })}
                style={{ background: 'transparent', color: 'var(--red)', border: '1px solid var(--red)', borderRadius: 10, padding: '12px 16px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}
              >
                {compareCtaLabel}
              </Link>
              <Link
                to="/faq"
                style={{ background: 'transparent', color: 'var(--muted-light)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}
              >
                {t('shop.productDetail.faqs')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Produtos Relacionados ── */}
      <section aria-labelledby="related-heading" style={{ padding: '4rem 2rem 6rem', borderTop: '1px solid var(--border)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: 16 }}>
          <h2 id="related-heading" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--text)', margin: 0 }}>
            {t('shop.productDetail.relatedHeading')}
          </h2>
          <Link to="/shop" style={{ color: 'var(--red)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, transition: 'gap 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.gap = '9px')}
            onMouseLeave={e => (e.currentTarget.style.gap = '5px')}
          >
            {t('shop.productDetail.viewMore')}
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {relatedProducts.map(prod => (
            <Link key={prod.name} to={prod.link} style={{ textDecoration: 'none' }}>
              <div
                style={{ background: 'var(--charcoal-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(217,4,41,0.35)'; el.style.transform = 'translateY(-4px)'; el.style.background = 'var(--charcoal-3)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.transform = 'translateY(0)'; el.style.background = 'var(--charcoal-2)'; }}
              >
                <div style={{ background: 'linear-gradient(135deg, var(--charcoal-3) 0%, var(--mid) 100%)', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" strokeLinecap="round" aria-hidden>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)', marginBottom: 8, fontSize: 14, lineHeight: 1.4 }}>{prod.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: 'var(--red)', fontSize: 16, fontFamily: 'var(--font-display)' }}>{prod.price}</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{prod.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Link para vistos recentemente ── */}
      <div style={{ padding: '0 2rem 4rem', maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
        <Link
          to="/shop/vistos-recentemente"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--muted-light)', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, textDecoration: 'none', padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 99, transition: 'border-color 0.2s, color 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(217,4,41,0.3)'; e.currentTarget.style.color = 'var(--red)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted-light)'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
          </svg>
          {t('shop.productDetail.recentlyViewedLink')}
        </Link>
      </div>
    </AppLayout>
  );
}