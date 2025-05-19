'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import VehicleCard from '@/views/VehicleCard';
import { useVehicles } from '@/hooks/useVehicles';
import type { UseVehiclesReturn } from '@/hooks/useVehicles';
import EnhancedSearchBar from '@/views/EnhancedSearchBar';
import type { ElectricVehicle } from '@/models/ElectricVehicle';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-white via-purple-50 to-white">
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'url(/grid.svg)' }} />

        {/* Animasyonlu Arkaplan Elementleri */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-40 left-1/4 w-72 h-72 bg-pink-200 rounded-full filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent 
                         bg-gradient-to-r from-[#660566] via-[#330233] to-black leading-relaxed pb-2">
              Elektrikli Araç Dünyasını Keşfedin
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Elektrikli araç modellerini inceleyin, karşılaştırın ve size en uygun olanı bulun.
              <br />
              Detaylı teknik özellikler, fiyatlar, karşılaştırmalar ve daha fazlası.
            </p>

            <EnhancedSearchBar />

            {/* İstatistikler */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-10 pt-6 border-t border-purple-100">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                <div className="text-sm text-gray-500">Elektrikli Araç</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
                <div className="text-sm text-gray-500">Araç Tipi</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
                <div className="text-sm text-gray-500">Marka</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dalga Şekli */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Araç Tipleri */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Araç Tipleri</h2>
              <p className="text-gray-600">Size en uygun araç tipini seçin</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
              {[
                { name: 'Sedan', image: '/icons/sedan.png' },
                { name: 'Hatchback', image: '/icons/hatchback.png' },
                { name: 'SUV', image: '/icons/suv.png' },
                { name: 'Ticari', image: '/icons/ticari.png' },
                { name: 'Station Wagon', image: '/icons/station-wagon.png' },
                { name: 'Pickup', image: '/icons/pickup.png' },
                { name: 'MPV', image: '/icons/mpv.png' },
                { name: 'Spor', image: '/icons/spor.png' },
                { name: 'Kamyonet', image: '/icons/kamyonet.png' },
                { name: 'Otobüs', image: '/icons/otobus.png' },
                { name: 'Motosiklet', image: '/icons/motors2.png' },
                { name: 'Scooter', image: '/icons/scoot.png' }
              ].map((type) => (
                <Link
                  key={type.name}
                  href={`/elektrikli-araclar?tip=${type.name.toLowerCase()}`}
                  className="group flex flex-col items-center p-6 rounded-xl border border-gray-100
                         hover:border-[#660566]/20 hover:bg-[#660566]/5 transition-all duration-300
                         hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 mb-4 relative 
                               group-hover:scale-110 transition-all duration-300 ease-out">
                    <Image
                      src={type.image}
                      alt={type.name}
                      fill
                      sizes="(max-width: 768px) 80px, 96px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-gray-800 font-medium">{type.name}</span>
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
                Tüm Elektrikli Araçları İncele
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
            <div className="grid md:grid-cols-5 gap-8">
              {/* Elektrikli Araçlar */}
              <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:border-[#660566]/20 
                           hover:shadow-lg transition-all duration-200 group">
                <div className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-[#660566] to-[#330233]
                             flex items-center justify-center text-white
                             group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Elektrikli Araçlar</h3>
                <p className="text-gray-600">
                  Dünya genelinde satılan elektrikli araçların fiyat, menzil ve diğer tüm özelliklerini keşfedin.
                </p>
              </div>

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
                  Elektrikli araç karşılaştırma özelliğimizle fiyat, menzil ve performans gibi detayları kolayca karşılaştırın.
                </p>
              </div>

              {/* Şarj Haritası */}
              <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:border-[#660566]/20 
                           hover:shadow-lg transition-all duration-200 group">
                <div className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-[#660566] to-[#330233]
                             flex items-center justify-center text-white
                             group-hover:scale-110 transition-transform duration-200">
                  <div className="flex items-center gap-0.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-base">₺</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Şarj İstasyonu Ücretleri </h3>
                <p className="text-gray-600">
                Şarj istasyonlarındaki güncel ücretleri öğrenin, bütçenize uygun seçenekleri kolayca görün.
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
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Şarj Maliyeti Hesaplayıcı</h3>
                <p className="text-gray-600">
                Elektrikli aracınızın şarjının ne kadar tutacağını kolayca hesaplayabilirsiniz. Hızlı ve pratik şekilde, aracınızın enerji ihtiyacına göre maliyeti öğrenin.
                </p>
              </div>

              {/* Blog */}
              <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:border-[#660566]/20 
                           hover:shadow-lg transition-all duration-200 group">
                <div className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-[#660566] to-[#330233]
                             flex items-center justify-center text-white
                             group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Blog</h3>
                <p className="text-gray-600">
                  Elektrikli araçlar hakkında en güncel bilgiler, incelemeler ve önerilere göz atın.
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
