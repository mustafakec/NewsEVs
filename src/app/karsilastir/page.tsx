'use client';

import { useState } from 'react';
import { useElectricVehicles } from '@/viewmodels/useElectricVehicles';
import type ElectricVehicle from '@/models/ElectricVehicle';

export default function ComparePage() {
  const { data: vehicles, isLoading } = useElectricVehicles();
  const [selectedVehicles, setSelectedVehicles] = useState<(ElectricVehicle | null)[]>([null, null, null]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleVehicleSelect = (vehicle: ElectricVehicle | null, index: number) => {
    const newSelectedVehicles = [...selectedVehicles];
    newSelectedVehicles[index] = vehicle;
    setSelectedVehicles(newSelectedVehicles);
  };

  const renderVehicleSelector = (index: number) => {
    const isPremiumSlot = index === 2;

    return (
      <div className="relative">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              {index + 1}. Araç {isPremiumSlot && '(Premium)'}
            </h3>
          </div>
          <div className="p-4">
            <select
              value={selectedVehicles[index]?.id || ''}
              onChange={(e) => {
                if (isPremiumSlot && !showPremiumModal) {
                  setShowPremiumModal(true);
                  return;
                }
                if (e.target.value === '') {
                  handleVehicleSelect(null, index);
                  return;
                }
                const vehicle = vehicles?.find((v: ElectricVehicle) => v.id === e.target.value) || null;
                handleVehicleSelect(vehicle, index);
              }}
              className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#660566]/20 
                       focus:border-transparent transition-all duration-200 ${isPremiumSlot && !showPremiumModal ? 'opacity-50' : ''}`}
              disabled={isPremiumSlot && !showPremiumModal}
            >
              <option value="">Araç Seçin</option>
              {vehicles?.map((vehicle: ElectricVehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model}
                </option>
              ))}
            </select>

            {selectedVehicles[index] && (
              <div className="space-y-2 mt-4">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {selectedVehicles[index]?.images?.[0] && (
                    <img
                      src={selectedVehicles[index]?.images[0]}
                      alt={`${selectedVehicles[index]?.brand} ${selectedVehicles[index]?.model}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Menzil</p>
                    <p className="font-medium text-gray-900">{selectedVehicles[index]?.range} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Batarya</p>
                    <p className="font-medium text-gray-900">{selectedVehicles[index]?.batteryCapacity} kWh</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {isPremiumSlot && !showPremiumModal && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#660566]/10 to-[#330233]/10 rounded-2xl">
            <div className="bg-white/95 p-6 rounded-xl shadow-lg border border-[#660566]/20 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-[#660566] to-[#330233] text-white px-4 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                Premium
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                3. Araç Karşılaştırması
              </h3>
              <p className="text-gray-600 mb-4">
                Premium üyelik ile 3 aracı aynı anda karşılaştırabilirsiniz
              </p>
              <button
                onClick={() => setShowPremiumModal(true)}
                className="bg-gradient-to-r from-[#660566] to-[#330233] text-white px-6 py-2 rounded-lg
                       font-medium hover:opacity-90 transition-all duration-200 w-full"
              >
                Premium'a Geç
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderComparison = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
              <div className="h-6 bg-gray-100 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-gray-100 rounded mb-4"></div>
              <div className="aspect-video bg-gray-100 rounded-lg mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-4 bg-gray-100 rounded w-1/2 mb-1"></div>
                  <div className="h-5 bg-gray-100 rounded w-2/3"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-100 rounded w-1/2 mb-1"></div>
                  <div className="h-5 bg-gray-100 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((index) => renderVehicleSelector(index))}
        </div>

        {selectedVehicles.filter(Boolean).length >= 2 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Karşılaştırma</h3>
            <div className="space-y-6">
              {[
                { key: 'range', label: 'Menzil', unit: 'km' },
                { key: 'batteryCapacity', label: 'Batarya Kapasitesi', unit: 'kWh' },
                { key: 'chargingTime.ac', label: 'AC Şarj Süresi', unit: 'saat' },
                { key: 'chargingTime.dc', label: 'DC Şarj Süresi', unit: 'saat' },
                { key: 'performance.acceleration', label: '0-100 km/s', unit: 'saniye' },
                { key: 'performance.topSpeed', label: 'Maksimum Hız', unit: 'km/s' },
                { key: 'performance.power', label: 'Güç', unit: 'HP' },
                { key: 'performance.torque', label: 'Tork', unit: 'Nm' },
                { key: 'dimensions.length', label: 'Uzunluk', unit: 'mm' },
                { key: 'dimensions.width', label: 'Genişlik', unit: 'mm' },
                { key: 'dimensions.height', label: 'Yükseklik', unit: 'mm' },
                { key: 'dimensions.weight', label: 'Ağırlık', unit: 'kg' },
                { key: 'dimensions.cargoCapacity', label: 'Bagaj Hacmi', unit: 'L' },
                { key: 'efficiency.consumption', label: 'Tüketim', unit: 'kWh/100km' },
                { key: 'price.base', label: 'Başlangıç Fiyatı', unit: 'TRY' },
              ].map(({ key, label, unit }) => (
                <div key={key} className="grid grid-cols-4 gap-4 py-4 border-t border-gray-100">
                  <div className="font-medium text-gray-900">{label}</div>
                  {selectedVehicles.map((vehicle, index) => {
                    const value = vehicle ? getValue(vehicle, key) : '-';
                    return (
                      <div key={index} className="text-gray-600">
                        {value} {value !== '-' ? unit : ''}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getValue = (vehicle: ElectricVehicle, key: string) => {
    const keys = key.split('.');
    let value: any = vehicle;
    for (const k of keys) {
      value = value?.[k];
    }
    return value ?? '-';
  };

  const renderPremiumModal = () => {
    if (!showPremiumModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#660566] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium'a Geç</h3>
            <p className="text-gray-600 mb-6">
              Premium üyelik ile tüm özelliklere erişin ve 3 aracı aynı anda karşılaştırın
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full bg-gradient-to-r from-[#660566] to-[#330233] text-white px-6 py-3 rounded-lg
                       font-medium hover:opacity-90 transition-all duration-200"
              >
                Premium'a Geç (₺49.99/ay)
              </button>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Araç Karşılaştırma
        </h1>
        {renderComparison()}
        {renderPremiumModal()}
      </div>
    </div>
  );
} 