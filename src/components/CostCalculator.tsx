'use client';

import { useState } from 'react';

const CostCalculator = () => {
  const [monthlyKm, setMonthlyKm] = useState('');
  const [electricityRate, setElectricityRate] = useState('');

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    // Hesaplama işlemleri burada yapılacak
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200
                  hover:shadow-lg">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Maliyet Hesaplama
        </h3>

        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aylık Kilometre
            </label>
            <div className="relative">
              <input
                type="number"
                value={monthlyKm}
                onChange={(e) => setMonthlyKm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#660566]/20 
                       focus:border-transparent transition-all duration-200"
                placeholder="0"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-gray-500">km</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Elektrik Birim Fiyatı
            </label>
            <div className="relative">
              <input
                type="number"
                value={electricityRate}
                onChange={(e) => setElectricityRate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#660566]/20 
                       focus:border-transparent transition-all duration-200"
                placeholder="0"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-gray-500">TL/kWh</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#660566] to-[#330233] text-white 
                   rounded-lg px-4 py-2 font-medium hover:opacity-90 
                   transition-all duration-200"
          >
            Hesapla
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Aylık Maliyet</span>
            <span className="text-lg font-semibold text-gray-900">0 TL</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Km Başına Maliyet</span>
            <span className="text-lg font-semibold text-gray-900">0 TL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator; 