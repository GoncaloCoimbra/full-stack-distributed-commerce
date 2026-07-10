import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';
import api from '../api/api';
import { Button, Input, Card, Badge, Alert } from '../components/common';

interface GlobalStats {
  totalCompanies: number;
  totalUsers: number;
  totalProducts: number;
  totalSuppliers: number;
  totalVehicles: number;
  topCompanies: Array<{
    id: string;
    name: string;
    _count: {
      users: number;
      products: number;
      suppliers: number;
    };
  }>;
}

const SuperAdminHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<GlobalStats>({
    totalCompanies: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalSuppliers: 0,
    totalVehicles: 0,
    topCompanies: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/superadmin/stats');
      setStats(response.data);
    } catch (error: any) {
      console.error('Error loading statistics:', error);
      
      let errorMessage = '';
      
      if (error.response?.status === 404) {
        errorMessage = 'Statistics route not found in backend. Please implement the /superadmin/stats endpoint';
      } else if (error.response?.data?.message && typeof error.response.data.message === 'string') {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error && typeof error.response.data.error === 'string') {
        errorMessage = error.response.data.error;
      } else if (error.message && typeof error.message === 'string') {
        errorMessage = error.message;
      } else {
        errorMessage = 'Error loading system statistics';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.backgrounds.page}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-300 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with logo and profile - Dark theme */}
      <header className={`${theme.backgrounds.header} px-6 py-4 flex items-center justify-between border-b border-slate-700`}>
        {/* Logo */}
        <div className="flex items-center space-x-3 group">
          <div className="relative">
            <img 
              src="/logo.png"
              alt="Tranzor Logistics" 
              className="h-20 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* Profile Icon with Logout */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300">
            {user?.name || 'Super Administrator'}
          </span>
          <div className="relative group">
            <button className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold hover:from-amber-600 hover:to-amber-700 transition-all">
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 border border-slate-700">
              <button
                onClick={() => navigate('/superadmin/profile')}
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - SuperAdmin Dashboard with dark theme */}
      <main className={`flex-1 ${theme.backgrounds.page}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Show error as warning, do not block dashboard */}
          {error && (
            <div className="mb-6 bg-amber-900/30 border border-amber-500/50 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-amber-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-amber-400">System Warning</h3>
                  <p className="mt-1 text-sm text-amber-300">{error}</p>
                  <button
                    onClick={loadStats}
                    className="mt-3 text-sm text-amber-400 hover:text-amber-300 font-medium underline"
                  >
                    Try loading again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Total Companies */}
            <div className={theme.cards.stat}>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-3 shadow-lg text-purple-400 border border-purple-500/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{stats.totalCompanies}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-400">Total Companies</p>
            </div>

            {/* Total Users */}
            <div className={theme.cards.stat}>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-3 shadow-lg text-blue-400 border border-blue-500/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-400">Total Users</p>
            </div>

            {/* Total Products */}
            <div className={theme.cards.stat}>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl p-3 shadow-lg text-emerald-400 border border-emerald-500/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-400">Total Products</p>
            </div>

            {/* Total Suppliers */}
            <div className={theme.cards.stat}>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-3 shadow-lg text-orange-400 border border-orange-500/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{stats.totalSuppliers}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-400">Total Suppliers</p>
            </div>

            {/* Total Vehicles */}
            <div className={theme.cards.stat}>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-xl p-3 shadow-lg text-indigo-400 border border-indigo-500/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{stats.totalVehicles}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-400">Total Vehicles</p>
            </div>
          </div>

          {/* Top 5 Companies */}
          <div className={`${theme.cards.base} mb-8`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Top 5 Companies</h3>
              <button
                onClick={() => navigate('/empresas')}
                className="text-sm text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {stats.topCompanies.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-slate-400 font-medium mb-2">
                  {error ? 'Could not load companies' : 'No companies registered'}
                </p>
                <button
                  onClick={() => navigate('/empresas')}
                  className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Add company →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.topCompanies.map((company, index) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-800/30 rounded-lg transition-colors cursor-pointer border border-slate-700/50"
                    onClick={() => navigate('/empresas')}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full border border-purple-500/30">
                        <span className="text-purple-400 font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{company.name}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-slate-400">
                            👥 {company._count.users} users
                          </span>
                          <span className="text-xs text-slate-400">
                            📦 {company._count.products} products
                          </span>
                          <span className="text-xs text-slate-400">
                            🏢 {company._count.suppliers} suppliers
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-900/30 text-purple-400 border border-purple-500/30">
                        {company._count.products} products
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Company Management */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-xl border border-blue-500/30 p-6 hover:border-blue-400/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Company Management</h3>
                  <p className="text-blue-300 text-sm">
                    Create, edit, and manage all companies in the system
                  </p>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => navigate('/empresas')}
                className={`${theme.buttons.primary} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 w-full`}
              >
                Access Management →
              </button>
            </div>

            {/* User Management */}
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-xl border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">User Management</h3>
                  <p className="text-purple-300 text-sm">
                    Manage users from all companies in the system
                  </p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => navigate('/users')}
                className={`${theme.buttons.primary} bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 w-full`}
              >
                Access Management →
              </button>
            </div>
          </div>

          {/* Footer Status */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>System running</span>
              </div>
              <div>
                <span>Last update: {new Date().toLocaleDateString('en-US')}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with dark theme */}
      <div className={`${theme.backgrounds.header} border-t border-slate-700`}>
        <Footer />
      </div>
    </div>
  );
};

export default SuperAdminHome;