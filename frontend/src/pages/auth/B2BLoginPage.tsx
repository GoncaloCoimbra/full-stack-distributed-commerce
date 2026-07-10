import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AppLayout from '../../layouts/AppLayout';
import LoginForm from '../../components/auth/LoginForm';

export default function B2BLoginPage() {
  const navigate = useNavigate();

  return (
    <AppLayout bare>
      <Helmet>
        <title>Entrar como Empresa — Tranzor</title>
        <meta
          name="description"
          content="Faça login com a sua conta empresarial Tranzor para aceder a condições B2B, preços empresariais e gestão de pedidos."
        />
        <link rel="canonical" href="https://www.Tranzor.pt/auth/b2b/login" />
      </Helmet>

      <div className="lp-root">
        <aside className="lp-side" aria-hidden="true">
          <div className="lp-side-inner">
            <div className="lp-side-eyebrow">B2B</div>
            <h1 className="lp-side-title">
              Login empresarial
            </h1>
            <p className="lp-side-sub">
              Aceda ao portal B2B para gerir encomendas, crédito e faturas da sua empresa com toda a segurança.
            </p>
            <div className="lp-side-highlight">
              <span>Conta empresarial</span>
              <strong>Faça login com a sua credencial de parceiro.</strong>
            </div>
            <div className="lp-side-since">Tranzor · Soluções B2B</div>
          </div>
        </aside>

        <main className="lp-main">
          <div className="lp-card lp-card--small">
            <div className="lp-card-header">
              <p className="lp-card-eyebrow">Acesso empresarial</p>
              <h2 className="lp-card-title">Entrar como empresa</h2>
              <p className="lp-card-sub">Use o login B2B para aceder aos seus preços, encomendas e histórico corporativo.</p>
            </div>

            <LoginForm showRegister={false} onSuccess={() => navigate('/b2b/dashboard')} />

            <p className="lp-legal">
              Ainda não tem conta empresarial?{' '}
              <Link to="/auth/b2b/register" className="auth-switch-link">
                Criar conta B2B
              </Link>
              .
            </p>
          </div>
        </main>
      </div>

      <style>{`
        .lp-root {
          display: grid;
          grid-template-columns: minmax(300px, 1fr) minmax(380px, 1fr);
          min-height: 100vh;
          background: #faf7f5;
        }

        @media (max-width: 920px) {
          .lp-root { grid-template-columns: 1fr; }
          .lp-side { display: none; }
        }

        .lp-side {
          display: flex;
          align-items: center;
          padding: 4rem 3rem;
          background: #ffffff;
          color: #111111;
          position: relative;
          overflow: hidden;
        }

        .lp-side::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(212, 0, 26, 0.12), transparent 28%), radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.9), transparent 18%);
          pointer-events: none;
        }

        .lp-side-inner {
          position: relative;
          z-index: 1;
          max-width: 380px;
        }

        .lp-side-eyebrow {
          font-family: var(--font-display);
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-size: 0.78rem;
          color: #d4001a;
          margin-bottom: 1.5rem;
          display: inline-flex;
        }

        .lp-side-title {
          font-family: var(--font-display);
          font-size: clamp(2.6rem, 5vw, 3.4rem);
          line-height: 1.03;
          margin: 0 0 1.5rem;
          max-width: 14ch;
          color: #111111;
        }

        .lp-side-sub {
          font-size: 1rem;
          line-height: 1.85;
          color: #4f4f4f;
          margin: 0 0 2rem;
        }

        .lp-side-highlight {
          display: grid;
          gap: 0.4rem;
          padding: 1.25rem 1.25rem 1.35rem;
          border-radius: 24px;
          border: 1px solid rgba(212, 0, 26, 0.14);
          background: #fff4f4;
          color: #111111;
          margin-bottom: 2rem;
        }

        .lp-side-highlight strong {
          display: block;
          font-size: 1rem;
          color: #111111;
        }

        .lp-side-since {
          font-size: 0.92rem;
          color: #777777;
        }

        .lp-main {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          background: #faf7f5;
        }

        .lp-card {
          width: 100%;
          max-width: 460px;
          padding: 2.8rem;
          border-radius: 28px;
          background: #ffffff;
          border: 1px solid rgba(212, 0, 26, 0.12);
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.12);
        }

        .lp-card--small {
          padding: 2.4rem;
        }

        .lp-card-header {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }

        .lp-card-eyebrow {
          color: #d4001a;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 0.78rem;
          font-family: var(--font-display);
        }

        .lp-card-title {
          font-family: var(--font-display);
          color: #111111;
          font-size: clamp(1.9rem, 3.8vw, 2.4rem);
          margin: 0;
        }

        .lp-card-sub {
          color: #5a5a5a;
          line-height: 1.75;
          margin: 0;
        }

        .lp-legal {
          margin-top: 1.5rem;
          color: #5a5a5a;
          font-size: 0.95rem;
          line-height: 1.8;
        }

        .auth-switch-link {
          color: #d4001a;
          text-decoration: underline;
        }

        .auth-switch-link:hover {
          opacity: 0.8;
        }
      `}</style>
    </AppLayout>
  );
}
