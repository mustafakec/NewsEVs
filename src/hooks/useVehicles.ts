import { useQuery } from '@tanstack/react-query';
import type ElectricVehicle from '@/models/ElectricVehicle';

export interface UseVehiclesReturn {
  data: ElectricVehicle[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

async function fetchVehicles(): Promise<ElectricVehicle[]> {
  const response = await fetch('/api/vehicles');
  if (!response.ok) {
    throw new Error('Araçlar yüklenirken bir hata oluştu');
  }
  return response.json();
}

export function useVehicles(): UseVehiclesReturn {
  return useQuery<ElectricVehicle[], Error>({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });
} 
