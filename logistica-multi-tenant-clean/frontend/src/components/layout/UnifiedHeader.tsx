import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import { useLanguage } from '../../i18n';
import './UnifiedHeader.css';

interface UnifiedHeaderProps {
  variant?: 'admin' | 'public';
  onThemeToggle?: () => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ variant = 'admin', onThemeToggle }) => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const { language, setLanguage } = useLanguage();

  return (
    <header className="unified-header">
      <div className="header-content">
        {/* Logo */}
        <div className="header-logo">
          <h1>🚚 Logística</h1>
        </div>

        {/* Nav Center */}
        {variant === 'admin' && (
          <nav className="header-nav">
            <a href="/" className="nav-link">Dashboard</a>
            <a href="/products" className="nav-link">Produtos</a>
            <a href="/transports" className="nav-link">Transportes</a>
            <a href="/suppliers" className="nav-link">Fornecedores</a>
          </nav>
        )}

        {/* Right Section */}
        <div className="header-actions">
          <div className="language-switcher" style={{ display: 'flex', gap: 6, marginRight: 8 }}>
            {(['pt','en','es'] as const).map((lang) => (
              <button
                key={lang}
                className="header-btn"
                style={{ padding: '0.35rem 0.6rem', fontSize: 12, borderRadius: 999, background: language === lang ? '#f59e0b' : 'transparent', color: language === lang ? '#111827' : 'inherit' }}
                onClick={() => setLanguage(lang)}
                title={lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : 'Español'}
              >
                {lang === 'pt' ? 'PT' : lang === 'en' ? 'EN' : 'ES'}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button className="header-btn theme-toggle" onClick={onThemeToggle} title="Alternar tema">
            🌙
          </button>

          {/* User Menu */}
          <div className="header-user">
            {user && <span className="user-name">{user.name || user.email}</span>}
            <button
              className="header-btn user-menu-btn"
              onClick={() => setShowMenu(!showMenu)}
              title="Menu do utilizador"
            >
              👤
            </button>

            {showMenu && (
              <div className="user-dropdown">
                <a href="/profile" className="dropdown-item">Perfil</a>
                <a href="/settings" className="dropdown-item">Definições</a>
                <hr className="dropdown-divider" />
                <button
                  className="dropdown-item logout-btn"
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;
