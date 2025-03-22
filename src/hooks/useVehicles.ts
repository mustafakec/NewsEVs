import { useQuery } from '@tanstack/react-query';
import type ElectricVehicle from '@/models/ElectricVehicle';

export interface UseVehiclesReturn {
  data: ElectricVehicle[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Sunucu taraflı olarak araç verilerini çekme fonksiyonu
 * SSR için kullanılabilir
 */
export async function fetchVehicles(): Promise<ElectricVehicle[]> {
  // Tarayıcı mı sunucu mu olduğunu kontrol et
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
  const response = await fetch(`${baseUrl}/api/vehicles`, {
    // SSR için cache stratejisi
    next: { revalidate: 3600 } // 1 saatte bir yeniden doğrulama
  });
  
  if (!response.ok) {
    throw new Error('Araçlar yüklenirken bir hata oluştu');
  }
  
  return response.json();
}

/**
 * İstemci taraflı araç verilerini çekmek için React Query hook'u
 */
export function useVehicles(): UseVehiclesReturn {
  return useQuery<ElectricVehicle[], Error>({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
    staleTime: 5 * 60 * 1000, // 5 dakika boyunca verileri önbellekte tut
    refetchOnWindowFocus: false, // Pencere odağı değiştiğinde yeniden çekme 
  });
} 
