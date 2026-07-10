import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layouts/AppLayout';

export default function ArtesPage() {
  const { t } = useTranslation();
  const items = [
    { key: 'painting', title: t('shop.categoryPages.artes.items.painting.title'), description: t('shop.categoryPages.artes.items.painting.description') },
    { key: 'diy', title: t('shop.categoryPages.artes.items.diy.title'), description: t('shop.categoryPages.artes.items.diy.description') },
    { key: 'textile', title: t('shop.categoryPages.artes.items.textile.title'), description: t('shop.categoryPages.artes.items.textile.description') },
    { key: 'creative', title: t('shop.categoryPages.artes.items.creative.title'), description: t('shop.categoryPages.artes.items.creative.description') },
  ];

  return (
    <AppLayout
      title={t('shop.categoryPages.artes.title')}
      description={t('shop.categoryPages.artes.description')}
      canonical="/shop/artes"
    >
      <section className="page-hero">
        <h1>{t('shop.categoryPages.artes.heroTitle')}</h1>
        <p className="page-copy">
          {t('shop.categoryPages.artes.heroBody')}
        </p>
      </section>

      <section className="container page-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <p>
            {t('shop.categoryPages.artes.intro')}
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
            <Link to="/shop" className="btn-ghost" style={{ minWidth: 170 }}>{t('shop.categoryPages.common.exploreStore')}</Link>
            <Link to="/shop/impressao" className="btn-primary" style={{ minWidth: 170 }}>{t('shop.categoryPages.common.copyCenter')}</Link>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
