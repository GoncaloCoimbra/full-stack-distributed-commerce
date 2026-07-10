import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layouts/AppLayout';
import RegisterForm from '../../components/auth/RegisterForm';

const STEPS = [
  { num: '01', title: 'Crie a sua conta',      desc: 'Rápido e gratuito — leva menos de 1 minuto.' },
  { num: '02', title: 'Confirme o email',       desc: 'Enviamos um link de activação para si.' },
  { num: '03', title: 'Comece a comprar',       desc: '+25.000 produtos com entrega em todo Portugal.' },
];

export default function RegisterPage() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <AppLayout bare>
      <Helmet>
        <title>{t('auth.registerPageTitle')} — Tranzor</title>
        <meta name="description" content={t('auth.registerPageDescription')} />
        <link rel="canonical" href="https://www.tranzor.pt/auth/register" />
      </Helmet>

      <div className="rp-root">

        <aside className="rp-side" aria-hidden="true">
          <div className="rp-side-inner">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <img
                src="https://apcergroup.com/images/site/images/Newsroom/TRANZOR.png"
                alt="Tranzor"
                style={{ height: 36, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '3rem' }}
              />
            </Link>

            <span className="rp-eyebrow">{t('auth.joinTranzor')}</span>
            <h1 className="rp-title">
              {t('auth.registerHeroTitle')}<br />
              <span className="rp-title-accent">{t('auth.registerHeroTitleAccent')}</span><br />
              {t('auth.registerHeroTitleSuffix')}
            </h1>
            <p className="rp-sub">
              {t('auth.registerHeroBody')}
            </p>

            <ol className="rp-steps" aria-label="Como funciona">
              {[
                { num: '01', title: t('auth.registerStep1'), desc: t('auth.registerStep1Desc') },
                { num: '02', title: t('auth.registerStep2'), desc: t('auth.registerStep2Desc') },
                { num: '03', title: t('auth.registerStep3'), desc: t('auth.registerStep3Desc') },
              ].map(s => (
                <li key={s.num} className="rp-step">
                  <span className="rp-step-num" aria-hidden>{s.num}</span>
                  <div>
                    <div className="rp-step-title">{s.title}</div>
                    <div className="rp-step-desc">{s.desc}</div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rp-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden style={{ color: '#ff4d6b', flexShrink: 0 }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
              {t('auth.freeRegistration')} · Sem compromisso · Cancele quando quiser
            </div>
          </div>

          <div className="rp-deco" aria-hidden>
            <div className="rp-deco-1" />
            <div className="rp-deco-2" />
          </div>
        </aside>

        <main className="rp-main">
          <div className="rp-card">

            <div className="rp-logo-mobile">
              <Link to="/"><img src="https://apcergroup.com/images/site/images/Newsroom/TRANZOR.png" alt="Tranzor" style={{ height: 32, width: 'auto', objectFit: 'contain' }} /></Link>
            </div>

            <div className="rp-card-header">
              <p className="rp-card-eyebrow">— {t('auth.registerCardEyebrow')}</p>
              <h2 className="rp-card-title">{t('auth.registerCardTitle')}</h2>
              <p className="rp-card-sub">
                {t('auth.haveAccount')} {' '}
                <Link to="/auth/login" style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }} state={location.state}>{t('auth.haveAccountLink')}</Link>
              </p>
            </div>

            <RegisterForm showLogin={false} />

            <p className="rp-legal">
              {t('auth.registerLegalText')}{' '}
              <Link to="/terms"   style={{ color: 'var(--muted)', textDecoration: 'underline' }}>{t('auth.terms')}</Link>{' '}e a{' '}
              <Link to="/privacy" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>{t('auth.privacy')}</Link>.
              {t('auth.registerLegalNote')}
            </p>
          </div>
        </main>
      </div>

      <style>{`
        .rp-root {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }
        @media (max-width: 900px) { .rp-root { grid-template-columns: 1fr; } }
        .rp-side {
          background: linear-gradient(155deg, #080808 0%, #0f0005 55%, #0a0808 100%);
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          padding: 5rem 4rem;
        }
        @media (max-width: 900px) { .rp-side { display: none; } }
        .rp-side-inner { position: relative; z-index: 2; max-width: 440px; }
        .rp-eyebrow {
          display: block; font-family: var(--font-display); font-weight: 700;
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(255,77,107,0.85); margin-bottom: 1.25rem;
        }
        .rp-title {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(2rem, 3.2vw, 3rem);
          color: white; line-height: 1.1; letter-spacing: -1.5px;
          margin: 0 0 1.25rem;
        }
        .rp-title-accent { color: #ff4d6b; }
        .rp-sub {
          font-family: var(--font-display); font-size: 14px;
          color: rgba(255,255,255,0.5); line-height: 1.7; margin: 0 0 2.5rem;
        }
        .rp-steps { list-style: none; margin: 0 0 2.5rem; padding: 0; display: flex; flex-direction: column; gap: 20px; }
        .rp-step { display: flex; align-items: flex-start; gap: 16px; }
        .rp-step-num {
          font-family: var(--font-display); font-weight: 800; font-size: 11px;
          letter-spacing: 1px; color: #ff4d6b;
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,77,107,0.12); border: 1px solid rgba(255,77,107,0.2);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .rp-step-title {
          font-family: var(--font-display); font-weight: 700; font-size: 14px;
          color: rgba(255,255,255,0.85); margin-bottom: 3px;
        }
        .rp-step-desc {
          font-family: var(--font-display); font-size: 12px;
          color: rgba(255,255,255,0.4); line-height: 1.5;
        }
        .rp-badge {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-display); font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.35); letter-spacing: 0.3px;
        }
        .rp-deco { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .rp-deco-1 {
          position: absolute; top: -150px; right: -180px;
          width: 480px; height: 480px; border-radius: 50%;
          border: 1px solid rgba(255,77,107,0.07);
        }
        .rp-deco-2 {
          position: absolute; bottom: -80px; left: -80px;
          width: 300px; height: 300px; border-radius: 50%;
          border: 1px solid rgba(255,77,107,0.05);
        }
        .rp-main {
          background: var(--bg, #0a0a0a);
          display: flex; align-items: center; justify-content: center;
          padding: 4rem 2rem;
          overflow-y: auto;
        }
        .rp-card {
          width: 100%; max-width: 440px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .rp-logo-mobile { display: none; margin-bottom: 0.5rem; }
        @media (max-width: 900px) { .rp-logo-mobile { display: block; } }
        .rp-card-header { display: flex; flex-direction: column; gap: 4px; margin-bottom: 4px; }
        .rp-card-eyebrow {
          font-family: var(--font-display); font-weight: 700; font-size: 11px;
          letter-spacing: 2.5px; text-transform: uppercase; color: var(--red);
        }
        .rp-card-title {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(1.6rem, 3vw, 2.2rem); color: var(--text);
          letter-spacing: -0.5px; margin: 4px 0 0;
        }
        .rp-card-sub {
          font-family: var(--font-display); font-size: 13px;
          color: var(--muted); margin: 6px 0 0;
        }
        .rp-legal {
          font-family: var(--font-display); font-size: 11px;
          color: var(--muted); text-align: center; line-height: 1.7; margin: 0;
        }
      `}</style>
    </AppLayout>
  );
}