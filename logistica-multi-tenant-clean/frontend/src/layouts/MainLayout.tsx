import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';

const MainLayout: React.FC = () => {
  const { isSuperAdmin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#07090f]">
      <Header />
      
      <div className="flex flex-1">
        {!isSuperAdmin && <Sidebar />}
        
        {/* Main content with dynamic margin and bottom padding for mobile footer */}
        <div className="flex-1 flex flex-col transition-all duration-300">
          <main className="flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8">
            <Outlet />
          </main>
          
          {/* Footer within the content container */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;