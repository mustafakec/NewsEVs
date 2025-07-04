'use client';

import { useState, useEffect, useRef } from 'react';
import { useElectricVehicles } from '@/viewmodels/useElectricVehicles';
import type { ElectricVehicle } from '@/models/ElectricVehicle';
import { useUserStore } from '@/stores/useUserStore';
import { formatCurrency } from '@/components/VehicleClientContent';

export default function ComparePage() {
  const { data: vehicles, isLoading } = useElectricVehicles();
  const [selectedVehicles, setSelectedVehicles] = useState<(ElectricVehicle | null)[]>([null, null, null]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [searchTerms, setSearchTerms] = useState<string[]>(['', '', '']);
  const [dropdownOpen, setDropdownOpen] = useState<boolean[]>([false, false, false]);
  const dropdownRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const userState = useUserStore.getState();
  const isPremium = userState.user?.isPremium || false;
  const isLoggedIn = userState.isLoggedIn;

  // test@test.com kullanıcısının premium özelliklerini kontrol et
  useEffect(() => {
    // Kullanıcı test@test.com ise ve premium değilse, premium yap
    if (isLoggedIn && userState.user?.email === "test@test.com" && !isPremium) {
      // isPremium değerini güncelle
      useUserStore.setState((state) => ({
        user: state.user ? { ...state.user, isPremium: true } : null
      }));
    }
  }, [isLoggedIn, isPremium]);

  const handleVehicleSelect = (vehicle: ElectricVehicle | null, index: number) => {
    const newSelectedVehicles = [...selectedVehicles];
    newSelectedVehicles[index] = vehicle;
    setSelectedVehicles(newSelectedVehicles);

    // Seçim yapıldığında dropdown'ı kapat ve arama terimini temizle
    const newDropdownOpen = [...dropdownOpen];
    newDropdownOpen[index] = false;
    setDropdownOpen(newDropdownOpen);

    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = '';
    setSearchTerms(newSearchTerms);
  };

  const handleVehicleRemove = (index: number) => {
    const newSelectedVehicles = [...selectedVehicles];
    newSelectedVehicles[index] = null;
    setSelectedVehicles(newSelectedVehicles);

    // Arama terimini de temizle
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = '';
    setSearchTerms(newSearchTerms);
  };

  const handleSearchChange = (value: string, index: number) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = value;
    setSearchTerms(newSearchTerms);

    // Arama yapılırken dropdown'ı aç
    const newDropdownOpen = [...dropdownOpen];
    newDropdownOpen[index] = true;
    setDropdownOpen(newDropdownOpen);

    // Arama yapılırken seçili aracı temizlemeyelim, sadece yeni sonuçları gösterelim
  };

  const toggleDropdown = (index: number) => {
    const newDropdownOpen = [...dropdownOpen];
    newDropdownOpen[index] = !newDropdownOpen[index];
    setDropdownOpen(newDropdownOpen);
  };

  // Dışarı tıklanınca dropdown'ı kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      dropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target as Node)) {
          const newDropdownOpen = [...dropdownOpen];
          newDropdownOpen[index] = false;
          setDropdownOpen(newDropdownOpen);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Sayfa yüklendiğinde localStorage'dan kayıtlı karşılaştırma verilerini al
  useEffect(() => {
    if (!isLoading && vehicles && vehicles.length > 0) {
      try {
        const savedVehicleIds = localStorage.getItem('compareVehicles');
        if (savedVehicleIds) {
          const parsedIds = JSON.parse(savedVehicleIds);

          if (Array.isArray(parsedIds) && parsedIds.length > 0) {
            // ID'lere göre gerçek araç nesnelerini bul
            const savedVehicles = parsedIds.map(id =>
              vehicles.find(vehicle => vehicle.id === id) || null
            );

            // En fazla 3 araç seçebiliriz
            const newSelectedVehicles = [...selectedVehicles];
            savedVehicles.forEach((vehicle, index) => {
              if (index < 3) {
                newSelectedVehicles[index] = vehicle;
              }
            });

            setSelectedVehicles(newSelectedVehicles);

            // Karşılaştırma verileri yüklendikten sonra localStorage'ı temizle
            // Bu sayede sayfa yenilendiğinde tekrar aynı veriler yüklenmez
            localStorage.removeItem('compareVehicles');
          }
        }
      } catch (error) {
        console.error('Karşılaştırma verileri yüklenirken hata oluştu:', error);
      }
    }
  }, [isLoading, vehicles]);

  // Premium modal yerine auth modal'ı açma fonksiyonu
  const openAuthModal = () => {
    const event = new Event('show-auth-modal');
    window.dispatchEvent(event);
  };

  const renderVehicleSelector = (index: number) => {
    // 3. slot ve kullanıcı premium değilse premium modal göster
    const isPremiumSlot = index === 3 && !isPremium;
    const filteredVehicles = vehicles?.filter(vehicle =>
      vehicle.brand.toLowerCase().includes(searchTerms[index].toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerms[index].toLowerCase())
    );

    return (
      <div className="relative w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-visible">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              {index + 1}. Araç
            </h3>
          </div>
          <div className="p-4 overflow-visible">
            <div ref={(el) => { dropdownRefs.current[index] = el; }} className="relative w-full overflow-visible">
              <div
                className="flex items-center relative w-full"
              >
                <input
                  type="text"
                  value={selectedVehicles[index] && searchTerms[index] === ''
                    ? `${selectedVehicles[index]?.brand} ${selectedVehicles[index]?.model}`
                    : searchTerms[index]}
                  onChange={(e) => handleSearchChange(e.target.value, index)}
                  onFocus={() => {
                    if (isPremiumSlot && !showPremiumModal) {
                      setShowPremiumModal(true);
                      return;
                    }

                    // Input'a focus yapıldığında search terms'i temizleyelim ki kullanıcı yazabilsin
                    if (selectedVehicles[index]) {
                      const newSearchTerms = [...searchTerms];
                      newSearchTerms[index] = '';
                      setSearchTerms(newSearchTerms);
                    }

                    toggleDropdown(index);
                  }}
                  placeholder="Araç Seçin veya Arayın"
                  className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#660566]/20 
                             focus:border-transparent transition-all duration-200 ${isPremiumSlot && !showPremiumModal ? 'opacity-50' : ''}`}
                  disabled={isPremiumSlot && !showPremiumModal}
                />
                <button
                  className="absolute right-3 text-gray-500 hover:text-gray-700"
                  onClick={() => toggleDropdown(index)}
                  tabIndex={-1}
                  aria-label="Arama menüsünü aç/kapat"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    {dropdownOpen[index] ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    )}
                  </svg>
                </button>
              </div>

              {/* Dropdown Menü */}
              {dropdownOpen[index] && (
                <div className="absolute z-50 top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto mt-1">
                  {filteredVehicles?.length ? (
                    filteredVehicles.map(vehicle => (
                      <div
                        key={vehicle.id}
                        onClick={() => {
                          if (isPremiumSlot && !showPremiumModal) {
                            setShowPremiumModal(true);
                            return;
                          }
                          handleVehicleSelect(vehicle, index);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <span>{vehicle.brand} {vehicle.model}</span>
                          <span className="text-sm text-gray-500">({vehicle.year})</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">Sonuç bulunamadı</div>
                  )}
                </div>
              )}
            </div>

            {selectedVehicles[index] && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {selectedVehicles[index]?.brand} {selectedVehicles[index]?.model}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleVehicleRemove(index)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    aria-label="Aracı kaldır"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {selectedVehicles[index]?.images?.[0] && (
                    <img
                      src={selectedVehicles[index]?.images[0]}
                      alt={`${selectedVehicles[index]?.brand} ${selectedVehicles[index]?.model}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* {isPremiumSlot && !showPremiumModal && (
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
        )} */}
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
                { key: 'chargingTime.acTime', label: 'AC Şarj Süresi', unit: 'saat' },
                { key: 'chargingTime.fastCharging.time10to80', label: 'DC Şarj Süresi', unit: 'dakika' },
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
                { key: 'price.base', label: 'Başlangıç Fiyatı', unit: '' },
              ].map(({ key, label, unit }) => (
                <div key={key} className="grid grid-cols-4 gap-4 py-4 border-t border-gray-100">
                  <div className="font-medium text-gray-900">{label}</div>
                  {selectedVehicles.map((vehicle, index) => {
                    let value = vehicle ? getValue(vehicle, key) : '-';

                    if (key == "price.base" && vehicle) {
                      const price = getValue(vehicle, "price.base")
                      const currency = getValue(vehicle, "price.currency");

                      value = vehicle ? formatCurrency(price, currency) : "-";
                    }
                    return (
                      <div key={index} className="text-gray-600">
                        {value} {value !== '-' ? unit : ''}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Karşılaştırmayı Kaydet Butonu */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
              <button
                onClick={() => {
                  // Kullanıcının giriş yapmış olup olmadığını kontrol et
                  if (!isLoggedIn) {
                    openAuthModal();
                    return;
                  }

                  // Karşılaştırmayı kaydet
                  const vehicles = selectedVehicles.filter(Boolean) as ElectricVehicle[];

                  // localStorage'a karşılaştırma bilgilerini kaydet
                  try {
                    const savedComparisons = localStorage.getItem('savedComparisons');
                    let comparisons = savedComparisons ? JSON.parse(savedComparisons) : [];

                    // Yeni karşılaştırma nesnesi oluştur
                    const newComparison = {
                      id: Date.now().toString(),
                      date: new Date().toISOString(),
                      vehicles: vehicles.map(v => ({
                        id: v.id,
                        brand: v.brand,
                        model: v.model,
                        image: v?.images && v.images?.length > 0 && v.images[0]
                      }))
                    };

                    // Karşılaştırmayı kaydet
                    comparisons.push(newComparison);
                    localStorage.setItem('savedComparisons', JSON.stringify(comparisons));

                    // Kullanıcıya bildir
                    alert('Karşılaştırma kaydedildi! Profil sayfanızdaki "Karşılaştırmalarım" sekmesinden görüntüleyebilirsiniz.');
                  } catch (error) {
                    console.error('Karşılaştırma kaydedilirken hata oluştu:', error);
                    alert('Karşılaştırma kaydedilirken bir hata oluştu.');
                  }
                }}
                className="bg-[#660566] hover:bg-[#4d044d] text-white py-3 px-8 rounded-xl transition-colors duration-200 font-medium focus:outline-none flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Karşılaştırmayı Kaydet
              </button>
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
          <button
            onClick={() => setShowPremiumModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#660566]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#660566]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Premium İçerik</h3>
            <p className="text-gray-600 mb-6">
              Premium üyelik ile 3 aracı aynı anda karşılaştırabilir ve detaylı analizler yapabilirsiniz.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  const event = new Event('show-premium-modal');
                  window.dispatchEvent(event);
                  setShowPremiumModal(false);
                }}
                className="w-full bg-gradient-to-r from-[#660566] to-[#330233] text-white px-4 py-2 rounded-lg font-medium
                       hover:opacity-90 transition-all duration-200"
              >
                Premium Üye Ol
              </button>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full text-gray-600 px-4 py-2 rounded-lg font-medium border border-gray-200
                       hover:bg-gray-50 transition-all duration-200"
              >
                Daha Sonra
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