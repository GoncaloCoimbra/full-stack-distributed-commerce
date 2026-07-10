import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DemoBadge: React.FC = () => {
  const { isDemo } = useAuth();

  if (!isDemo) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse"
      style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
      }}
    >
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-2a4 4 0 00-8 0v2h8z" />
      </svg>
      <span className="text-sm font-semibold text-white">DEMO MODE</span>
      <span className="ml-2 text-xs text-white/80">Read-only access</span>
    </div>
  );
};

export default DemoBadge;
