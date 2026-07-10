import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layouts/AppLayout';
import ForgotForm from '../../components/auth/ForgotForm';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  return (
    <AppLayout bare>
      <Helmet>
        <title>{t('auth.forgotPageTitle')} — Tranzor</title>
        <meta name="description" content={t('auth.forgotPageDescription')} />
        <link rel="canonical" href="https://www.tranzor.pt/auth/forgot" />
      </Helmet>

      <div className="fp-root">

        <aside className="fp-side" aria-hidden="true">
          <div className="fp-side-inner">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <img
                src="https://apcergroup.com/images/site/images/Newsroom/TRANZOR.png"
                alt="Tranzor"
                style={{ height: 36, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '3rem' }}
              />
            </Link>

            <span className="fp-eyebrow">{t('auth.recoveryTitle')}</span>
            <h1 className="fp-title">
              {t('auth.recoveryHeroTitle')}<br />
              {t('auth.recoveryHeroTitleAccent')}<br />
              <span className="fp-title-accent">{t('auth.recoveryHeroTitleSuffix')}</span>
            </h1>
            <p className="fp-sub">
              {t('auth.recoveryHeroBody')}
            </p>

            <ol className="fp-timeline" aria-label="Processo de recuperação">
              {[
                { icon: '', step: t('auth.recoveryStep1') },
                { icon: '', step: t('auth.recoveryStep2') },
                { icon: '', step: t('auth.recoveryStep3') },
                { icon: '', step: t('auth.recoveryStep4') },
              ].map((s, i) => (
                <li key={i} className="fp-tl-item">
                  <span className="fp-tl-icon" aria-hidden>{s.icon}</span>
                  <span className="fp-tl-text">{s.step}</span>
                </li>
              ))}
            </ol>

            <div className="fp-support">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden style={{ color: 'rgba(255,77,107,0.7)', flexShrink: 0 }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12 19.79 19.79 0 0 1 1.06 3.4 2 2 0 0 1 3.02 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>
                Problema com o acesso?{' '}
                <Link to="/contact" style={{ color: 'rgba(255,77,107,0.8)', textDecoration: 'none', fontWeight: 600 }}>
                  {t('auth.supportLink')}
                </Link>
              </span>
            </div>
          </div>

          <div className="fp-deco" aria-hidden>
            <div className="fp-deco-ring fp-deco-1" />
            <div className="fp-deco-ring fp-deco-2" />
          </div>
        </aside>

        <main className="fp-main">
          <div className="fp-card">

            <div className="fp-logo-mobile">
              <Link to="/"><img src="https://apcergroup.com/images/site/images/Newsroom/TRANZOR.png" alt="Tranzor" style={{ height: 32, width: 'auto', objectFit: 'contain' }} /></Link>
            </div>

            <div className="fp-card-header">
              <p className="fp-card-eyebrow">— {t('auth.forgotCardEyebrow')}</p>
              <h2 className="fp-card-title">{t('auth.forgotCardTitle')}</h2>
              <p className="fp-card-sub">
                {t('auth.forgotCardBody')}
              </p>
            </div>

            <ForgotForm />

            <p className="fp-legal">
              {t('auth.forgotNoAccount')}{' '}
              <Link to="/auth/register" style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>
                {t('auth.forgotLinkButton')}
              </Link>
            </p>
          </div>
        </main>
      </div>

      <style>{`
        .fp-root {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }
        @media (max-width: 900px) { .fp-root { grid-template-columns: 1fr; } }
        .fp-side {
          background: linear-gradient(160deg, #080808 0%, #0a0012 55%, #0a0808 100%);
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          padding: 5rem 4rem;
        }
        @media (max-width: 900px) { .fp-side { display: none; } }
        .fp-side-inner { position: relative; z-index: 2; max-width: 420px; }
        .fp-eyebrow {
          display: block; font-family: var(--font-display); font-weight: 700;
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(255,77,107,0.85); margin-bottom: 1.25rem;
        }
        .fp-title {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(1.9rem, 3vw, 2.8rem);
          color: white; line-height: 1.15; letter-spacing: -1.5px;
          margin: 0 0 1.25rem;
        }
        .fp-title-accent { color: #ff4d6b; }
        .fp-sub {
          font-family: var(--font-display); font-size: 14px;
          color: rgba(255,255,255,0.5); line-height: 1.75; margin: 0 0 2.5rem;
        }
        .fp-timeline { list-style: none; margin: 0 0 2.5rem; padding: 0; display: flex; flex-direction: column; gap: 16px; }
        .fp-tl-item { display: flex; align-items: center; gap: 14px; }
        .fp-tl-icon {
          font-size: 18px; width: 36px; height: 36px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,77,107,0.08); border: 1px solid rgba(255,77,107,0.15);
          border-radius: 10px;
        }
        .fp-tl-text {
          font-family: var(--font-display); font-size: 13px;
          color: rgba(255,255,255,0.65); font-weight: 500;
        }
        .fp-support {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-display); font-size: 12px;
          color: rgba(255,255,255,0.3);
        }
        .fp-deco { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .fp-deco-ring { position: absolute; border-radius: 50%; }
        .fp-deco-1 { top: -100px; right: -150px; width: 400px; height: 400px; border: 1px solid rgba(255,77,107,0.07); }
        .fp-deco-2 { bottom: -60px; left: -80px; width: 250px; height: 250px; border: 1px solid rgba(255,77,107,0.05); }
        .fp-main {
          background: var(--bg, #0a0a0a);
          display: flex; align-items: center; justify-content: center;
          padding: 4rem 2rem;
        }
        .fp-card {
          width: 100%; max-width: 420px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .fp-logo-mobile { display: none; margin-bottom: 0.5rem; }
        @media (max-width: 900px) { .fp-logo-mobile { display: block; } }
        .fp-card-header { display: flex; flex-direction: column; gap: 4px; margin-bottom: 4px; }
        .fp-card-eyebrow {
          font-family: var(--font-display); font-weight: 700; font-size: 11px;
          letter-spacing: 2.5px; text-transform: uppercase; color: var(--red);
        }
        .fp-card-title {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(1.6rem, 3vw, 2.2rem); color: var(--text);
          letter-spacing: -0.5px; margin: 4px 0 0;
        }
        .fp-card-sub {
          font-family: var(--font-display); font-size: 13px;
          color: var(--muted); line-height: 1.6; margin: 6px 0 0;
        }
        .fp-legal {
          font-family: var(--font-display); font-size: 12px;
          color: var(--muted); text-align: center; margin: 0;
        }
      `}</style>
    </AppLayout>
  );
}