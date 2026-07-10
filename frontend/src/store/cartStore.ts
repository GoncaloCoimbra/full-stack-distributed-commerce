import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../services/apiClient';
import { useAuthStore } from './authStore';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  to: string;
  quantity: number;
  image?: string;
  category?: string;
}

type CartItemPayload = Omit<CartItem, 'quantity'> & {
  quantity?: number;
};

interface CartState {
  items: CartItem[];
  loadCart: () => Promise<void>;
  addItem: (item: CartItemPayload) => Promise<void>;
  uploadRfq: (file: File) => Promise<{ mappedItems: { name: string; sku: string; quantity: number; productId: string }[]; missingItems: { product: string; quantity: number }[]; message: string }>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

export const fmt = (price: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

const calculateShipping = (subtotal: number): number => {
  if (subtotal >= 50) return 0; // grátis acima de 35€
  if (subtotal >= 25) return 3.99; // reduzido
  return 5.99; // normal
};

const mapBackendItems = (items: any[]): CartItem[] => {
  return items.map(item => {
    const product = item.product ?? {};
    const id = product.id?.toString() ?? product._id?.toString() ?? item.id?.toString() ?? '';
    const slug = product.slug ?? id;

    return {
      id,
      name: product.name ?? item.name ?? 'Produto',
      price: Number(item.price ?? product.currentPrice ?? product.price ?? 0),
      originalPrice: Number(product.price ?? item.originalPrice ?? 0) || undefined,
      badge: item.badge ?? undefined,
      to: `/shop/product/${slug}`,
      quantity: Number(item.quantity ?? 1),
      image: product.images?.[0] ?? item.image ?? '',
      category: product.category ?? item.category ?? undefined,
    };
  });
};

const getCurrentUser = () => useAuthStore.getState().user;

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      loadCart: async () => {
        const user = getCurrentUser();
        if (!user) return;

        try {
          const response = await apiClient.get<{ items: any[] }>('/cart');
          if (response.success && Array.isArray(response.data?.items)) {
            set({ items: mapBackendItems(response.data.items) });
          }
        } catch {
          // fallback silently to local cart state
        }
      },

      addItem: async (newItem) => {
        const user = getCurrentUser();
        const quantity = newItem.quantity ?? 1;

        if (user) {
          try {
            const response = await apiClient.post<{ items: any[] }>('/cart/add', {
              productId: newItem.id,
              quantity,
            });
            if (response.success && Array.isArray(response.data?.items)) {
              set({ items: mapBackendItems(response.data.items) });
              return;
            }
          } catch {
            // fallback to local cart update below
          }
        }

        const { items } = get();
        const existingItem = items.find(item => item.id === newItem.id);

        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({ items: [...items, { ...newItem, quantity }] as CartItem[] });
        }
      },

      uploadRfq: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<{
          items: any[];
          mappedItems: { name: string; sku: string; quantity: number; productId: string }[];
          missingItems: { product: string; quantity: number }[];
          message: string;
        }>('/cart/upload-rfq', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!response.success) {
          throw new Error(response.error?.message || 'Não foi possível importar o RFQ');
        }

        if (Array.isArray(response.data?.items)) {
          set({ items: mapBackendItems(response.data.items) });
        }

        return {
          mappedItems: response.data?.mappedItems || [],
          missingItems: response.data?.missingItems || [],
          message: response.data?.message || 'RFQ processado com sucesso',
        };
      },

      updateQuantity: async (id, quantity) => {
        const user = getCurrentUser();
        if (quantity <= 0) {
          await get().removeItem(id);
          return;
        }

        if (user) {
          try {
            const response = await apiClient.put<{ items: any[] }>('/cart/update', {
              productId: id,
              quantity,
            });
            if (response.success && Array.isArray(response.data?.items)) {
              set({ items: mapBackendItems(response.data.items) });
              return;
            }
          } catch {
            // fallback to local update below
          }
        }

        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        });
      },

      removeItem: async (id) => {
        const user = getCurrentUser();

        if (user) {
          try {
            const response = await apiClient.delete<{ items: any[] }>('/cart/remove', {
              data: { productId: id },
            });
            if (response.success && Array.isArray(response.data?.items)) {
              set({ items: mapBackendItems(response.data.items) });
              return;
            }
          } catch {
            // fallback to local remove below
          }
        }

        set({ items: get().items.filter(item => item.id !== id) });
      },

      clearCart: async () => {
        const user = getCurrentUser();

        if (user) {
          try {
            const response = await apiClient.delete<{ items: any[] }>('/cart/clear');
            if (response.success) {
              set({ items: [] });
              return;
            }
          } catch {
            // fallback to local clear below
          }
        }

        set({ items: [] });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// ─── Computed Selectors ───────────────────────────────────────────────────────

export const useCartComputed = () => {
  const items = useCartStore((state) => state.items);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  return { itemCount, subtotal, shipping, total };
};
