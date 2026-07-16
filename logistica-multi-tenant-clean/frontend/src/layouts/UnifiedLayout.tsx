import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedHeader from '../components/layout/UnifiedHeader';
import UnifiedSidebar from '../components/layout/UnifiedSidebar';
import UnifiedFooter from '../components/layout/UnifiedFooter';
import '../styles/unified-system.css';

interface UnifiedLayoutProps {
  showSidebar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  variant?: 'admin' | 'public';
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
  showSidebar = true,
  showHeader = true,
  showFooter = true,
  variant = 'admin',
}) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="unified-layout">
      {showHeader && (
        <UnifiedHeader 
          variant={variant}
          darkMode={darkMode}
          onThemeToggle={() => setDarkMode(!darkMode)}
        />
      )}
      
      <div className="layout-wrapper">
        {showSidebar && <UnifiedSidebar />}
        
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
      
      {showFooter && <UnifiedFooter />}
    </div>
  );
};

export default UnifiedLayout;
