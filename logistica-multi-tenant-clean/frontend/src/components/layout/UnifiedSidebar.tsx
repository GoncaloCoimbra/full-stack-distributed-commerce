import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage, translateText, TRANSLATIONS } from '../../i18n';
import './UnifiedSidebar.css';

interface NavItem {
  labelKey: keyof typeof TRANSLATIONS;
  href: string;
  icon: JSX.Element;
}

const NAV_ITEMS: NavItem[] = [
  {
    labelKey: 'dashboardHeader',
    href: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    labelKey: 'headerProducts',
    href: '/products',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8l8-4 8 4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
        <path d="M4 8l8 4 8-4" />
        <path d="M12 12v8" />
      </svg>
    ),
  },
  {
    labelKey: 'headerSuppliers',
    href: '/suppliers',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21V8a1 1 0 011-1h16a1 1 0 011 1v13" />
        <path d="M4 8l8-4 8 4" />
        <path d="M8 14h2" />
        <path d="M14 14h2" />
        <path d="M8 18h2" />
        <path d="M14 18h2" />
      </svg>
    ),
  },
  {
    labelKey: 'headerVehicles',
    href: '/vehicles',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15h16v-3a3 3 0 00-3-3h-8a3 3 0 00-3 3v3z" />
        <path d="M5 15V11a2 2 0 012-2h10a2 2 0 012 2v4" />
        <circle cx="7.5" cy="18" r="1.5" />
        <circle cx="16.5" cy="18" r="1.5" />
      </svg>
    ),
  },
  {
    labelKey: 'headerTransports',
    href: '/transports',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 16h13v-5H3z" />
        <path d="M16 16h5l-3-5" />
        <path d="M6 16v3" />
        <circle cx="6" cy="20" r="2" />
        <circle cx="18" cy="20" r="2" />
      </svg>
    ),
  },
  {
    labelKey: 'headerTracking',
    href: '/tracking',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s6-4.5 6-10a6 6 0 10-12 0c0 5.5 6 10 6 10z" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    ),
  },
  {
    labelKey: 'headerTasks',
    href: '/tasks',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 7h8" />
        <path d="M8 12h5" />
        <path d="M8 17h6" />
        <rect x="3" y="4" width="18" height="16" rx="2" />
      </svg>
    ),
  },
  {
    labelKey: 'headerHistory',
    href: '/historico',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    ),
  },
];

const UnifiedSidebar: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: keyof typeof TRANSLATIONS) => translateText(TRANSLATIONS[key], language);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`unified-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? t('menuOpen') : t('menuClose')}
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {collapsed ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
        </svg>
      </button>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            title={t(item.labelKey)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default UnifiedSidebar;
