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
      ? `${Math.floor(minutes50kW / 60)} hours ${minutes50kW % 60} minutes`
      : `${minutes50kW} minutes`;

    const hours150kW = energyToAdd / 150;
    const minutes150kW = Math.round(hours150kW * 60);
    const chargingTime150kW = minutes150kW >= 60
      ? `${Math.floor(minutes150kW / 60)} hours ${minutes150kW % 60} minutes`
      : `${minutes150kW} minutes`;

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
        ? `${Math.floor(acChargingHours)} hours ${Math.round((acChargingHours % 1) * 60)} minutes`
        : `${Math.round(acChargingHours * 60)} minutes`,
      dcChargingTime: dcChargingHours >= 1
        ? `${Math.floor(dcChargingHours)} hours ${Math.round((dcChargingHours % 1) * 60)} minutes`
        : `${Math.round(dcChargingHours * 60)} minutes`,
      superChargerTime: superChargerHours >= 1
        ? `${Math.floor(superChargerHours)} hours ${Math.round((superChargerHours % 1) * 60)} minutes`
        : `${Math.round(superChargerHours * 60)} minutes`,
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
              Tesla Supercharger Pricing
            </h1>
            <p className="text-lg text-gray-600">
              View current Tesla Supercharger rates and calculate your charging cost.
            </p>
          </div>

          {/* Güncel Şarj Ücretleri ve Şarj Maliyeti Hesaplayıcı */}
          <div className="mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* SOL TARAF: Güncel Şarj Ücretleri */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#660566]/10 via-purple-50 to-[#660566]/5 p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Tesla Supercharger Rates (USA)</h3>
                  <p className="text-gray-700 text-sm mb-0">Current rates and idle fees for Tesla Superchargers in the US.</p>
                </div>

                <div className="p-6 pt-8">
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <img src="/icons/tesla.png" alt="Tesla Logo" className="h-8" />
                      <h3 className="text-lg font-semibold text-gray-900">Tesla</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 mb-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Idle fee (per minute)</span>
                        <span className="text-[#660566] font-semibold">$0.50</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Idle fee (per minute, 100% occupied)</span>
                        <span className="text-[#660566] font-semibold">$1.00</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Supercharging (per kWh)</span>
                        <span className="text-[#660566] font-semibold">$0.25</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-gray-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Only Tesla Supercharger rates are shown. Other networks coming soon.</span>
                    </div>
                    <div className="text-center text-xs text-gray-400 px-3 py-1.5">
                      <svg className="w-3.5 h-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Rates and information may vary. All brands and logos are for informational purposes only.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SAĞ TARAF: Şarj Maliyeti Hesaplayıcı */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
                <div className="bg-gradient-to-r from-[#660566]/10 via-purple-50 to-[#660566]/5 p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Charging Cost Calculator</h3>
                  <p className="text-gray-700 text-sm mb-0">Calculate your vehicle's charging cost.</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="batteryCapacity" className="block text-sm font-medium text-gray-700 mb-1">
                        Battery Capacity (kWh)
                      </label>
                      <input
                        type="number"
                        id="batteryCapacity"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#660566]/20 focus:border-[#660566]/30 transition-colors"
                        placeholder="e.g. 70"
                        onChange={(e) => {
                          const value = e.target.valueAsNumber;
                          setBatteryCapacity(isNaN(value) ? 0 : value);
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="currentCharge" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Charge (%)
                        </label>
                        <input
                          type="number"
                          id="currentCharge"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#660566]/20 focus:border-[#660566]/30 transition-colors"
                          placeholder="e.g. 20"
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            setCurrentCharge(isNaN(value) ? 0 : value);
                          }}
                        />
                      </div>

                      <div>
                        <label htmlFor="targetCharge" className="block text-sm font-medium text-gray-700 mb-1">
                          Target Charge (%)
                        </label>
                        <input
                          type="number"
                          id="targetCharge"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#660566]/20 focus:border-[#660566]/30 transition-colors"
                          placeholder="e.g. 80"
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            setTargetCharge(isNaN(value) ? 0 : value);
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="kwhPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Electricity Rate ($/kWh)
                      </label>
                      <input
                        type="number"
                        id="kwhPrice"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#660566]/20 focus:border-[#660566]/30 transition-colors"
                        placeholder="e.g. 0.25"
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
                        Calculate
                      </button>
                    </div>
                  </div>

                  {calculationResult !== null && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Energy to Add</span>
                        <span className="text-lg font-semibold text-gray-900">{calculationResult.energyToAdd.toFixed(2)} kWh</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Total Cost</span>
                        <span className="text-lg font-semibold text-gray-900">${calculationResult.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Estimated Range Added</span>
                        <span className="text-lg font-semibold text-gray-900">{calculationResult.estimatedRange} mi</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">AC Charging Time (11 kW)</span>
                        <span className="text-lg font-semibold text-gray-900">{calculationResult.acChargingTime.replace('saat', 'hours').replace('dakika', 'minutes')}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">DC Charging Time (50 kW)</span>
                        <span className="text-lg font-semibold text-gray-900">{calculationResult.dcChargingTime.replace('saat', 'hours').replace('dakika', 'minutes')}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Supercharger Time (250 kW)</span>
                        <span className="text-lg font-semibold text-gray-900">{calculationResult.superChargerTime.replace('saat', 'hours').replace('dakika', 'minutes')}</span>
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