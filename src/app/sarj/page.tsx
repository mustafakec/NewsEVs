"use client";

import { useState } from 'react';
import { useUserStore } from '@/stores/useUserStore';

export default function SarjPage() {
  const [batteryCapacity, setBatteryCapacity] = useState<number>(0);
  const [currentCharge, setCurrentCharge] = useState<number>(0);
  const [targetCharge, setTargetCharge] = useState<number>(0);
  const [kwhPrice, setKwhPrice] = useState<number>(0);

  const [calculationResult, setCalculationResult] = useState<{
    energyToAdd: number;
    totalCost: number;
    chargingTime50kW: string;
    chargingTime150kW: string;
    kwhPrice: number;
    estimatedRange: number;
    acChargingTime: string;
    dcChargingTime: string;
    superChargerTime: string;
  } | null>(null);

  // Kullanıcı bilgilerini al
  const { user, isLoggedIn } = useUserStore();
  const isPremiumUser = isLoggedIn && (user?.isPremium || user?.email === "test@test.com");

  // Şarj maliyeti hesaplama fonksiyonu
  const calculateChargingCost = () => {
    if (batteryCapacity <= 0 || currentCharge >= targetCharge || kwhPrice <= 0) {
      alert('Lütfen geçerli değerler giriniz');
      return;
    }

    // Eklenecek enerji (kWh)
    const energyToAdd = batteryCapacity * (targetCharge - currentCharge) / 100;

    // Toplam maliyet
    const totalCost = energyToAdd * kwhPrice;

    // Şarj süreleri
    const hours50kW = energyToAdd / 50;
    const minutes50kW = Math.round(hours50kW * 60);
    const chargingTime50kW = minutes50kW >= 60
      ? `${Math.floor(minutes50kW / 60)} saat ${minutes50kW % 60} dakika`
      : `${minutes50kW} dakika`;

    const hours150kW = energyToAdd / 150;
    const minutes150kW = Math.round(hours150kW * 60);
    const chargingTime150kW = minutes150kW >= 60
      ? `${Math.floor(minutes150kW / 60)} saat ${minutes150kW % 60} dakika`
      : `${minutes150kW} dakika`;

    // Tahmini menzil artışı (yaklaşık 6 km/kWh varsayımı ile)
    const estimatedRange = Math.round(energyToAdd * 6);

    // Detaylı şarj maliyeti hesaplamalarını ekleyelim
    const acChargingHours = energyToAdd / 11; // 11 kW AC şarj için
    const dcChargingHours = energyToAdd / 50; // 50 kW DC şarj için
    const superChargerHours = energyToAdd / 250;

    setCalculationResult({
      energyToAdd,
      totalCost,
      chargingTime50kW,
      chargingTime150kW,
      kwhPrice,
      estimatedRange,
      acChargingTime: acChargingHours >= 1
        ? `${Math.floor(acChargingHours)} saat ${Math.round((acChargingHours % 1) * 60)} dakika`
        : `${Math.round(acChargingHours * 60)} dakika`,
      dcChargingTime: dcChargingHours >= 1
        ? `${Math.floor(dcChargingHours)} saat ${Math.round((dcChargingHours % 1) * 60)} dakika`
        : `${Math.round(dcChargingHours * 60)} dakika`,
      superChargerTime: superChargerHours >= 1
        ? `${Math.floor(superChargerHours)} saat ${Math.round((superChargerHours % 1) * 60)} dakika`
        : `${Math.round(superChargerHours * 60)} dakika`,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent 
                        bg-gradient-to-r from-[#660566] via-[#330233] to-black mb-4">
              
            </h1>
            <p className="text-lg text-gray-600">
              
            </p>
          </div>

          {/* Güncel Şarj Ücretleri ve Şarj Maliyeti Hesaplayıcı */}
          <div className="mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* SOL TARAF: Güncel Şarj Ücretleri */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#660566]/10 via-purple-50 to-[#660566]/5 p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Şarj İstasyonu Ücretleri</h3>
                  <p className="text-gray-700 text-sm mb-0">Şarj istasyonlarının ücret ve detaylarını inceleyin.</p>
                </div>

                <div className="p-6 pt-8">
                  {/* Tesla */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <img src="/icons/tesla.png" alt="Tesla Logo" className="h-8" />
                      <h3 className="text-lg font-semibold text-gray-900">Tesla</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">DC Şarj (250 kW)</span>
                        <span className="text-[#660566] font-semibold">8,8₺ / kWh</span>
                      </div>
                    </div>
                  </div>

                  {/* Trugo */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <img src="/icons/trugo.png" alt="Trugo Logo" className="h-8" />
                      <h3 className="text-lg font-semibold text-gray-900">Trugo</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600">AC Şarj (≤ 22 kW)</span>
                          <span className="text-[#660566] font-semibold">8,49₺ / kWh</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600">DC Şarj ({'<'} 150 kW)</span>
                          <span className="text-[#660566] font-semibold">10,60₺ / kWh</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600">DC Şarj (≥ 150 kW)</span>
                          <span className="text-[#660566] font-semibold">11,82₺ / kWh</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bilgilendirme */}
                  <div className="mt-6 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-gray-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Diğer şarj istasyonları çok yakında.</span>
                    </div>
                    <div className="text-center text-xs text-gray-400 px-3 py-1.5">
                      <svg className="w-3.5 h-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Fiyatlar ve bilgiler değişiklik gösterebilir. Bu sayfadaki tüm markalar ve logolar bilgilendirme amaçlıdır.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SAĞ TARAF: Şarj Maliyeti Hesaplayıcı */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
                <div className="bg-gradient-to-r from-[#660566]/10 via-purple-50 to-[#660566]/5 p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Şarj Maliyeti Hesaplayıcı</h3>
                  <p className="text-gray-700 text-sm mb-0">Aracınızın şarj maliyetini hesaplayın.</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="batteryCapacity" className="block text-sm font-medium text-gray-700 mb-1">
                        Batarya Kapasitesi (kWh)
                      </label>
                      <input
                        type="number"
                        id="batteryCapacity"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#660566]/20 focus:border-[#660566]/30 transition-colors"
                        placeholder="Örn: 70"
                        onChange={(e) => {
                          const value = e.target.valueAsNumber;
                          setBatteryCapacity(isNaN(value) ? 0 : value);
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="currentCharge" className="block text-sm font-medium text-gray-700 mb-1">
                          Mevcut Şarj (%)
                        </label>
                        <input
                          type="number"
                          id="currentCharge"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#660566]/20 focus:border-[#660566]/30 transition-colors"
                          placeholder="Örn: 20"
                          min="0"
                          max="100"
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            setCurrentCharge(isNaN(value) ? 0 : Math.min(100, Math.max(0, value)));
                          }}
                        />
                      </div>

                      <div>
                        <label htmlFor="targetCharge" className="block text-sm font-medium text-gray-700 mb-1">
                          Hedef Şarj (%)
                        </label>
                        <input
                          type="number"
                          id="targetCharge"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#660566]/20 focus:border-[#660566]/30 transition-colors"
                          placeholder="Örn: 80"
                          min="0"
                          max="100"
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            setTargetCharge(isNaN(value) ? 0 : Math.min(100, Math.max(0, value)));
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="kwhPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Şarj Ücreti (₺/kWh)
                      </label>
                      <input
                        type="number"
                        id="kwhPrice"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#660566]/20 focus:border-[#660566]/30 transition-colors"
                        placeholder="Örn: 8.8"
                        step="0.01"
                        onChange={(e) => {
                          const value = e.target.valueAsNumber;
                          setKwhPrice(isNaN(value) ? 0 : value);
                        }}
                      />
                    </div>

                    <div className="mt-2">
                      <button
                        onClick={calculateChargingCost}
                        className="w-full bg-gradient-to-r from-[#660566] to-[#330233] text-white 
                               rounded-lg px-4 py-2 font-medium hover:opacity-90 
                               transition-all duration-200"
                      >
                        Hesapla
                      </button>
                    </div>
                  </div>

                  {calculationResult !== null && (
                    <div className="mt-6 p-5 bg-[#660566]/5 rounded-xl">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Hesaplama Sonucu</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Eklenecek Enerji:</span>
                          <span className="font-medium">{calculationResult.energyToAdd.toFixed(2)} kWh</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tahmini Şarj Süresi (50 kW):</span>
                          <span className="font-medium">{calculationResult.chargingTime50kW}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tahmini Şarj Süresi (150 kW):</span>
                          <span className="font-medium">{calculationResult.chargingTime150kW}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tahmini Menzil Artışı:</span>
                          <span className="font-medium">~{calculationResult.estimatedRange} km</span>
                        </div>
                        <div className="flex justify-between items-center text-lg pt-2 border-t border-purple-100">
                          <span className="text-gray-800 font-medium">Toplam Maliyet:</span>
                          <span className="text-[#660566] font-bold">{calculationResult.totalCost.toFixed(2)} ₺</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 