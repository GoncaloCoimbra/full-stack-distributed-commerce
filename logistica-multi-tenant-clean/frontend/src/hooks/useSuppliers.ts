import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/config';

interface Supplier {
  id: string;
  name: string;
  nif: string;
  address?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateSupplierDto {
  name: string;
  nif: string;
  address?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
}

export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await apiClient.get<Supplier[]>('/suppliers');
      return response.data;
    },
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: async () => {
      const response = await apiClient.get<Supplier>(`/suppliers/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useSupplierWithProducts(id: string) {
  return useQuery({
    queryKey: ['suppliers', id, 'products'],
    queryFn: async () => {
      const response = await apiClient.get(`/suppliers/${id}/products`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSupplierDto) => {
      const response = await apiClient.post<Supplier>('/suppliers', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateSupplierDto> }) => {
      const response = await apiClient.patch<Supplier>(`/suppliers/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers', variables.id] });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/suppliers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}