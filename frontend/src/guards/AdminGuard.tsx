import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(state => state.user);
  const isLoading = useAuthStore(state => state.isLoading);
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: `${location.pathname}${location.search}` }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/401" replace />;
  }

  return <>{children}</>;
}
