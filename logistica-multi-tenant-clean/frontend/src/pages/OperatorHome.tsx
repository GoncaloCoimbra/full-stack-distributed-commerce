import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Card, Badge, Alert } from '../components/common';

const OperatorHome: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <header className="bg-slate-900/90 px-6 py-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Tranzor Logistics" className="h-12 w-auto" />
          <h2 className="text-white font-bold text-lg">Área do operator</h2>
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
          O seu painel principal está em <a className="text-blue-400 underline" href="/dashboard">/dashboard</a>.
        </p>
      </main>
    </div>
  );
};

export default OperatorHome;
