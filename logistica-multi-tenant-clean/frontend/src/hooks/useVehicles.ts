import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/config';

interface Vehicle {
  id: string;
  licensePlate: string;
  model?: string;
  brand?: string;
  type: string;
  capacity: number;
  year?: number;
  status: string;
  observations?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateVehicleDto {
  licensePlate: string;
  model?: string;
  brand?: string;
  type: string;
  capacity: number;
  year?: number;
  status?: string;
  observations?: string;
}

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await apiClient.get<Vehicle[]>('/vehicles');
      return response.data;
    },
  });
}

export function useAvailableVehicles() {
  return useQuery({
    queryKey: ['vehicles', 'available'],
    queryFn: async () => {
      const response = await apiClient.get<Vehicle[]>('/vehicles/available');
      return response.data;
    },
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: async () => {
      const response = await apiClient.get<Vehicle>(`/vehicles/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVehicleDto) => {
      const response = await apiClient.post<Vehicle>('/vehicles', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateVehicleDto> }) => {
      const response = await apiClient.patch<Vehicle>(`/vehicles/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles', variables.id] });
    },
  });
}

export function useUpdateVehicleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.patch<Vehicle>(`/vehicles/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/vehicles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}