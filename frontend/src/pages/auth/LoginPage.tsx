import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layouts/AppLayout';
import LoginForm, { AuthStyles } from '../../components/auth/LoginForm';

const PERKS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M6 6L8 18H16L18 6H6Z"/><circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="15" cy="20" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
    label: 'Rastreio de encomendas em tempo real',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    label: 'Pontos de fidelidade em cada compra',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    label: 'Lista de favoritos e histórico de compras',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    label: 'Reposição rápida de pedidos anteriores',
  },
];

export default function LoginPage() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <AppLayout bare>
      <Helmet>
        <title>{t('auth.loginPageTitle')} — Tranzor</title>
        <meta name="description" content={t('auth.loginPageDescription')} />
        <link rel="canonical" href="https://www.tranzor.pt/auth/login" />
      </Helmet>

      <div className="lp-root">

        <aside className="lp-side" aria-hidden="true">
          <div className="lp-side-inner">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <img
                src="https://apcergroup.com/images/site/images/Newsroom/TRANZOR.png"
                alt="Tranzor"
                style={{ height: 36, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '3rem' }}
              />
            </Link>

            <div className="lp-side-tagline">
              <span className="lp-side-eyebrow">{t('auth.welcomeBack')}</span>
              <h1 className="lp-side-title">
                {t('auth.loginHeroTitle')}<br />
                {t('auth.loginHeroTitleAccent')} <span style={{ color: '#ff4d6b' }}>{t('auth.loginHeroTitleAccent')}</span>.
              </h1>
              <p className="lp-side-sub">
                {t('auth.loginHeroBody')}
              </p>
            </div>

            <ul className="lp-perks" role="list">
              {PERKS.map(p => (
                <li key={p.label} className="lp-perk">
                  <span className="lp-perk-icon" aria-hidden>{p.icon}</span>
                  <span>{p.label}</span>
                </li>
              ))}
            </ul>

            <div className="lp-side-since">Tranzor · Loja de exemplo · Portugal</div>
          </div>

          <div className="lp-deco" aria-hidden>
            <div className="lp-deco-ring lp-deco-ring--1" />
            <div className="lp-deco-ring lp-deco-ring--2" />
            <div className="lp-deco-ring lp-deco-ring--3" />
          </div>
        </aside>

        <main className="lp-main">
          <div className="lp-card">

            <div className="lp-card-header">
              <div className="lp-logo-mobile">
                <Link to="/">
                  <img src="https://apcergroup.com/images/site/images/Newsroom/TRANZOR.png" alt="Tranzor" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                </Link>
              </div>
              <p className="lp-card-eyebrow">— {t('auth.clientArea')}</p>
              <h2 className="lp-card-title">{t('auth.signIn')}</h2>
              <p className="lp-card-sub">{t('auth.newCustomer')} <Link to="/auth/register" className="lp-card-switch-link" state={location.state}>{t('auth.createFreeAccount')}</Link></p>
            </div>

            <LoginForm showForgot showRegister={false} />

            <div className="auth-divider" style={{ margin: '8px 0' }}>ou</div>

            <Link to="/auth/b2b" className="auth-btn-secondary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/>
              </svg>
              {t('auth.businessAccess')}
            </Link>

            <p className="lp-legal">
              {t('auth.legalText')}{' '}
              <Link to="/terms" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>{t('auth.terms')}</Link>{' '}
              e{' '}
              <Link to="/privacy" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>{t('auth.privacy')}</Link>.
            </p>
          </div>
        </main>
      </div>

      <style>{`
        .lp-root {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }
        @media (max-width: 900px) { .lp-root { grid-template-columns: 1fr; } }
        .lp-side {
          background: linear-gradient(160deg, #0d0d0d 0%, #1a0005 60%, #0d0d0d 100%);
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          padding: 5rem 4rem;
        }
        @media (max-width: 900px) { .lp-side { display: none; } }
        .lp-side-inner { position: relative; z-index: 2; max-width: 460px; }
        .lp-side-eyebrow {
          display: block; font-family: var(--font-display); font-weight: 700;
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(255,77,107,0.85); margin-bottom: 1.25rem;
        }
        .lp-side-title {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(2.2rem, 3.5vw, 3.2rem);
          color: white; line-height: 1.1; letter-spacing: -1.5px;
          margin: 0 0 1.25rem;
        }
        .lp-side-sub {
          font-family: var(--font-display); font-size: 15px;
          color: rgba(255,255,255,0.55); line-height: 1.7; margin: 0 0 2.5rem;
        }
        .lp-perks { list-style: none; margin: 0 0 3rem; padding: 0; display: flex; flex-direction: column; gap: 14px; }
        .lp-perk {
          display: flex; align-items: center; gap: 14px;
          font-family: var(--font-display); font-size: 14px;
          color: rgba(255,255,255,0.7); font-weight: 500;
        }
        .lp-perk-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,77,107,0.12); border: 1px solid rgba(255,77,107,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #ff4d6b; flex-shrink: 0;
        }
        .lp-side-since {
          font-family: var(--font-display); font-size: 11px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.2);
        }
        .lp-deco { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .lp-deco-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(255,77,107,0.08);
        }
        .lp-deco-ring--1 { width: 500px; height: 500px; top: -120px; right: -200px; }
        .lp-deco-ring--2 { width: 320px; height: 320px; bottom: 40px; left: -100px; border-color: rgba(255,77,107,0.05); }
        .lp-deco-ring--3 { width: 160px; height: 160px; top: 60%; right: 10%; border-color: rgba(255,77,107,0.06); }
        .lp-main {
          background: var(--bg, #0a0a0a);
          display: flex; align-items: center; justify-content: center;
          padding: 4rem 2rem;
        }
        .lp-card {
          width: 100%; max-width: 440px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .lp-logo-mobile { display: none; margin-bottom: 0.5rem; }
        @media (max-width: 900px) { .lp-logo-mobile { display: block; } }
        .lp-card-header { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
        .lp-card-eyebrow {
          font-family: var(--font-display); font-weight: 700; font-size: 11px;
          letter-spacing: 2.5px; text-transform: uppercase; color: var(--red);
        }
        .lp-card-title {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(1.6rem, 3vw, 2.2rem); color: var(--text);
          letter-spacing: -0.5px; margin: 4px 0 0;
        }
        .lp-card-sub {
          font-family: var(--font-display); font-size: 13px;
          color: var(--muted); margin: 6px 0 0;
        }
        .lp-card-switch-link {
          color: var(--red); font-weight: 700; text-decoration: none;
          transition: opacity 0.2s;
        }
        .lp-card-switch-link:hover { opacity: 0.75; }
        .lp-legal {
          font-family: var(--font-display); font-size: 11px;
          color: var(--muted); text-align: center; line-height: 1.6; margin: 0;
        }
      `}</style>
    </AppLayout>
  );
}