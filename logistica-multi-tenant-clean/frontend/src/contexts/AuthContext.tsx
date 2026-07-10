import React, { createContext, useState, useContext, useEffect, useRef, ReactNode } from 'react';
import api from '../api/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR';
  companyId?: string | null;
  companyName?: string;
  avatarUrl?: string;
  isActive?: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'OPERATOR';
  companyId?: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (date: RegisterData) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
  updateUserData: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isOperator: boolean;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextData | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const hasLoadedRef = useRef(false);

  // normalize user object (strip wrappers)
  const normalizeUser = (maybeUser: any): User | null => {
    if (!maybeUser) return null;
    // if payload is { user: {...} }
    if (maybeUser.user && typeof maybeUser.user === 'object') return maybeUser.user as User;
    // if payload is { data: { user: {...} } }
    if (maybeUser.data && maybeUser.data.user) return maybeUser.data.user as User;
    // otherwise assume it's the user object
    return maybeUser as User;
  };

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedIsDemo = localStorage.getItem('isDemo') === 'true';

      console.log('🔄 AuthContext - Loading user...', {
        hasToken: !!token,
        hasStoredUser: !!storedUser,
        isDemo: storedIsDemo,
      });

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsDemo(storedIsDemo);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          console.log('✅ AuthContext - Stored user:', parsedUser);
          console.log('🏢 AuthContext - Stored companyId:', parsedUser?.companyId);

          const response = await api.get('/auth/me');

          console.log('🔎 AuthContext - /auth/me response.data:', response.data);

          const userFromServer = normalizeUser(response.data);

          if (!userFromServer) {
            throw new Error('Invalid format returned by /auth/me');
          }

          console.log('✅ AuthContext - User normalized:', userFromServer);
          console.log('🏢 AuthContext - CompanyId from server:', userFromServer?.companyId);
          console.log('👤 AuthContext - User role:', userFromServer?.role);

          if (!userFromServer.companyId && userFromServer.role !== 'SUPER_ADMIN') {
            console.error('⚠️⚠️⚠️ WARNING: User does not have companyId!');
            console.error('⚠️ This will prevent suppliers from appearing!');
            console.error('⚠️ Complete user:', JSON.stringify(userFromServer, null, 2));
          } else if (userFromServer.companyId) {
            console.log(`✅ CompanyId found: ${userFromServer.companyId}`);
          } else {
            console.log('ℹ️ User is SUPER_ADMIN, does not need companyId');
          }

          setUser(userFromServer);
          localStorage.setItem('user', JSON.stringify(userFromServer));
          console.log('✅ AuthContext - User validated:', {
            email: userFromServer.email,
            role: userFromServer.role,
            companyId: userFromServer.companyId,
          });
        } catch (error: any) {
          console.error('❌ AuthContext - Error loading user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          delete api.defaults.headers.common['Authorization'];
        }
      } else {
        console.log('⚠️ AuthContext - No token or user found');
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext - Login attempt:', email);
      console.log('🔗 API Base URL:', api.defaults.baseURL);
      console.log('📍 Calling endpoint:', api.defaults.baseURL + '/auth/login');

      const response = await api.post('/auth/login', { email, password });
      console.log('🔎 AuthContext - /auth/login response status:', response.status);
      console.log('🔎 AuthContext - /auth/login response.data:', response.data);

      const token =
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.access_token ||
        response.data?.data?.token ||
        null;

      const userData =
        response.data?.user ||
        response.data?.data?.user ||
        response.data?.userData ||
        (typeof response.data === 'object' ? response.data : null);

      const normalizedUser = normalizeUser(userData);

      if (!token || !normalizedUser) {
        console.error('❌ AuthContext - Formato inesperado do backend:', response.data);
        throw new Error('Resposta do servidor inválida: token ou user ausentes');
      }

      console.log('✅ AuthContext - User normalized from login:', normalizedUser);
      console.log('🔑 User logged in:', normalizedUser);
      console.log('🏢 User CompanyId:', normalizedUser?.companyId);
      console.log('👤 User role:', normalizedUser?.role);

      if (!normalizedUser.companyId && normalizedUser.role !== 'SUPER_ADMIN') {
        console.error('⚠️⚠️⚠️ PROBLEM DETECTED!');
        console.error('⚠️ User does not have companyId!');
        console.error('⚠️ Role:', normalizedUser.role);
        console.error('⚠️ This will cause 500 error when fetching suppliers!');
      } else if (normalizedUser.companyId) {
        console.log(`✅ CompanyId found: ${normalizedUser.companyId}`);
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(normalizedUser);

      console.log('✅ AuthContext - Login success:', {
        email: normalizedUser.email,
        role: normalizedUser.role,
        companyId: normalizedUser.companyId,
      });
    } catch (error: any) {
      console.error('❌ AuthContext - Login error:', error);
      console.error('❌ Error response status:', error.response?.status);
      console.error('❌ Error response date:', error.response?.data);

      let message = 'Login error. Please check your credentials.';

      if (error.response?.data) {
        const date = error.response.data;
        if (typeof date === 'string') {
          message = date;
        } else if (date.message) {
          message = date.message;
        } else if (date.error) {
          message = date.error;
        } else if (Array.isArray(date) && date[0]?.message) {
          message = date[0].message;
        }
      } else if (error.request) {
        message = 'Sem resposta do servidor. Verifique sua conexão.';
      } else if (error.message) {
        message = error.message;
      }

      throw new Error(message);
    }
  };

  const demoLogin = async () => {
    try {
      console.log('🎮 AuthContext - Demo login starting...');
      await login('demo@logistica.com', 'demo123');
      setIsDemo(true);
      localStorage.setItem('isDemo', 'true');
      console.log('✅ AuthContext - Demo mode activated');
    } catch (error: any) {
      console.error('❌ AuthContext - Demo login failed:', error);
      setIsDemo(false);
      localStorage.removeItem('isDemo');
      throw new Error('Failedto load demo account. Please try again.');
    }
  };

  const register = async (date: RegisterData) => {
    try {
      console.log('📝 AuthContext - Register attempt:', date.email);
      console.log('🔗 API Base URL:', api.defaults.baseURL);
      console.log('📍 Calling endpoint:', api.defaults.baseURL + '/auth/register');

      const response = await api.post('/auth/register', date);
      console.log('🔎 AuthContext - /auth/register response status:', response.status);
      console.log('🔎 AuthContext - /auth/register response.data:', response.data);

      const token =
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.access_token ||
        response.data?.data?.token ||
        null;

      const userData =
        response.data?.user ||
        response.data?.data?.user ||
        response.data?.userData ||
        (typeof response.data === 'object' ? response.data : null);

      const normalizedUser = normalizeUser(userData);

      if (!token || !normalizedUser) {
        console.error('❌ AuthContext - Formato inesperado do backend:', response.data);
        throw new Error('Resposta do servidor inválida: token ou user ausentes');
      }

      console.log('✅ AuthContext - User registered:', normalizedUser);
      console.log('🏢 User CompanyId:', normalizedUser?.companyId);
      console.log('👤 User role:', normalizedUser?.role);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(normalizedUser);

      console.log('✅ AuthContext - Register success:', {
        email: normalizedUser.email,
        role: normalizedUser.role,
        companyId: normalizedUser.companyId,
      });
    } catch (error: any) {
      console.error('❌ AuthContext - Register error:', error);
      console.error('❌ Error response status:', error.response?.status);
      console.error('❌ Error response date:', error.response?.data);

      let message = 'Registration error. Please try again.';

      if (error.response?.data) {
        const date = error.response.data;
        if (typeof date === 'string') {
          message = date;
        } else if (date.message) {
          message = date.message;
        } else if (date.error) {
          message = date.error;
        } else if (Array.isArray(date) && date[0]?.message) {
          message = date[0].message;
        }
      } else if (error.request) {
        message = 'Sem resposta do servidor. Verifique sua conexão.';
      } else if (error.message) {
        message = error.message;
      }

      throw new Error(message);
    }
  };

  const logout = () => {
    console.log('🚪 AuthContext - Logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isDemo');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsDemo(false);
    window.location.href = '/login';
  };

  const updateUserData = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isOperator = user?.role === 'OPERATOR';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateUserData,
        isAuthenticated: !!user,
        isSuperAdmin,
        isAdmin,
        isOperator,
        isDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};