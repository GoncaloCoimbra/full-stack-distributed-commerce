/// <reference types="vite/client" />
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

interface ApiError {
	message: string;
	statusCode: number;
	errors?: Record<string, string[]>;
}

interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: ApiError;
}

const demoAddress = {
	street: 'Rua da Demonstração, 1',
	city: 'Lisboa',
	postalCode: '1000-001',
	country: 'Portugal',
};

const demoUser = {
	id: 'preview-user',
	name: 'Preview User',
	email: 'preview+user@Tranzor.local',
	role: 'user' as const,
	emailVerified: true,
	profile: {
		company: 'Tranzor Preview',
		taxId: 'PT000000000',
		phone: '0000-0000',
		address: demoAddress,
		isStudent: false,
	},
	loyaltyPoints: 150,
	clientCard: {
		id: 'preview-card-001',
		createdAt: '2025-01-01T00:00:00.000Z',
	},
};

const demoOrders = [
	{
		_id: 'ord_preview_001',
		orderNumber: 'OLM-2026-001',
		status: 'confirmed',
		paymentStatus: 'paid',
		paymentMethod: 'Multibanco',
		shippingMethod: 'Padrão',
		shippingAddress: demoAddress,
		billingAddress: demoAddress,
		subtotal: 43.9,
		shipping: 3.99,
		tax: 9.86,
		discount: 0,
		total: 57.75,
		createdAt: '2026-05-15T10:30:00.000Z',
		items: [
			{ name: 'Caderno A4 80 folhas', sku: 'CADERNO-A4', quantity: 2, price: 12.4, total: 24.8, product: { name: 'Caderno A4 80 folhas', images: [] } },
			{ name: 'Tesoura escolar', sku: 'TESOURA-01', quantity: 1, price: 6.5, total: 6.5, product: { name: 'Tesoura escolar', images: [] } },
		],
		trackingNumber: 'PREVIEW-TRK-001',
		notes: 'Pedido de demonstração para visualização offline.',
	},
	{
		_id: 'ord_preview_002',
		orderNumber: 'OLM-2026-002',
		status: 'shipped',
		paymentStatus: 'paid',
		paymentMethod: 'Cartão',
		shippingMethod: 'Expressa',
		shippingAddress: demoAddress,
		billingAddress: demoAddress,
		subtotal: 89.9,
		shipping: 0,
		tax: 20.18,
		discount: 0,
		total: 110.08,
		createdAt: '2026-05-10T09:15:00.000Z',
		items: [
			{ name: 'Kit Executivo', sku: 'KIT-EXEC', quantity: 1, price: 89.9, total: 89.9, product: { name: 'Kit Executivo', images: [] } },
		],
		trackingNumber: 'PREVIEW-TRK-002',
		notes: 'Pedido preparado para demonstração.',
	},
];

const demoQuotes = [
	{
		_id: 'quote_preview_001',
		quoteNumber: 'Q-2026-0001',
		companyName: 'Escola Municipal de Demo',
		contactName: 'Ana Silva',
		email: 'ana@escola-demo.pt',
		category: 'Material escolar',
		quantity: 120,
		description: 'Pedido de material escolar para o próximo trimestre.',
		status: 'approved',
		priority: 'high',
		createdAt: '2026-05-12T09:00:00.000Z',
		updatedAt: '2026-05-13T10:00:00.000Z',
		validUntil: '2026-05-30T00:00:00.000Z',
		totalEstimate: 1850,
	},
	{
		_id: 'quote_preview_002',
		quoteNumber: 'Q-2026-0002',
		companyName: 'Oficina Demo LTDA',
		contactName: 'Carlos Mendes',
		email: 'carlos@oficina-demo.pt',
		category: 'Suprimentos de escritório',
		quantity: 40,
		description: 'Requisição de suprimentos e material de consumo.',
		status: 'review',
		priority: 'medium',
		createdAt: '2026-05-11T12:30:00.000Z',
		updatedAt: '2026-05-14T08:30:00.000Z',
		validUntil: '2026-05-25T00:00:00.000Z',
		totalEstimate: 680,
	},
];

const demoCartItems = [
	{
		_id: 'product_preview_001',
		product: {
			id: 'product_preview_001',
			name: 'Kit Escolar Básico',
			price: 24.9,
			currentPrice: 24.9,
			slug: 'kit-escolar-basico',
			images: ['https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80'],
			category: 'Escolar',
		},
		quantity: 1,
		price: 24.9,
	},
	{
		_id: 'product_preview_002',
		product: {
			id: 'product_preview_002',
			name: 'Planner Executivo',
			price: 18.5,
			currentPrice: 18.5,
			slug: 'planner-executivo',
			images: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'],
			category: 'Escritório',
		},
		quantity: 2,
		price: 18.5,
	},
];

