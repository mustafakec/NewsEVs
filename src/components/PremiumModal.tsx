"use client";

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumModal = ({ isOpen, onClose }: PremiumModalProps) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  // Fiyat hesaplama
  const monthlyPrice = 99;
  const yearlyPrice = Math.floor(monthlyPrice * 12 * 0.8); // %20 indirim, kuruş olmadan
  const yearlyPriceFormatted = yearlyPrice.toString();
  const monthlyEquivalent = Math.floor(yearlyPrice / 12).toString();
  
  // Paket bilgileri
  const plans = [
    {
      name: "Ücretsiz",
      price: "0",
      period: "ay",
      isPopular: false,
      features: [
        "Tüm elektrikli araçları görüntüleme",
        "2 aracı aynı anda karşılaştırma",
        "Gelişmiş filtreler",
        "Şarj istasyonları haritası ve şarj ücretleri",
        "Elektrikli araç üreticileri hisse takibi",
        "Favorilere ekleme",
        "Araç karşılaştırma geçmişi",
      ],
      buttonText: "Mevcut Planınız",
      buttonClass: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
    },
    {
      name: "Premium",
      price: billingCycle === 'monthly' ? "99" : yearlyPriceFormatted,
      period: billingCycle === 'monthly' ? "ay" : "yıl",
      isPopular: true,
      features: [
        "Tüm elektrikli araçları görüntüleme",
        "2 aracı aynı anda karşılaştırma",
        "Gelişmiş filtreler",
        "Şarj istasyonları haritası ve şarj ücretleri",
        "Elektrikli araç üreticileri hisse takibi",
        "Favorilere ekleme",
        "Araç karşılaştırma geçmişi",
        "3 aracı aynı anda karşılaştırma",
        "Satışlar ve raporlar blogu",
        "Yakında Türkiye'ye gelecek araçlar",
        "Rota oluşturma",
        "Detaylı şarj maliyeti hesaplayıcı",
        "Reklamsız deneyim"
      ],
      buttonText: billingCycle === 'monthly' ? "Aylık Abone Ol" : "Yıllık Abone Ol",
      buttonClass: "bg-[#660566] text-white hover:bg-[#550455] shadow-md border border-purple-300 hover:shadow-purple-200/40 transform hover:scale-105 transition-all duration-200"
    }
  ];

  // Tüm özelliklerin listesi
  const allFeatures = [
    "Tüm elektrikli araçları görüntüleme",
    "2 aracı aynı anda karşılaştırma",
    "Gelişmiş filtreler",
    "Şarj istasyonları haritası ve şarj ücretleri",
    "Elektrikli araç üreticileri hisse takibi",
    "Favorilere ekleme",
    "Araç karşılaştırma geçmişi",
    "3 aracı aynı anda karşılaştırma",
    "Satışlar ve raporlar blogu",
    "Yakında Türkiye'ye gelecek araçlar",
    "Rota oluşturma",
    "Detaylı şarj maliyeti hesaplayıcı",
    "Reklamsız deneyim"
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div onClick={onClose} className="fixed inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto cursor-pointer" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden bg-white rounded-2xl shadow-xl transition-all">
                {/* Kapat butonu */}
                <div className="absolute right-4 top-4">
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Başlık */}
                <div className="px-6 pt-12 pb-6 text-center">
                  <Dialog.Title className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                    elektrikliyiz Premium
                  </Dialog.Title>
                  <p className="text-lg text-gray-500">
                    Premium avantajlarından yararlanın.
                  </p>
                </div>

                {/* Fiyatlandırma geçişi */}
                <div className="flex justify-center mb-8">
                  <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        billingCycle === 'monthly'
                          ? 'bg-white text-[#660566] shadow-sm'
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Aylık
                    </button>
                    <button
                      onClick={() => setBillingCycle('yearly')}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${
                        billingCycle === 'yearly'
                          ? 'bg-white text-[#660566] shadow-sm'
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Yıllık
                      <span className="ml-1 bg-[#660566] text-white text-xs px-1.5 py-0.5 rounded-full">
                        %20
                      </span>
                    </button>
                  </div>
                </div>

                {/* Paket kartları */}
                <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {plans.map((plan, index) => (
                    <div 
                      key={index} 
                      className={`rounded-xl overflow-hidden shadow-md border ${
                        plan.isPopular ? 'bg-[#660566] text-white' : 'bg-white border-gray-200'
                      }`}
                    >
                      {/* Abonelik türü etiketi */}
                      {plan.isPopular && (
                        <div className="absolute right-12 mt-4">
                          {billingCycle === 'monthly' ? (
                            <span className="bg-white text-[#660566] text-xs font-semibold px-3 py-1 rounded-full">
                              Aylık Abonelik
                            </span>
                          ) : (
                            <div className="flex flex-col items-end">
                              <span className="bg-white text-[#660566] text-xs font-semibold px-3 py-1 rounded-full mb-1">
                                Yıllık Abonelik
                              </span>
                              <span className="bg-transparent border border-white/70 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                %20 İndirim
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Paket başlığı ve fiyat */}
                      <div className="p-6">
                        <h3 className={`text-xl font-bold ${plan.isPopular ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                          {plan.name} {plan.name === "Ücretsiz" && "kullanım"}
                          {plan.isPopular && (
                            <span className="inline-flex ml-2">
                              <span className="animate-pulse inline-block">⚡</span>
                            </span>
                          )}
                        </h3>
                        <div className="flex items-baseline">
                          <span className={`text-4xl font-bold ${plan.isPopular ? 'text-white' : 'text-gray-900'}`}>
                            {plan.price}₺
                          </span>
                          <span className={`ml-2 ${plan.isPopular ? 'text-white/80' : 'text-gray-500'}`}>
                            / {plan.period}
                          </span>
                        </div>
                        {plan.isPopular && billingCycle === 'yearly' && (
                          <p className="text-sm text-white/80 mt-2">
                            Aylık sadece {monthlyEquivalent}₺
                          </p>
                        )}
                      </div>

                      <div className={`border-t ${plan.isPopular ? 'border-white/20' : 'border-gray-200'}`}></div>

                      {/* Özellikler */}
                      <div className="p-6">
                        <ul className="space-y-4">
                          {plan.features.map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-start">
                              <CheckIcon className={`h-5 w-5 mr-3 flex-shrink-0 ${plan.isPopular ? 'text-white' : 'text-[#660566]'}`} />
                              <span className={plan.isPopular ? 'text-white' : 'text-gray-700'}>
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Buton */}
                      <div className="p-6 pt-2 flex justify-center">
                        <button
                          onClick={onClose}
                          className={`w-full py-3 font-medium rounded-lg transition-all ${plan.buttonClass} ${plan.isPopular ? 'font-semibold' : ''}`}
                        >
                          {plan.buttonText}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Karşılaştırma tablosu */}
                <div className="px-8 mb-8">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Özellik</th>
                          <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">Ücretsiz</th>
                          <th className="px-6 py-4 text-center text-sm font-medium text-[#660566]">Premium</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allFeatures.map((feature, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-6 py-3 text-sm text-gray-700">{feature}</td>
                            <td className="px-6 py-3 text-center">
                              {plans[0].features.includes(feature) ? (
                                <CheckIcon className="h-5 w-5 mx-auto text-green-500" />
                              ) : (
                                <XMarkIcon className="h-5 w-5 mx-auto text-gray-300" />
                              )}
                            </td>
                            <td className="px-6 py-3 text-center">
                              {plans[1].features.includes(feature) && (
                                <CheckIcon className="h-5 w-5 mx-auto text-[#660566]" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PremiumModal; 