import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleRedirect: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'SUPER_ADMIN':
      return <Navigate to="/superadmin-home" replace />;
    case 'ADMIN':
      return <Navigate to="/admin-home" replace />;
    case 'OPERATOR':
      return <Navigate to="/operator-home" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

export default RoleRedirect;