const previewDashboard = {
	stats: {
		totalUsers: 248,
		totalProducts: 394,
		totalOrders: 126,
		totalRevenue: 19245,
		monthlyOrders: 44,
		lowStockCount: 7,
	},
	recentOrders: demoOrders,
	lowStockProducts: [
		{ _id: 'stock_001', id: 'stock_001', name: 'Canetas azuis', stockQuantity: 3, lowStockThreshold: 10 },
		{ _id: 'stock_002', id: 'stock_002', name: 'Folhas A4', stockQuantity: 5, lowStockThreshold: 12 },
	],
};

const previewAnalytics = {
	overview: {
		totalEvents: 1280,
		uniqueSessions: 620,
		pageViews: 840,
		cartAdds: 182,
		checkoutStarted: 74,
		checkoutCompleted: 49,
		conversionRate: 66,
	},
	trend: [
		{ label: 'jan 2026', views: 110, checkouts: 9 },
		{ label: 'fev 2026', views: 135, checkouts: 10 },
		{ label: 'mar 2026', views: 160, checkouts: 12 },
		{ label: 'abr 2026', views: 140, checkouts: 11 },
		{ label: 'mai 2026', views: 175, checkouts: 14 },
		{ label: 'jun 2026', views: 120, checkouts: 8 },
	],
	topProducts: [
		{ id: 'prod-001', name: 'Lápis premium', views: 184, adds: 48, revenue: 240 },
		{ id: 'prod-002', name: 'Caderno A4', views: 162, adds: 40, revenue: 396 },
		{ id: 'prod-003', name: 'Marcadores', views: 145, adds: 36, revenue: 285 },
	],
	trafficSources: [
		{ source: 'Loja', visitors: 360, percentage: 43 },
		{ source: 'Produto', visitors: 250, percentage: 30 },
		{ source: 'Checkout', visitors: 140, percentage: 17 },
		{ source: 'Outros', visitors: 90, percentage: 10 },
	],
	attribution: {
		firstTouch: [
			{ source: 'Organic', conversions: 26, percentage: 35 },
			{ source: 'Email', conversions: 19, percentage: 26 },
			{ source: 'Direct', conversions: 12, percentage: 16 },
		],
		lastTouch: [
			{ source: 'Email', conversions: 24, percentage: 32 },
			{ source: 'Organic', conversions: 21, percentage: 28 },
			{ source: 'Direct', conversions: 11, percentage: 15 },
		],
		assisted: [
			{ source: 'Organic', conversions: 29, percentage: 39 },
			{ source: 'Email', conversions: 22, percentage: 30 },
			{ source: 'Direct', conversions: 14, percentage: 19 },
		],
	},
	funnel: {
		stages: [
			{ name: 'Visitas', count: 620, conversionRate: 100, dropoff: 0 },
			{ name: 'Produto visualizado', count: 420, conversionRate: 68, dropoff: 32 },
			{ name: 'Adicionado ao carrinho', count: 182, conversionRate: 29, dropoff: 71 },
			{ name: 'Checkout iniciado', count: 74, conversionRate: 12, dropoff: 88 },
			{ name: 'Checkout concluído', count: 49, conversionRate: 8, dropoff: 92 },
		],
		overallConversionRate: 66,
	},
	insights: [
		{
			title: 'Perda de conversão no checkout',
			message: 'O fluxo de checkout ainda está perdendo utilizadores antes do pagamento. Revise frete, validação e fricção na etapa final.',
			severity: 'warning',
		},
		{
			title: 'Ponto de maior abandono',
			message: 'Checkout iniciado está a perder 88% das sessões. Revise etapas finais, validação e métodos de pagamento para reduzir o abandono.',
			severity: 'warning',
		},
		{
			title: 'Produto com baixa conversão',
			message: 'Produtos com alta visualização e baixa adoção merecem uma revisão de preço, imagens e copy para crescer em vendas.',
			severity: 'info',
		},
	],
	availableFilters: {
		channels: ['Direct', 'Email', 'Organic'],
		categories: ['Escolar', 'Escritório', 'Artes'],
		products: [
			{ id: 'prod-001', name: 'Lápis premium' },
			{ id: 'prod-002', name: 'Caderno A4' },
			{ id: 'prod-003', name: 'Marcadores' },
		],
	},
};

const isPreviewMode = () => typeof window !== 'undefined' && window.location.pathname.startsWith('/backup');

