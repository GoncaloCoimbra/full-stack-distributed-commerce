import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const isB2BRole = (role?: string | null) => role === 'b2b' || role === 'b2b_buyer' || role === 'b2b_manager';

export default function B2BGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(state => state.user);
  const isLoading = useAuthStore(state => state.isLoading);
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/auth/b2b/login" state={{ from: location.pathname }} replace />;
  }

  if (!isB2BRole(user.role)) {
    return <Navigate to="/auth/b2b" replace />;
  }

  return <>{children}</>;
}
