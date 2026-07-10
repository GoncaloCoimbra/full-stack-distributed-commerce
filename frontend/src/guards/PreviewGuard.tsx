import { useEffect, useRef } from 'react';
import { useAuthStore, User } from '@/store/authStore';

function getPreviewUser(role: 'user' | 'b2b' | 'admin'): User {
  const base = {
    id: `preview-${role}`,
    name: role === 'admin' ? 'Preview Admin' : role === 'b2b' ? 'Preview B2B' : 'Preview User',
    email: `preview+${role}@Tranzor.local`,
    role,
    emailVerified: true,
    profile: {
      company: role === 'b2b' ? 'Tranzor Preview B2B' : 'Tranzor Preview',
      taxId: role === 'b2b' ? 'PT000000000' : undefined,
      phone: '0000-0000',
      address: {
        street: 'Rua da Demonstração, 1',
        city: 'Lisboa',
        postalCode: '1000-001',
        country: 'Portugal'
      }
    }
  } as User;

  if (role === 'b2b') {
    base.b2bDiscountRate = 20;
  }
  if (role === 'user') {
    base.loyaltyPoints = 150;
  }

  return base;
}

export default function PreviewGuard({
  role,
  children
}: {
  role: 'user' | 'b2b' | 'admin';
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const originalUser = useRef<User | null>(null);

  useEffect(() => {
    originalUser.current = user;

    if (!user || user.role !== role) {
      setUser(getPreviewUser(role));
    }

    return () => {
      setUser(originalUser.current);
    };
  }, [role, setUser]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          background: '#fff5cc',
          color: '#333',
          borderBottom: '1px solid #ebd89f',
          padding: '0.75rem 1rem',
          fontSize: '0.95rem'
        }}
      >
        Modo de visualização sem login ativado para <strong>{role.toUpperCase()}</strong>. Algumas chamadas de API podem não devolver dados reais.
      </div>
      {children}
    </div>
  );
}