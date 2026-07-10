import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme.config';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
  requireOperator?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireSuperAdmin = false,
  requireOperator = false,
}) => {
  const { user, loading, isAdmin, isSuperAdmin, isOperator } = useAuth();

  console.log(' PrivateRoute CHECK:', {
    hasUser: !!user,
    loading,
    requireAdmin,
    requireSuperAdmin,
    userRole: user?.role,
    userEmail: user?.email,
    isAdmin,
    isSuperAdmin
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.backgrounds.page}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log(' PrivateRoute - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  //  Check se requer Super Admin
  if (requireSuperAdmin && !isSuperAdmin) {
    console.warn('⚠️ PrivateRoute - Access negado: requer Super Admin');
    console.warn('⚠️ User role:', user.role);
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.backgrounds.page}`}>
        <div className={`text-center max-w-md p-8 ${theme.cards.form}`}>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-300 mb-2">
            You do not have permission to access this page. You must be a Super Administrator.
          </p>
          <p className="text-sm text-slate-400 mb-6">
            Your current role: <span className="font-bold">{user.role}</span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  //  Check se requer Admin (Admin ou Super Admin)
  if (requireAdmin && !isAdmin) {
    console.warn('⚠️ PrivateRoute - Access negado: requer Admin');
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.backgrounds.page}`}>
        <div className={`text-center max-w-md p-8 ${theme.cards.form}`}>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-300 mb-6">
            You do not have permission to access this page. You must be an Administrator.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  //  Check se requer Operator (Operator ou Admin)
  if (requireOperator && !(isOperator || isAdmin)) {
    console.warn('⚠️ PrivateRoute - Access negado: requer Operator ou Admin');
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.backgrounds.page}`}>
        <div className={`text-center max-w-md p-8 ${theme.cards.form}`}>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-300 mb-6">
            You do not have permission to access this page. You must be an Operator or Administrator.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  console.log(' PrivateRoute - Access granted');
  return <>{children}</>;
};

export default PrivateRoute;