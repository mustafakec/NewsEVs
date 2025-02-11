'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import VehicleCard from '@/views/VehicleCard';
import { useVehicles } from '@/hooks/useVehicles';
import type { UseVehiclesReturn } from '@/hooks/useVehicles';
import SearchBar from '@/views/SearchBar';
import type ElectricVehicle from '@/models/ElectricVehicle';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#660566]/5 to-white border-b border-[#660566]/10">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/grid.svg)' }} />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
                        bg-gradient-to-r from-[#660566] via-[#330233] to-black">
              Elektrikli Araç Dünyasını Keşfedin
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Türkiye'nin en kapsamlı elektrikli araç platformunda karşılaştırın, 
              inceleyin ve size en uygun aracı bulun.
            </p>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Araç Tipleri */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Araç Tipleri</h2>
              <p className="text-gray-600">Size en uygun elektrikli araç tipini seçin</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { 
                  name: 'SUV', 
                  icon: 'M5 10a2 2 0 012-2h10a2 2 0 012 2v7h2v-3.5a2 2 0 00-.546-1.368l-3.2-3.6A2 2 0 0015.8 8H8.2a2 2 0 00-1.454.632l-3.2 3.6A2 2 0 003 13.5V17h2v-7zm14 8a1 1 0 11-2 0 1 1 0 012 0zm-12 0a1 1 0 11-2 0 1 1 0 012 0z M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z', 
                  desc: 'Yüksek performans' 
                },
                { 
                  name: 'Sedan', 
                  icon: 'M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6h-3v-1a2 2 0 00-2-2h-8a2 2 0 00-2 2v1H3zm16-8l-3-4H8L5 10m4 7a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z', 
                  desc: 'Konfor ve verimlilik' 
                },
                { 
                  name: 'Hatchback', 
                  icon: 'M5 11l2-6h10l2 6m1 6a2 2 0 11-4 0 2 2 0 014 0zM9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0H5v-5a2 2 0 012-2h10a2 2 0 012 2v5z', 
                  desc: 'Pratik ve ekonomik' 
                },
                { 
                  name: 'Crossover', 
                  icon: 'M5 10l2-4h10l2 4m1 7a2 2 0 11-4 0 2 2 0 014 0zM9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0H5v-6a2 2 0 012-2h10a2 2 0 012 2v6z', 
                  desc: 'Çok yönlü kullanım' 
                },
                { 
                  name: 'Spor', 
                  icon: 'M3 18v-8l4-4h10l4 4v8h-3v-1a2 2 0 00-2-2h-8a2 2 0 00-2 2v1H3zm16-7l-3-3H8L5 11m4 6a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z', 
                  desc: 'Maksimum performans' 
                },
                { 
                  name: 'Ticari', 
                  icon: 'M3 18v-6a2 2 0 012-2h8v8h-3v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1H3zm16 0h-3v-6h5v4a2 2 0 01-2 2zm-7-9H5l2-4h5v4zm4 7a2 2 0 11-4 0 2 2 0 014 0zM9 17a2 2 0 11-4 0 2 2 0 014 0z', 
                  desc: 'İş için ideal' 
                }
              ].map((type) => (
                <Link 
                  key={type.name}
                  href={`/elektrikli-araclar?tip=${type.name.toLowerCase()}`}
                  className="group flex flex-col items-center p-4 rounded-xl border border-gray-100
                         hover:border-[#660566]/20 hover:bg-[#660566]/5 transition-all duration-200"
                >
                  <div className="w-12 h-12 mb-3 rounded-lg bg-gradient-to-br from-[#660566] to-[#330233]
                               flex items-center justify-center text-white
                               group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-[#660566] transition-colors">
                    {type.name}
                  </h3>
                  <p className="text-sm text-gray-500 text-center mt-1">
                    {type.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popüler Araçlar */}
      <section className="py-16 bg-gradient-to-br from-white via-[#660566]/5 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Popüler Araçlar</h2>
              <p className="text-gray-600">En çok ilgi gören elektrikli araçları keşfedin</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PopularVehicles />
            </div>

            <div className="text-center mt-10">
              <Link 
                href="/elektrikli-araclar"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#660566] to-[#330233] 
                       text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200"
              >
                Tüm Araçları İncele
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Neler Sunuyoruz */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Neler Sunuyoruz?</h2>
              <p className="text-gray-600">Size en iyi deneyimi sunmak için buradayız</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Detaylı Karşılaştırma */}
              <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:border-[#660566]/20 
                           hover:shadow-lg transition-all duration-200 group">
                <div className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-[#660566] to-[#330233]
                             flex items-center justify-center text-white
                             group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Detaylı Karşılaştırma</h3>
                <p className="text-gray-600">
                  Farklı elektrikli araçları detaylı özelliklerine göre karşılaştırın ve size en uygun olanı seçin.
                </p>
              </div>

              {/* Şarj Haritası */}
              <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:border-[#660566]/20 
                           hover:shadow-lg transition-all duration-200 group">
                <div className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-[#660566] to-[#330233]
                             flex items-center justify-center text-white
                             group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Şarj Haritası</h3>
                <p className="text-gray-600">
                  Türkiye'nin en güncel şarj istasyonu haritası ile size en yakın şarj noktalarını bulun.
                </p>
              </div>

              {/* Borsa Takibi */}
              <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:border-[#660566]/20 
                           hover:shadow-lg transition-all duration-200 group">
                <div className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-[#660566] to-[#330233]
                             flex items-center justify-center text-white
                             group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Borsa Takibi</h3>
                <p className="text-gray-600">
                  Elektrikli araç üreticilerinin borsa verilerini anlık olarak takip edin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PopularVehicles() {
  const { data: vehicles } = useVehicles();
  const popularVehicles = vehicles?.slice(0, 4) || [];

  return (
    <>
      {popularVehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onClick={() => console.log('Vehicle clicked:', vehicle.id)}
        />
      ))}
    </>
  );
}

function VehicleListSkeleton({ count = 4 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
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
    </>
  );
} 
