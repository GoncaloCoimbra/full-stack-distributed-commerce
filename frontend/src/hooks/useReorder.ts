import { useState, useCallback } from 'react';
import { apiClient } from '@/services/apiClient';
import { useCartStore } from '@/store/cartStore';

interface ClonedItem {
  name: string;
  quantity: number;
}

interface UseReorderReturn {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  clonedItems: ClonedItem[] | null;
  cloneOrder: (orderId: string) => Promise<void>;
  resetState: () => void;
}

/**
 * Hook para clonar encomenda anterior ao carrinho (1-click reorder)
 * Disponível apenas para clientes B2B
 */
export function useReorder(): UseReorderReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [clonedItems, setClonedItems] = useState<ClonedItem[] | null>(null);
  const loadCart = useCartStore(state => state.loadCart);

  const cloneOrder = useCallback(
    async (orderId: string) => {
      if (!orderId) {
        setError('Order ID é obrigatório');
        return;
      }

      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setClonedItems(null);

      try {
        const response = await apiClient.post<any>(`/b2b/orders/${orderId}/clone`, {}, {
          withCredentials: true
        });

        if (response.success) {
          setSuccess(true);
          setClonedItems((response.data as any)?.clonedItems || []);
          // Recarregar carrinho após clonar
          await loadCart();
        } else {
          setError(response.error?.message || 'Erro ao clonar encomenda');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Erro ao clonar encomenda';
        setError(errorMessage);
        console.error('Clone order error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [loadCart]
  );

  const resetState = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
    setClonedItems(null);
  }, []);

  return {
    isLoading,
    error,
    success,
    clonedItems,
    cloneOrder,
    resetState
  };
}
