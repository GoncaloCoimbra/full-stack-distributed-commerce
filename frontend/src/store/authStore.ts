import { create } from 'zustand';
import { apiClient } from '../services/apiClient';


export interface User {
	id: string;
	name: string;
	email: string;
	role: 'user' | 'admin' | 'b2b' | 'b2b_buyer' | 'b2b_manager';
	emailVerified: boolean;
	loyaltyPoints?: number;
	b2bDiscountRate?: number;
	profile?: {
		company?: string;
		taxId?: string;
		phone?: string;
		address?: unknown;
	};
}

export interface AuthState {
	user: User | null;
	isLoading: boolean;
	error: string | null;

	login: (email: string, password: string) => Promise<void>;
	register: (
		name: string,
		email: string,
		password: string,
		role?: 'user' | 'admin' | 'b2b' | 'b2b_buyer' | 'b2b_manager',
		profile?: { company?: string; taxId?: string; phone?: string }
	) => Promise<void>;
	logout: () => Promise<void>;
	clearError: () => void;
	restoreSession: () => Promise<void>;
	setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isLoading: true,
	error: null,

	login: async (email: string, password: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.post<{ user: User }>('/auth/login', { email, password });

			if (!response.success || !response.data) {
				throw new Error(response.error?.message || 'Login falhou');
			}

			set({ user: response.data.user, isLoading: false });
		} catch (error: any) {
			const errorMessage = error.message || 'Erro ao fazer login';
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	register: async (
		name: string,
		email: string,
		password: string,
		confirmPassword: string,
		role: 'user' | 'admin' | 'b2b' | 'b2b_buyer' | 'b2b_manager' = 'user',
		profile?: { company?: string; taxId?: string; phone?: string }
	) => {
		set({ isLoading: true, error: null });
		try {
			const payload: Record<string, any> = { name, email, password, confirmPassword, role };
			if (profile) {
				payload.company = profile.company;
				payload.taxId = profile.taxId;
				payload.phone = profile.phone;
			}
			const response = await apiClient.post<{ user: User }>('/auth/register', payload);

			if (!response.success || !response.data) {
				throw new Error(response.error?.message || 'Registro falhou');
			}

			set({ user: response.data.user, isLoading: false });
		} catch (error: any) {
			const errorMessage = error.message || 'Erro ao registar';
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await apiClient.post('/auth/logout');
		} catch {
			// ignore logout failures; force local state reset
		} finally {
			set({ user: null, isLoading: false, error: null });
		}
	},

	clearError: () => set({ error: null }),

	// Restaurar sessão do backend com o cookie de autenticação
	restoreSession: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.get<{ user: User }>('/auth/me');
			if (response.success && response.data) {
				set({ user: response.data.user });
			} else {
				set({ user: null });
			}
		} catch {
			set({ user: null });
		} finally {
			set({ isLoading: false });
		}
	},

	setUser: (user) => set({ user }),
}));