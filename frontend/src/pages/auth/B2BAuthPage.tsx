import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AppLayout from '../../layouts/AppLayout';

export default function B2BAuthPage() {
  return (
    <AppLayout bare>
      <Helmet>
        <title>Acesso Empresarial — Tranzor</title>
        <meta
          name="description"
          content="Aceda ao portal empresarial Tranzor: entre com a sua conta B2B ou crie uma conta de empresa separada da conta normal."
        />
        <link rel="canonical" href="https://www.Tranzor.pt/auth/b2b" />
      </Helmet>

      <div className="lp-root">
        <aside className="lp-side" aria-hidden="true">
          <div className="lp-side-inner">
            <Link to="/" className="logo-link">
              <img
                src="https://apcergroup.com/images/site/images/Newsroom/Tranzor.png"
                alt="Tranzor"
                className="lp-logo"
              />
            </Link>

            <div className="lp-side-tagline">
              <span className="lp-side-eyebrow">Portal Empresarial</span>
              <h1 className="lp-side-title">
                Condições B2B<br />sempre à mão.
              </h1>
              <p className="lp-side-sub">
                Entre como empresa ou registe uma conta B2B dedicada, separada do acesso de consumidor.
              </p>
            </div>

            <ul className="lp-perks" role="list">
              <li className="lp-perk">
                <strong>Pedido corporativo</strong>
                <span>Gestão de encomendas e faturação com visibilidade empresarial.</span>
              </li>
              <li className="lp-perk">
                <strong>Condições exclusivas</strong>
                <span>Preços, prazos e crédito negociados para a sua empresa.</span>
              </li>
              <li className="lp-perk">
                <strong>Suporte prioritário</strong>
                <span>Atendimento direto para clientes e parceiros corporativos.</span>
              </li>
            </ul>

            <div className="lp-side-since">Tranzor · Loja de exemplo · Portugal</div>
          </div>
        </aside>

        <main className="lp-main">
          <div className="lp-card lp-card--large">
            <div className="lp-card-header">
              <p className="lp-card-eyebrow">Acesso Empresarial</p>
              <h2 className="lp-card-title">Acesse o portal da sua empresa</h2>
              <p className="lp-card-sub">Entre com a sua conta B2B ou crie uma conta nova para formalizar o acesso empresarial.</p>
            </div>

            <div className="auth-actions">
              <Link to="/auth/b2b/login" className="btn btn-primary">
                Entrar como empresa
              </Link>
              <Link to="/auth/b2b/register" className="btn btn-secondary btn-outline-red">
                Criar conta empresarial
              </Link>
            </div>

            <div className="lp-note">
              <strong>Nota:</strong> o registo normal continua disponível apenas para clientes de consumo.
            </div>
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

        @media (max-width: 960px) {
          .lp-root { grid-template-columns: 1fr; }
          .lp-side { display: none; }
        }

        .lp-side {
          position: relative;
          overflow: hidden;
          padding: 4rem 3rem;
          background: #ffffff;
          color: #111111;
          display: flex;
          align-items: center;
        }

        .lp-side::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top left, rgba(212, 0, 26, 0.12), transparent 30%), radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.92), transparent 28%);
          pointer-events: none;
        }

        .lp-side-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
        }

        .logo-link {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          margin-bottom: 2.5rem;
        }

        .lp-logo {
          height: 42px;
          width: auto;
          object-fit: contain;
        }

        .lp-side-eyebrow {
          font-family: var(--font-display);
          font-size: 0.85rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #d4001a;
          margin-bottom: 1.25rem;
          display: inline-flex;
        }

        .lp-side-title {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 4vw, 3.5rem);
          line-height: 1.02;
          letter-spacing: -0.04em;
          margin: 0 0 1.5rem;
          max-width: 12ch;
          color: #111111;
        }

        .lp-side-sub {
          color: #4f4f4f;
          line-height: 1.85;
          margin: 0 0 2.5rem;
          max-width: 36rem;
        }

        .lp-perks {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1rem;
        }

        .lp-perk {
          display: grid;
          gap: 0.5rem;
          padding: 1rem;
          border: 1px solid rgba(212, 0, 26, 0.14);
          border-radius: 18px;
          background: #fff4f4;
        }

        .lp-perk strong {
          display: block;
          font-size: 0.98rem;
          color: #111111;
          margin-bottom: 0.35rem;
        }

        .lp-perk span {
          font-size: 0.96rem;
          color: #555555;
          line-height: 1.65;
        }

        .lp-side-since {
          margin-top: 2rem;
          color: #777777;
          font-size: 0.92rem;
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

        .lp-card--large {
          padding: 3.25rem;
        }

        .lp-card-header {
          margin-bottom: 2rem;
          display: grid;
          gap: 0.75rem;
        }

        .lp-card-eyebrow {
          color: #d4001a;
          font-family: var(--font-display);
          font-size: 0.9rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .lp-card-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 3vw, 2.4rem);
          line-height: 1.05;
          margin: 0;
          color: #111111;
        }

        .lp-card-sub {
          color: #5a5a5a;
          line-height: 1.8;
          margin: 0;
        }

        .auth-actions {
          display: grid;
          gap: 1rem;
        }

        .lp-note {
          margin-top: 1.75rem;
          color: #555555;
          font-size: 0.95rem;
          line-height: 1.8;
        }

        .btn {
          width: 100%;
        }

        .btn-outline-red {
          color: #d4001a;
          border-color: #d4001a;
          background: rgba(212, 0, 26, 0.05);
        }

        .btn-outline-red:hover {
          color: #a10016;
          background: rgba(212, 0, 26, 0.12);
        }
      `}</style>
    </AppLayout>
  );
}
