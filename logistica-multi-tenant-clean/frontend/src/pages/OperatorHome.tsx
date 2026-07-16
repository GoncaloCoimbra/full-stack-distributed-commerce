import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Card, Badge, Alert } from '../components/common';
import { SITE_FULL_NAME } from '../site.config';

const OperatorHome: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <header className="bg-slate-900/90 px-6 py-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg" />
          <div>
            <h2 className="text-white font-bold text-lg">{SITE_FULL_NAME}</h2>
            <p className="text-slate-400 text-sm">Área do operator</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300">{user?.name || 'operator'}</span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8"> 
        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome, {user?.name || 'Operator'}!
        </h1>
        <p className="text-slate-300">
          O seu painel principal está em <a className="text-red-400 underline" href="/dashboard">/dashboard</a>.
        </p>
      </main>
    </div>
  );
};

export default OperatorHome;

