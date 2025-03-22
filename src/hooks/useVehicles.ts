import { useQuery } from '@tanstack/react-query';
import type ElectricVehicle from '@/models/ElectricVehicle';
import vehiclesData from '@/data/electric-vehicles.json';

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
  // Build zamanında ise doğrudan JSON verisini kullan
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    return vehiclesData as ElectricVehicle[];
  }
  
  // Geliştirme ortamında veya tarayıcıda API kullan
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
  try {
    const response = await fetch(`${baseUrl}/api/vehicles`, {
      // SSR için cache stratejisi
      next: { revalidate: 3600 } // 1 saatte bir yeniden doğrulama
    });
    
    if (!response.ok) {
      throw new Error('Araçlar yüklenirken bir hata oluştu');
    }
    
    return response.json();
  } catch (error) {
    console.warn('API üzerinden veriler alınamadı, yerel veri kullanılıyor', error);
    // API hatası durumunda yerel veriyi kullan
    return vehiclesData as ElectricVehicle[];
  }
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
