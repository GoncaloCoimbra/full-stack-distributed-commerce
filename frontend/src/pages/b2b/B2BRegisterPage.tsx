import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import RegisterForm from '../../components/auth/RegisterForm';

export default function B2BRegisterPage() {
  const navigate = useNavigate();

  return (
    <AppLayout bare>
      <Helmet>
        <title>Registar Empresa — Tranzor</title>
        <meta
          name="description"
          content="Registe a sua empresa para obter acesso B2B e condições empresariais exclusivas no portal Tranzor."
        />
        <link rel="canonical" href="https://www.Tranzor.pt/auth/b2b/register" />
      </Helmet>

      <div className="lp-root">
        <aside className="lp-side" aria-hidden="true">
          <div className="lp-side-inner">
            <span className="lp-side-eyebrow">Registo Empresarial</span>
            <h1 className="lp-side-title">Registo Empresarial</h1>
            <p className="lp-side-sub">
              Crie a sua conta empresarial com backend Java dedicado e utilizadores B2B separados do acesso de consumo.
            </p>
            <div className="lp-side-note">
              Esta secção é exclusiva para empresas que precisam de condições e acesso B2B dedicados.
            </div>
          </div>
        </aside>

        <main className="lp-main">
          <div className="lp-card lp-card--register">
            <div className="lp-card-header">
              <p className="lp-card-eyebrow">Registo B2B</p>
              <h2 className="lp-card-title">Criar conta empresarial</h2>
              <p className="lp-card-sub">
                Registe-se para aceder a preços corporativos, crédito empresarial e ferramentas B2B.
              </p>
            </div>

            <RegisterForm showLogin={false} buttonLabel="Criar conta empresarial" isB2B onSuccess={() => navigate('/b2b/dashboard')} />

            <p className="lp-legal">
              Já tem conta empresarial?{' '}
              <Link to="/auth/b2b/login" className="auth-switch-link">Entrar →</Link>
            </p>
          </div>
        </main>
      </div>

      <style>{`
        .lp-root {
          display: grid;
          grid-template-columns: minmax(300px, 1fr) minmax(360px, 1.1fr);
          min-height: 100vh;
          background: #faf7f5;
        }

        @media (max-width: 920px) {
          .lp-root { grid-template-columns: 1fr; }
          .lp-side { display: none; }
        }

        .lp-side {
          padding: 4rem 3rem;
          display: flex;
          align-items: center;
          background: #ffffff;
          color: #111111;
          position: relative;
          overflow: hidden;
        }

        .lp-side::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 80% 20%, rgba(212, 0, 26, 0.12), transparent 26%), radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.9), transparent 18%);
          pointer-events: none;
        }

        .lp-side-inner {
          position: relative;
          z-index: 1;
          max-width: 420px;
        }

        .lp-side-eyebrow {
          display: inline-flex;
          color: #d4001a;
          text-transform: uppercase;
          font-size: 0.82rem;
          letter-spacing: 0.24em;
          margin-bottom: 1.25rem;
          font-family: var(--font-display);
        }

        .lp-side-title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 4.5vw, 3.2rem);
          margin: 0 0 1.35rem;
          line-height: 1.02;
          color: #111111;
        }

        .lp-side-sub {
          color: #4e4e4e;
          line-height: 1.8;
          margin: 0 0 1.8rem;
        }

        .lp-side-note {
          padding: 1.25rem;
          border-radius: 20px;
          border: 1px solid rgba(212, 0, 26, 0.18);
          background: #fff4f4;
          color: #2a2a2a;
          line-height: 1.7;
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
          max-width: 520px;
          padding: 3rem;
          border-radius: 28px;
          background: #ffffff;
          border: 1px solid rgba(212, 0, 26, 0.12);
          box-shadow: 0 28px 60px rgba(0, 0, 0, 0.08);
        }

        .lp-card--register {
          border-color: rgba(212, 0, 26, 0.22);
        }

        .lp-card-header {
          display: grid;
          gap: 0.85rem;
          margin-bottom: 1.75rem;
        }

        .lp-card-eyebrow {
          color: #d4001a;
          font-family: var(--font-display);
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 0.82rem;
        }

        .lp-card-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 2.4rem);
          margin: 0;
          color: #111111;
        }

        .lp-card-sub {
          color: #4a4a4a;
          line-height: 1.7;
          margin: 0;
        }

        .lp-placeholder {
          display: grid;
          gap: 1.25rem;
          color: #4f4f4f;
        }

        .lp-placeholder p {
          margin: 0;
          line-height: 1.85;
        }

        .btn {
          width: fit-content;
          min-width: 200px;
        }
      `}</style>
    </AppLayout>
  );
}
