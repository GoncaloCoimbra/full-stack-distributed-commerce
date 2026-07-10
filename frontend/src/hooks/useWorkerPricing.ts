/**
 * useWorkerPricing Hook
 * Hook React que utiliza Web Worker para cálculos de preço sem travar a UI
 */

import { useState, useEffect, useCallback } from 'react';

interface PriceCalculationRequest {
  id: string;
  items: Array<{
    productId: string;
    quantity: number;
    basePrice: number;
    volumeDiscounts?: Array<{
      minQuantity: number;
      discountPercent: number;
    }>;
  }>;
  b2bDiscountRate?: number;
  discountCode?: string;
  taxRate?: number;
}

interface PriceResult {
  subtotal: number;
  itemPrices: Array<{
    productId: string;
    unitPrice: number;
    total: number;
  }>;
  discount: number;
  tax: number;
  total: number;
}

export const useWorkerPricing = () => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<PriceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Inicializar Web Worker
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const priceWorker = new Worker(
        new URL('../workers/priceCalculator.worker.ts', import.meta.url),
        { type: 'module' }
      );

      priceWorker.onmessage = (event: MessageEvent) => {
        if (event.data.success) {
          setResult(event.data.data);
        } else {
          setError(event.data.error);
        }
        setIsCalculating(false);
      };

      priceWorker.onerror = (error: ErrorEvent) => {
        setError(error.message);
        setIsCalculating(false);
      };

      setWorker(priceWorker);

      return () => {
        priceWorker.terminate();
      };
    } catch (error: any) {
      console.warn('Web Worker não suportado, usando cálculo na main thread:', error.message);
    }
  }, []);

  // Função para calcular preços
  const calculatePrices = useCallback(
    (request: Omit<PriceCalculationRequest, 'id'>) => {
      if (!worker) {
        console.warn('Web Worker não inicializado');
        return;
      }

      setIsCalculating(true);
      setError(null);

      worker.postMessage({
        ...request,
        id: `calc-${Date.now()}-${Math.random()}`,
      } as PriceCalculationRequest);
    },
    [worker]
  );

  return {
    calculatePrices,
    result,
    isCalculating,
    error,
  };
};

export default useWorkerPricing;
