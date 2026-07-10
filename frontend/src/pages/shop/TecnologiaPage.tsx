import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layouts/AppLayout';

export default function TecnologiaPage() {
  const { t } = useTranslation();
  const items = [
    { key: 'printing', title: t('shop.categoryPages.tecnologia.items.printing.title'), description: t('shop.categoryPages.tecnologia.items.printing.description') },
    { key: 'it', title: t('shop.categoryPages.tecnologia.items.it.title'), description: t('shop.categoryPages.tecnologia.items.it.description') },
    { key: 'connectivity', title: t('shop.categoryPages.tecnologia.items.connectivity.title'), description: t('shop.categoryPages.tecnologia.items.connectivity.description') },
    { key: 'mobility', title: t('shop.categoryPages.tecnologia.items.mobility.title'), description: t('shop.categoryPages.tecnologia.items.mobility.description') },
  ];

  return (
    <AppLayout
      title={t('shop.categoryPages.tecnologia.title')}
      description={t('shop.categoryPages.tecnologia.description')}
      canonical="/shop/tecnologia"
    >
      <section className="page-hero">
        <h1>{t('shop.categoryPages.tecnologia.heroTitle')}</h1>
        <p className="page-copy">
          {t('shop.categoryPages.tecnologia.heroBody')}
        </p>
      </section>

      <section className="container page-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <p>
            {t('shop.categoryPages.tecnologia.intro')}
          </p>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {items.map((item) => (
              <div key={item.title} style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 16, background: 'var(--charcoal-2)' }}>
                <h2 style={{ margin: '0 0 0.75rem 0' }}>{item.title}</h2>
                <p style={{ margin: 0, lineHeight: 1.75, color: 'var(--muted)' }}>{item.description}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Link to="/shop" className="btn-ghost" style={{ minWidth: 170 }}>{t('shop.categoryPages.common.viewStore')}</Link>
            <Link to="/shop/ofertas" className="btn-primary" style={{ minWidth: 170 }}>{t('shop.categoryPages.common.viewPromotions')}</Link>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
