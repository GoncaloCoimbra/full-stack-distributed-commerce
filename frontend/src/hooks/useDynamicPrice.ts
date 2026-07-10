import { useState, useCallback } from 'react';
import { apiClient } from '@/utils/api';
import { useAuthStore } from '@/store/authStore';

export interface VolumeTier {
  minQuantity: number;
  discountPercent: number;
}

export interface DynamicPriceData {
  id: string;
  name: string;
  basePrice: number;
  dynamicPrice: number;
  quantity: number;
  applicableTier: VolumeTier | null;
  b2bDiscount: number;
  volumeTiers: VolumeTier[];
  totalForQuantity: number;
}

interface UseDynamicPriceReturn {
  priceData: DynamicPriceData | null;
  isLoading: boolean;
  error: string | null;
  calculatePrice: (productId: string, quantity: number) => Promise<void>;
}

/**
 * Hook para calcular preços dinâmicos baseado em quantidade
 * Aplica descontos por volume e descontos B2B automaticamente
 */
export function useDynamicPrice(): UseDynamicPriceReturn {
  const [priceData, setPriceData] = useState<DynamicPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);

  const calculatePrice = useCallback(
    async (productId: string, quantity: number) => {
      if (!productId || quantity < 1) {
        setError('Product ID e quantidade são obrigatórios');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(`/shop/products/${productId}/dynamic-price`, {
          params: { quantity },
          withCredentials: true
        });

        if (response.data.success) {
          setPriceData(response.data.product);
        } else {
          setError(response.data.error || 'Erro ao calcular preço');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Erro ao calcular preço dinâmico';
        setError(errorMessage);
        console.error('Dynamic price calculation error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    priceData,
    isLoading,
    error,
    calculatePrice
  };
}

/**
 * Calcula o desconto total aplicável (máximo entre desconto por volume e B2B)
 */
export function getTotalDiscount(
  basePrice: number,
  finalPrice: number
): number {
  if (basePrice === 0) return 0;
  return Math.round(((basePrice - finalPrice) / basePrice) * 100 * 100) / 100;
}

/**
 * Formata preço para moeda (EUR)
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
}
