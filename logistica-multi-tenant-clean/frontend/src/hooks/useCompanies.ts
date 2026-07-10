import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/config';

interface Company {
  id: string;
  name: string;
  nif: string;
  address?: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCompanyDto {
  name: string;
  nif: string;
  address?: string;
  email: string;
  phone?: string;
}

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await apiClient.get<Company[]>('/companies');
      return response.data;
    },
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: async () => {
      const response = await apiClient.get<Company>(`/companies/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCompanyWithUsers(id: string) {
  return useQuery({
    queryKey: ['companies', id, 'users'],
    queryFn: async () => {
      const response = await apiClient.get(`/companies/${id}/users`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCompanyStats(id: string) {
  return useQuery({
    queryKey: ['companies', id, 'stats'],
    queryFn: async () => {
      const response = await apiClient.get(`/companies/${id}/stats`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCompanyDto) => {
      const response = await apiClient.post<Company>('/companies', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateCompanyDto> }) => {
      const response = await apiClient.patch<Company>(`/companies/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies', variables.id] });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/companies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}