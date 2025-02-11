'use client';

import { Suspense } from 'react';
import VehicleCard from '@/views/VehicleCard';
import VehicleFilters from '@/views/VehicleFilters';
import { useVehicles } from '@/hooks/useVehicles';
import type { UseVehiclesReturn } from '@/hooks/useVehicles';
import type ElectricVehicle from '@/models/ElectricVehicle';

export default function ElectricVehiclesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent 
                      bg-gradient-to-r from-[#660566] via-[#330233] to-black">
            Elektrikli Araçlar
          </h1>
          <p className="text-gray-600 mt-2">
            Tüm elektrikli araç modellerini inceleyin, karşılaştırın ve size en uygun olanı seçin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filtreler */}
          <div className="lg:w-full flex-shrink-0">
            <div className="sticky top-4">
              <VehicleFilters />
            </div>
          </div>

          {/* Araç Listesi */}
          <div className="md:col-span-3">
            <Suspense
              fallback={
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                      <div className="w-full h-48 bg-purple-100 rounded-lg mb-4"></div>
                      <div className="h-6 bg-purple-100 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-purple-100 rounded w-1/2 mb-4"></div>
                      <div className="grid grid-cols-2 gap-2">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className="h-8 bg-purple-100 rounded"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <VehicleList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function VehicleList() {
  const { data: vehicles, isLoading, error }: UseVehiclesReturn = useVehicles();

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
            <div className="w-full h-48 bg-purple-100 rounded-lg mb-4"></div>
            <div className="h-6 bg-purple-100 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-purple-100 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-8 bg-purple-100 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Araçlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</span>
        </div>
      </div>
    );
  }

  if (!vehicles?.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-gray-500">Araç bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {vehicles.map((vehicle: ElectricVehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onClick={() => console.log('Vehicle clicked:', vehicle.id)}
        />
      ))}
    </div>
  );
} 