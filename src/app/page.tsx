'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import VehicleCard from '@/views/VehicleCard';
import VehicleFilters from '@/views/VehicleFilters';
import { useVehicles } from '@/hooks/useVehicles';
import type { UseVehiclesReturn } from '@/hooks/useVehicles';
import SearchBar from '@/views/SearchBar';
import type ElectricVehicle from '@/models/ElectricVehicle';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#660566]/5 to-white border-b border-[#660566]/10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        <div className="container relative mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent 
                        bg-gradient-to-r from-[#660566] via-[#330233] to-black
                        mb-8">
              Elektrikli Araç Dünyası
            </h1>
            <p className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#4d044d] to-[#330233]
                       mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Tüm modelleri inceleyin, en uygun seçeneği bulun.
            </p>
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-4">
              <VehicleFilters />
            </div>
          </div>

          {/* Vehicle List */}
          <div className="flex-1">
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

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#660566] to-[#330233] opacity-25 group-hover:opacity-50 blur transition duration-200"></div>
              <div className="relative bg-white p-8 rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-gradient-to-r from-[#660566] to-[#330233] rounded-xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition duration-200">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#660566] to-[#330233] text-center mb-4">Hızlı Karşılaştırma</h3>
                <p className="text-gray-600 text-center">Tüm elektrikli araçları detaylı özelliklerle karşılaştırın.</p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#660566] to-[#330233] opacity-25 group-hover:opacity-50 blur transition duration-200"></div>
              <div className="relative bg-white p-8 rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-gradient-to-r from-[#660566] to-[#330233] rounded-xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition duration-200">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#660566] to-[#330233] text-center mb-4">Güncel Veriler</h3>
                <p className="text-gray-600 text-center">En güncel fiyat ve özellik bilgilerine anında ulaşın.</p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#660566] to-[#330233] opacity-25 group-hover:opacity-50 blur transition duration-200"></div>
              <div className="relative bg-white p-8 rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-gradient-to-r from-[#660566] to-[#330233] rounded-xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition duration-200">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#660566] to-[#330233] text-center mb-4">Maliyet Hesaplama</h3>
                <p className="text-gray-600 text-center">Toplam sahip olma maliyetini kolayca hesaplayın.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
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
