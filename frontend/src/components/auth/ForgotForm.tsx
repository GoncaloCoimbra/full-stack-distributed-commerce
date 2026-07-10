import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthStyles } from './LoginForm';

/* ─────────────────────────────────────────
   PROPS
   ───────────────────────────────────────── */
interface ForgotFormProps {
  onSuccess?: (email: string) => void;
  compact?: boolean;
}

/* ─────────────────────────────────────────
   COMPONENTE
   ───────────────────────────────────────── */
export default function ForgotForm({ onSuccess, compact = false }: ForgotFormProps) {
  const [email,    setEmail]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [sent,     setSent]     = useState(false);
  const [sentTo,   setSentTo]   = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('auth.forgotInvalidEmail'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      // API call (simulado)
      await new Promise(res => setTimeout(res, 1400));
      setSentTo(email);
      setSent(true);
      if (onSuccess) onSuccess(email);
    } catch {
      setError(t('auth.forgotSendFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSent(false);
    setEmail('');
    setSentTo('');
  };

  /* ── Estado: email enviado ── */
  if (sent) {
    return (
      <>
        <div className="auth-success-box">
          <div className="auth-success-ring" aria-hidden>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>

          <div>
            <h3 className="auth-success-title">{t('auth.forgotSuccessTitle')}</h3>
            <p className="auth-success-text">
              {t('auth.forgotSuccessBody')}{' '}
              <strong style={{ color: 'var(--text)' }}>{sentTo}</strong>.
              {t('auth.forgotSuccessNote')}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <Link to="/auth/login" className="auth-btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10,17 15,12 10,7"/><line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              {t('auth.forgotBack')}
            </Link>
            <button onClick={handleReset} className="auth-btn-secondary">
              {t('auth.forgotResend')}
            </button>
          </div>

          <p style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
            {t('auth.forgotExpiry')} <strong style={{ color: 'var(--text)' }}>{t('auth.forgotMinutes')}</strong>.<br />
            Se continuar com problemas, <Link to="/contact" style={{ color: 'var(--red)', textDecoration: 'none' }}>{t('auth.supportLink')}</Link>.
          </p>
        </div>
        <AuthStyles />
      </>
    );
  }

  /* ── Estado: formulário ── */
  return (
    <>
      <form onSubmit={handleSubmit} className={`auth-form${compact ? ' auth-form--compact' : ''}`} noValidate>

        {/* Email */}
        <div className="auth-field">
          <label htmlFor="ff-email" className="auth-label">{t('auth.forgotEmailLabel')}</label>
          <div className="auth-input-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="auth-input-icon" aria-hidden>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <input
              id="ff-email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder={t('auth.emailPlaceholder')}
              required
              disabled={loading}
              autoComplete="email"
              className={`auth-input${error ? ' auth-input--error' : ''}`}
              aria-describedby={error ? 'ff-error' : undefined}
            />
          </div>
          {error && (
            <div id="ff-error" className="auth-error" role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Nota informativa */}
        <div className="ff-info-box" role="note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden style={{ color: 'var(--muted)', flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/>
          </svg>
          <span>
            {t('auth.forgotInfo')}
          </span>
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="auth-btn-primary"
          disabled={loading || !email.trim()}
        >
          {loading ? (
            <><span className="auth-spinner" aria-hidden /> {t('auth.signInLoading')}</>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              {t('auth.forgotSubmit')}
            </>
          )}
        </button>

        {/* Voltar */}
        <Link to="/auth/login" className="auth-btn-secondary">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/>
          </svg>
          {t('auth.forgotBack')}
        </Link>
      </form>

      <style>{`
        .ff-info-box {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border); border-radius: 10px;
          padding: 12px 14px;
          font-family: var(--font-display); font-size: 12.5px;
          color: var(--muted); line-height: 1.6;
        }
      `}</style>
      <AuthStyles />
    </>
  );
}