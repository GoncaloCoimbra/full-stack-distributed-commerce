import React, { useState } from 'react';
import './UnifiedSidebar.css';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  active?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: '📊' },
  { label: 'Produtos', href: '/products', icon: '📦' },
  { label: 'Fornecedores', href: '/suppliers', icon: '🏢' },
  { label: 'Transportes', href: '/transports', icon: '🚚' },
  { label: 'Operações', href: '/operations', icon: '⚙️' },
  { label: 'Relatórios', href: '/reports', icon: '📈' },
  { label: 'Utilizadores', href: '/users', icon: '👥' },
  { label: 'Definições', href: '/settings', icon: '⚙️' },
];

const UnifiedSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`unified-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expandir' : 'Recolher'}
      >
        {collapsed ? '→' : '←'}
      </button>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="nav-item"
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default UnifiedSidebar;
