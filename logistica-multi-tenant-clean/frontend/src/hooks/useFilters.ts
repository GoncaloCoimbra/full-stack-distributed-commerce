import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export interface FilterValue {
  key: string;
  label: string;
  value: string;
  type: 'supplier' | 'product' | 'vehicle' | 'transport' | 'status' | 'location' | 'date';
}

export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get todos os filtros ativos
  const activeFilters = useMemo(() => {
    const filters: FilterValue[] = [];
    
    searchParams.forEach((value, key) => {
      if (value && key !== 'page') {
        filters.push({
          key,
          label: getFilterLabel(key),
          value,
          type: getFilterType(key),
        });
      }
    });
    
    return filters;
  }, [searchParams]);

  // Adicionar filtro
  const addFilter = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Remove filtro específico
  const removeFilter = useCallback((key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Limpar todos os filtros
  const clearAllFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  // Check se tem filtros ativos
  const hasFilters = activeFilters.length > 0;

  // Get valor de filtro específico
  const getFilter = useCallback((key: string) => {
    return searchParams.get(key) || '';
  }, [searchParams]);

  return {
    activeFilters,
    addFilter,
    removeFilter,
    clearAllFilters,
    hasFilters,
    getFilter,
    filterCount: activeFilters.length,
  };
};

// Helper functions
function getFilterLabel(key: string): string {
  const labels: Record<string, string> = {
    supplier: 'Supplier',
    supplierId: 'Supplier',
    product: 'Product',
    productId: 'Product',
    vehicle: 'Vehicle',
    vehicleId: 'Vehicle',
    transport: 'Transport',
    status: 'Status',
    location: 'Location',
    dateFrom: 'Start Date',
    dateTo: 'End Date',
    search: 'Search',
  };
  return labels[key] || key;
}

function getFilterType(key: string): FilterValue['type'] {
  if (key.includes('supplier')) return 'supplier';
  if (key.includes('product')) return 'product';
  if (key.includes('vehicle')) return 'vehicle';
  if (key.includes('transport')) return 'transport';
  if (key.includes('status')) return 'status';
  if (key.includes('location')) return 'location';
  if (key.includes('date')) return 'date';
  return 'status';
}