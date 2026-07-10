import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layouts/AppLayout';

export default function MobiliarioPage() {
  const { t } = useTranslation();
  const items = [
    { key: 'chairs', title: t('shop.categoryPages.mobiliario.items.chairs.title'), description: t('shop.categoryPages.mobiliario.items.chairs.description') },
    { key: 'desks', title: t('shop.categoryPages.mobiliario.items.desks.title'), description: t('shop.categoryPages.mobiliario.items.desks.description') },
    { key: 'storage', title: t('shop.categoryPages.mobiliario.items.storage.title'), description: t('shop.categoryPages.mobiliario.items.storage.description') },
    { key: 'accessories', title: t('shop.categoryPages.mobiliario.items.accessories.title'), description: t('shop.categoryPages.mobiliario.items.accessories.description') },
  ];

  return (
    <AppLayout
      title={t('shop.categoryPages.mobiliario.title')}
      description={t('shop.categoryPages.mobiliario.description')}
      canonical="/shop/mobiliario"
    >
      <section className="page-hero">
        <h1>{t('shop.categoryPages.mobiliario.heroTitle')}</h1>
        <p className="page-copy">
          {t('shop.categoryPages.mobiliario.heroBody')}
        </p>
      </section>

      <section className="container page-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <p>
            {t('shop.categoryPages.mobiliario.intro')}
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
            <Link to="/shop" className="btn-ghost" style={{ minWidth: 170 }}>{t('shop.categoryPages.common.viewAllStore')}</Link>
            <Link to="/shop/escritorio" className="btn-primary" style={{ minWidth: 170 }}>{t('shop.categoryPages.common.viewOffice')}</Link>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