const getPreviewResponse = <T>(method: string, url: string): ApiResponse<T> | null => {
	if (!isPreviewMode()) {
		return null;
	}

	if (method === 'get' && url === '/account/profile') {
		return { success: true, data: { user: demoUser } as T };
	}

	if (method === 'put' && url === '/account/profile') {
		return { success: true, data: { user: demoUser } as T };
	}

	if (method === 'post' && url === '/account/client-card') {
		return {
			success: true,
			data: {
				clientCard: {
					id: 'preview-card-001',
					createdAt: new Date().toISOString(),
				},
			} as T,
		};
	}

	if (method === 'get' && url === '/account/orders') {
		return { success: true, data: { orders: demoOrders } as T };
	}

	if (method === 'get' && url.startsWith('/account/orders/')) {
		const selected = demoOrders.find((order) => order._id === url.split('/').pop());
		return { success: true, data: { order: selected ?? demoOrders[0] } as T };
	}

	if (method === 'post' && url === '/account/orders') {
		return {
			success: true,
			data: {
				order: {
					id: 'preview-order-001',
					status: 'confirmed',
					createdAt: new Date().toISOString(),
				},
			} as T,
		};
	}

	if (method === 'post' && url === '/orders/checkout') {
		return {
			success: true,
			data: {
				order: {
					id: 'preview-order-001',
					status: 'pending',
					createdAt: new Date().toISOString(),
				},
				paymentStatus: 'pending',
				clientSecret: undefined,
			} as T,
		};
	}

	if (method === 'get' && url === '/cart') {
		return { success: true, data: { items: demoCartItems } as T };
	}

	if (method === 'get' && url === '/admin/dashboard') {
		return { success: true, data: previewDashboard as T };
	}

	if (method === 'get' && url === '/admin/analytics') {
		return { success: true, data: previewAnalytics as T };
	}

	if (method === 'get' && url === '/admin/b2b/quotes') {
		return { success: true, data: { quotes: demoQuotes } as T };
	}

	if (method === 'get' && url.startsWith('/b2b/quotes')) {
		if (url.startsWith('/b2b/quotes/')) {
			const quote = demoQuotes.find((item) => item._id === url.split('/').pop());
			return { success: true, data: { quote: quote ?? demoQuotes[0] } as T };
		}

		return {
			success: true,
			data: {
				quotes: demoQuotes,
				pagination: {
					totalPages: 1,
					totalQuotes: demoQuotes.length,
				},
			} as T,
		};
	}

	if (['post', 'put', 'delete', 'patch'].includes(method) && url.startsWith('/cart')) {
		return { success: false } as ApiResponse<T>;
	}

	if (method === 'put' && url.startsWith('/admin/b2b/quotes/')) {
		return { success: true, data: { updated: true } as T };
	}

	return null;
};

class ApiClient {
	private instance: AxiosInstance;

	constructor() {
		this.instance = axios.create({
			baseURL: API_BASE_URL,
			timeout: 10000,
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		// O interceptor devolve response.data directamente,
		// por isso os métodos recebem já o ApiResponse<T>
		this.instance.interceptors.response.use(
			(response) => response.data,
			(error) => this.handleError(error)
		);
	}

	private handleError(error: AxiosError<unknown>) {
		const status = error.response?.status ?? 0;
		const data = error.response?.data as
			| { error?: { message?: string; errors?: Record<string, string[]> } }
			| undefined;

		const apiError: ApiError = {
			message: data?.error?.message || error.message || 'Erro desconhecido',
			statusCode: status,
			errors: data?.error?.errors,
		};

		return Promise.reject(apiError);
	}

	async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
		const previewResponse = getPreviewResponse<T>('get', url);
		if (previewResponse) {
			return previewResponse;
		}

		return this.instance.get(url, config) as unknown as Promise<ApiResponse<T>>;
	}

	async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
		const previewResponse = getPreviewResponse<T>('post', url);
		if (previewResponse) {
			return previewResponse;
		}

		return this.instance.post(url, data, config) as unknown as Promise<ApiResponse<T>>;
	}

	async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
		const previewResponse = getPreviewResponse<T>('put', url);
		if (previewResponse) {
			return previewResponse;
		}

		return this.instance.put(url, data, config) as unknown as Promise<ApiResponse<T>>;
	}

	async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
		const previewResponse = getPreviewResponse<T>('delete', url);
		if (previewResponse) {
			return previewResponse;
		}

		return this.instance.delete(url, config) as unknown as Promise<ApiResponse<T>>;
	}

	async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
		const previewResponse = getPreviewResponse<T>('patch', url);
		if (previewResponse) {
			return previewResponse;
		}

		return this.instance.patch(url, data, config) as unknown as Promise<ApiResponse<T>>;
	}
}

export const apiClient = new ApiClient();
export type { ApiResponse, ApiError };