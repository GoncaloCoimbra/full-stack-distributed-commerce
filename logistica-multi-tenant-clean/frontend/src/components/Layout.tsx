import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';  // ← ADD THIS IMPORT IF NEEDED
import Footer from './Footer';
import { theme } from '../theme.config';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={`${theme.backgrounds.page} flex flex-col`}>
      {/* Header */}
      <Header />

      {/* Main container with Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Conteúdo da página */}
        <main className="flex-1 md:ml-64 p-6">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;