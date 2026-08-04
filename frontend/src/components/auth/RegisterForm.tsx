import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { AuthStyles } from './LoginForm';

/* ─────────────────────────────────────────
   FORÇA DA PASSWORD
   ───────────────────────────────────────── */
interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  checks: { label: string; ok: boolean }[];
}

function getPasswordStrength(pw: string, t: (key: string) => string): PasswordStrength {
  const checks = [
    { label: t('auth.passwordStrength.minLength'), ok: pw.length >= 8 },
    { label: t('auth.passwordStrength.uppercase'), ok: /[A-Z]/.test(pw) },
    { label: t('auth.passwordStrength.lowercase'), ok: /[a-z]/.test(pw) },
    { label: t('auth.passwordStrength.numberOrSymbol'), ok: /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw) },
  ];
  const score = checks.filter(c => c.ok).length as 0 | 1 | 2 | 3 | 4;
  const labels = ['', t('auth.passwordStrength.weak'), t('auth.passwordStrength.fair'), t('auth.passwordStrength.good'), t('auth.passwordStrength.excellent')];
  return { score, label: labels[score], checks };
}

function PasswordStrengthMeter({ password, t }: { password: string; t: (key: string) => string }) {
  const { score, label, checks } = useMemo(() => getPasswordStrength(password, t), [password, t]);
  if (!password) return null;
  const segClass = ['', 's1', 's2', 's3', 's4'][score];

  return (
    <div className="auth-strength">
      <div className="auth-strength-bar" aria-hidden>
        {[1,2,3,4].map(i => (
          <div
            key={i}
            className={`auth-strength-seg${i <= score ? ` auth-strength-seg--active ${segClass}` : ''}`}
          />
        ))}
      </div>
      <div className="auth-strength-label" aria-live="polite">{label}</div>
      <ul className="auth-check-list" aria-label={t('auth.password')}>
        {checks.map(c => (
          <li key={c.label} className={`auth-check-item${c.ok ? ' auth-check-item--ok' : ''}`}>
            <span className="auth-check-dot" aria-hidden />
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────
   PROPS
   ───────────────────────────────────────── */
interface RegisterFormProps {
  onSuccess?: () => void;
  showLogin?: boolean;
  compact?: boolean;
  buttonLabel?: string;
  isB2B?: boolean;
}

/* ─────────────────────────────────────────
   COMPONENTE
   ───────────────────────────────────────── */
export default function RegisterForm({
  onSuccess,
  showLogin = true,
  compact = false,
  buttonLabel,
  isB2B = false,
}: RegisterFormProps) {
  const [name,            setName]            = useState('');
  const [company,         setCompany]         = useState('');
  const [taxId,           setTaxId]           = useState('');
  const [phone,           setPhone]           = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [agreed,          setAgreed]          = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const [fieldErrors,     setFieldErrors]     = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const register = useAuthStore(state => state.register);
  const from = (location.state as { from?: string })?.from ?? '/';

  /* Validação cliente */
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2)
      errs.name = isB2B ? t('auth.validation.contactNameRequired') : t('auth.validation.nameMinLength');
    if (isB2B && (!company.trim() || company.trim().length < 2))
      errs.company = t('auth.validation.companyRequired');
    if (isB2B && !/^[0-9]{9}$/.test(taxId))
      errs.taxId = t('auth.validation.taxIdInvalid');
    if (isB2B && phone.trim() && !/^[+0-9 ]{6,20}$/.test(phone))
      errs.phone = t('auth.validation.phoneInvalid');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = t('auth.validation.emailInvalid');
    if (getPasswordStrength(password, t).score < 2)
      errs.password = t('auth.validation.passwordWeak');
    if (password !== confirmPassword)
      errs.confirmPassword = t('auth.validation.passwordsMismatch');
    if (!agreed)
      errs.agreed = t('auth.validation.termsRequired');
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setError('');
    setLoading(true);
    try {
      await register(
        name.trim(),
        email,
        password,
        confirmPassword,
        isB2B ? 'b2b' : 'user',
        isB2B ? {
          company: company.trim() || undefined,
          taxId: taxId.trim() || undefined,
          phone: phone.trim() || undefined
        } : undefined
      );
      if (onSuccess) onSuccess();
      else navigate('/account/profile', { replace: true });
    } catch (err: any) {
      setError(err.message || t('auth.validation.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const IconEye = ({ open }: { open: boolean }) => open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <>
      <form onSubmit={handleSubmit} className={`auth-form${compact ? ' auth-form--compact' : ''}`} noValidate>

        {/* Nome */}
        <div className="auth-field">
          <label htmlFor="rf-name" className="auth-label">
            {isB2B ? t('auth.contactPerson') : t('auth.fullName')}
          </label>
          <div className="auth-input-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="auth-input-icon" aria-hidden>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <input
              id="rf-name"
              name="name"
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setFieldErrors(p => ({ ...p, name: '' })); }}
              placeholder={isB2B ? t('auth.contactPersonPlaceholder') : t('auth.fullNamePlaceholder')}
              required
              disabled={loading}
              autoComplete="name"
              className={`auth-input${fieldErrors.name ? ' auth-input--error' : ''}`}
            />
          </div>
          {fieldErrors.name && <p className="auth-field-err" role="alert">{fieldErrors.name}</p>}
        </div>

        {isB2B && (
          <>
            <div className="auth-field">
              <label htmlFor="rf-company" className="auth-label">{t('auth.companyName')}</label>
              <div className="auth-input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="auth-input-icon" aria-hidden>
                  <path d="M3 12h18M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/>
                </svg>
                <input
                  id="rf-company"
                  type="text"
                  value={company}
                  onChange={e => { setCompany(e.target.value); setFieldErrors(p => ({ ...p, company: '' })); }}
                  placeholder={t('auth.companyPlaceholder')}
                  required
                  disabled={loading}
                  autoComplete="organization"
                  className={`auth-input${fieldErrors.company ? ' auth-input--error' : ''}`}
                />
              </div>
              {fieldErrors.company && <p className="auth-field-err" role="alert">{fieldErrors.company}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="rf-tax" className="auth-label">{t('auth.companyTaxId')}</label>
              <div className="auth-input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="auth-input-icon" aria-hidden>
                  <path d="M4 7h16M6 7v10M18 7v10M7 17h10"/>
                </svg>
                <input
                  id="rf-tax"
                  type="text"
                  value={taxId}
                  onChange={e => { setTaxId(e.target.value); setFieldErrors(p => ({ ...p, taxId: '' })); }}
                  placeholder={t('auth.companyTaxPlaceholder')}
                  required
                  disabled={loading}
                  autoComplete="off"
                  className={`auth-input${fieldErrors.taxId ? ' auth-input--error' : ''}`}
                />
              </div>
              {fieldErrors.taxId && <p className="auth-field-err" role="alert">{fieldErrors.taxId}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="rf-phone" className="auth-label">{t('auth.contactPhone')}</label>
              <div className="auth-input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="auth-input-icon" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12 1.03.32 2.04.61 3.02a2 2 0 0 1-.45 2.11L9.91 11.91a16 16 0 0 0 6.18 6.18l1.06-1.06a2 2 0 0 1 2.11-.45c.98.29 1.99.49 3.02.61A2 2 0 0 1 22 16.92z"/>
                </svg>
                <input
                  id="rf-phone"
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setFieldErrors(p => ({ ...p, phone: '' })); }}
                  placeholder={t('auth.contactPhonePlaceholder')}
                  disabled={loading}
                  autoComplete="tel"
                  className={`auth-input${fieldErrors.phone ? ' auth-input--error' : ''}`}
                />
              </div>
              {fieldErrors.phone && <p className="auth-field-err" role="alert">{fieldErrors.phone}</p>}
            </div>
          </>
        )}

        {/* Email */}
        <div className="auth-field">
          <label htmlFor="rf-email" className="auth-label">{t('auth.email')}</label>
          <div className="auth-input-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="auth-input-icon" aria-hidden>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <input
              id="rf-email"
              name="email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: '' })); }}
              placeholder={t('auth.emailPlaceholder')}
              required
              disabled={loading}
              autoComplete="email"
              className={`auth-input${fieldErrors.email ? ' auth-input--error' : ''}`}
            />
          </div>
          {fieldErrors.email && <p className="auth-field-err" role="alert">{fieldErrors.email}</p>}
        </div>

        {/* Password */}
        <div className="auth-field">
          <label htmlFor="rf-password" className="auth-label">{t('auth.password')}</label>
          <div className="auth-input-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="auth-input-icon" aria-hidden>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input
              id="rf-password"
              name="password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })); }}
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete="new-password"
              className={`auth-input auth-input--pass${fieldErrors.password ? ' auth-input--error' : ''}`}
            />
            <button type="button" onClick={() => setShowPass(v => !v)} className="auth-eye-btn" aria-label={showPass ? t('auth.hidePassword') : t('auth.showPassword')} tabIndex={-1}>
              <IconEye open={showPass} />
            </button>
          </div>
          {fieldErrors.password && <p className="auth-field-err" role="alert">{fieldErrors.password}</p>}
          <PasswordStrengthMeter password={password} t={t} />
        </div>

        {/* Confirmar password */}
        <div className="auth-field">
          <label htmlFor="rf-confirm" className="auth-label">{t('auth.confirmPassword')}</label>
          <div className="auth-input-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="auth-input-icon" aria-hidden>
              <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
            </svg>
            <input
              id="rf-confirm"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); setFieldErrors(p => ({ ...p, confirmPassword: '' })); }}
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete="new-password"
              className={`auth-input auth-input--pass${fieldErrors.confirmPassword ? ' auth-input--error' : ''}`}
            />
            <button type="button" onClick={() => setShowConfirm(v => !v)} className="auth-eye-btn" aria-label={showConfirm ? t('auth.hidePassword') : t('auth.showPassword')} tabIndex={-1}>
              <IconEye open={showConfirm} />
            </button>
          </div>
          {fieldErrors.confirmPassword && <p className="auth-field-err" role="alert">{fieldErrors.confirmPassword}</p>}
        </div>

        {/* Checkbox termos */}
        <div className="auth-field">
          <label className="auth-checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => { setAgreed(e.target.checked); setFieldErrors(p => ({ ...p, agreed: '' })); }}
              disabled={loading}
              className="auth-checkbox"
            />
            <span>
              {t('auth.terms')} {' '}
              <Link to="/terms" target="_blank" style={{ color: 'var(--red)', textDecoration: 'underline' }}>{t('auth.terms')}</Link>
              {' '}e a{' '}
              <Link to="/privacy" target="_blank" style={{ color: 'var(--red)', textDecoration: 'underline' }}>{t('auth.privacy')}</Link>.
            </span>
          </label>
          {fieldErrors.agreed && <p className="auth-field-err" role="alert">{fieldErrors.agreed}</p>}
        </div>

        {/* Erro global */}
        {error && (
          <div className="auth-error" role="alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Botão */}
        <button
          type="submit"
          className="auth-btn-primary"
          disabled={loading || !name.trim() || !email.trim() || !password || !confirmPassword || !agreed}
        >
          {loading ? <span className="auth-spinner" aria-hidden /> : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          )}
          {loading ? t('auth.createAccountLoading') : buttonLabel ?? t('auth.createAccountButton')}
        </button>
      </form>

      {showLogin && (
        <p className="auth-switch">
          {t('auth.haveAccount')}{' '}
          <Link to="/auth/login" className="auth-switch-link">{t('auth.haveAccountLink')}</Link>
        </p>
      )}

      <style>{`
        .auth-field-err {
          font-family: var(--font-display); font-size: 12px;
          color: var(--red); margin: 0; padding-left: 2px;
        }
        .auth-checkbox-label {
          display: flex; align-items: flex-start; gap: 10px; cursor: pointer;
          font-family: var(--font-display); font-size: 13px;
          color: var(--muted-light); line-height: 1.5;
        }
        .auth-checkbox {
          width: 16px; height: 16px; accent-color: var(--red);
          cursor: pointer; flex-shrink: 0; margin-top: 2px;
        }
      `}</style>
      <AuthStyles />
    </>
  );
}