'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useVehicles } from '@/hooks/useVehicles';
import type { ElectricVehicle } from '@/models/ElectricVehicle';
import { toSlug } from '@/utils/vehicleUtils';

const EnhancedSearchBar = () => {
  const router = useRouter();
  const { data: vehicles = [] } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrelenmiş önerileri hesapla
  const filteredSuggestions = searchTerm.length > 1
    ? vehicles
      .filter(vehicle =>
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5)
    : [];

  // Son aramaları localStorage'dan yükle
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Son aramayı kaydet
  const saveSearch = (term: string) => {
    if (!term.trim()) return;

    const updatedSearches = [
      term,
      ...recentSearches.filter(s => s !== term)
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Dışarı tıklandığında önerileri kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    // Son aramayı kaydet
    saveSearch(searchTerm);

    // Tam eşleşme kontrolü
    if (vehicles && vehicles.length > 0 && searchTerm.length > 2) {
      const searchLower = searchTerm.toLowerCase().trim();

      // Tam eşleşme kontrolü (marka + model)
      const exactMatch = vehicles.find(vehicle =>
        `${vehicle.brand} ${vehicle.model}`.toLowerCase() === searchLower
      );

      // Marka kontrolü
      const brandMatch = vehicles.find(vehicle =>
        vehicle.brand.toLowerCase() === searchLower
      );

      // Model kontrolü
      const modelMatch = vehicles.find(vehicle =>
        vehicle.model.toLowerCase() === searchLower
      );

      // İçeren kontrolü - sadece marka ve model
      const containsMatches = vehicles.filter(vehicle =>
        `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(searchLower) ||
        vehicle.brand.toLowerCase().includes(searchLower) ||
        vehicle.model.toLowerCase().includes(searchLower)
      );

      // Tam eşleşme varsa direkt araç detay sayfasına yönlendir
      if (exactMatch) {
        const slug = toSlug(`${exactMatch.brand}-${exactMatch.model}`);
        router.push(`/elektrikli-araclar/${slug}`);
        return;
      }

      // Sadece bir marka eşleşmesi varsa ve o markaya ait tek bir araç varsa
      if (brandMatch && vehicles.filter(v => v.brand.toLowerCase() === searchLower).length === 1) {
        const slug = toSlug(`${brandMatch.brand}-${brandMatch.model}`);
        router.push(`/elektrikli-araclar/${slug}`);
        return;
      }

      // Model ile tam eşleşme varsa ve birden fazla değilse
      if (modelMatch && vehicles.filter(v => v.model.toLowerCase() === searchLower).length === 1) {
        const slug = toSlug(`${modelMatch.brand}-${modelMatch.model}`);
        router.push(`/elektrikli-araclar/${slug}`);
        return;
      }

      // İçeren şeklinde tek bir eşleşme varsa
      if (containsMatches.length === 1) {
        const slug = toSlug(`${containsMatches[0].brand}-${containsMatches[0].model}`);
        router.push(`/elektrikli-araclar/${slug}`);
        return;
      }
    }

    // Eşleşme yoksa veya birden fazla sonuç varsa, arama sayfasına yönlendir
    router.push(`/elektrikli-araclar?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleSuggestionClick = (vehicle: ElectricVehicle) => {
    try {
      // Son aramayı kaydet
      saveSearch(`${vehicle.brand} ${vehicle.model}`);

      // Araç adını URL uyumlu slug formatına dönüştür
      const slug = toSlug(`${vehicle.brand}-${vehicle.model}`);


      // Yönlendirme işlemi
      router.push(`/elektrikli-araclar/${slug}`);

      // UI güncelleme
      setShowSuggestions(false);
    } catch (error) {
      // Hata durumunda alternatif yönlendirme
      router.push('/elektrikli-araclar');
    }
  };

  const handlePopularClick = (term: string) => {
    // Önce arama terimini set et
    setSearchTerm(term);

    // Son aramayı kaydet
    saveSearch(term);

    // Tam eşleşme kontrolü
    if (vehicles && vehicles.length > 0 && term.length > 2) {
      const searchLower = term.toLowerCase().trim();

      // Tam eşleşme kontrolü (marka + model)
      const exactMatch = vehicles.find(vehicle =>
        `${vehicle.brand} ${vehicle.model}`.toLowerCase() === searchLower
      );

      // Marka kontrolü
      const brandMatch = vehicles.find(vehicle =>
        vehicle.brand.toLowerCase() === searchLower
      );

      // Model kontrolü
      const modelMatch = vehicles.find(vehicle =>
        vehicle.model.toLowerCase() === searchLower
      );

      // İçeren kontrolü - sadece marka ve model
      const containsMatches = vehicles.filter(vehicle =>
        `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(searchLower) ||
        vehicle.brand.toLowerCase().includes(searchLower) ||
        vehicle.model.toLowerCase().includes(searchLower)
      );

      // Tam eşleşme varsa direkt araç detay sayfasına yönlendir
      if (exactMatch) {
        const slug = toSlug(`${exactMatch.brand}-${exactMatch.model}`);
        router.push(`/elektrikli-araclar/${slug}`);
        return;
      }

      // Sadece bir marka eşleşmesi varsa ve o markaya ait tek bir araç varsa
      if (brandMatch && vehicles.filter(v => v.brand.toLowerCase() === searchLower).length === 1) {
        const slug = toSlug(`${brandMatch.brand}-${brandMatch.model}`);
        router.push(`/elektrikli-araclar/${slug}`);
        return;
      }

      // Model ile tam eşleşme varsa ve birden fazla değilse
      if (modelMatch && vehicles.filter(v => v.model.toLowerCase() === searchLower).length === 1) {
        const slug = toSlug(`${modelMatch.brand}-${modelMatch.model}`);
        router.push(`/elektrikli-araclar/${slug}`);
        return;
      }

      // İçeren şeklinde tek bir eşleşme varsa
      if (containsMatches.length === 1) {
        const slug = toSlug(`${containsMatches[0].brand}-${containsMatches[0].model}`);
        router.push(`/elektrikli-araclar/${slug}`);
        return;
      }
    }

    // Eşleşme yoksa veya birden fazla sonuç varsa, arama sayfasına yönlendir
    router.push(`/elektrikli-araclar?search=${encodeURIComponent(term)}`);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  return (
    <div className="relative max-w-3xl mx-auto" ref={searchContainerRef}>
      {/* Ana Arama Kutusu */}
      <div
        className={`
          relative bg-white rounded-2xl shadow-lg transition-all duration-300
          ${isFocused ? 'ring-4 ring-purple-500/20 shadow-purple-500/10 scale-[1.02]' : 'hover:shadow-xl'}
        `}
      >
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center">
            <div className="absolute left-6">
              <motion.svg
                animate={{
                  scale: isFocused ? 1.1 : 1,
                  rotate: isFocused ? [0, 15, 0] : 0
                }}
                transition={{ duration: 0.3 }}
                className={`w-6 h-6 transition-colors duration-200 ${isFocused ? 'text-purple-600' : 'text-gray-400'
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </motion.svg>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleInputFocus}
              placeholder="Marka veya model ara"
              className="w-full pl-16 pr-36 py-6 text-lg bg-transparent placeholder-gray-400 
                       focus:outline-none text-gray-900 rounded-2xl"
              aria-label="Elektrikli araç ara"
              tabIndex={0}
            />

            <div className="absolute right-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="bg-gradient-to-r from-[#660566] to-[#330233] text-white px-8 py-3 rounded-xl
                       hover:opacity-90 transition-all duration-200 font-medium flex items-center gap-2
                       shadow-md hover:shadow-lg"
                aria-label="Araç ara"
                tabIndex={0}
              >
                <span>Ara</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
            </div>
          </div>
        </form>
      </div>

      {/* Öneri ve Son Aramalar Kutusu */}
      <AnimatePresence>
        {showSuggestions && (searchTerm.length > 1 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* Öneriler */}
            {filteredSuggestions.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-2 text-sm font-medium text-gray-500 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Öneriler</span>
                </div>
                <div className="space-y-1">
                  {filteredSuggestions.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => handleSuggestionClick(vehicle)}
                      className="w-full text-left px-4 py-3 hover:bg-purple-50 rounded-lg flex items-center gap-3 transition-colors duration-150 border border-transparent hover:border-purple-100"
                      tabIndex={0}
                    >
                      <div className="w-10 h-10 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-gray-900 font-medium">{vehicle.brand} {vehicle.model}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span>{vehicle.type}</span>
                          <span className="mx-1">•</span>
                          <span>{vehicle.range} km</span>
                          <span className="mx-1">•</span>
                          <span>{vehicle.batteryCapacity} kWh</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Son Aramalar */}
            {recentSearches.length > 0 && (
              <div className="p-2 border-t border-gray-100">
                <div className="px-3 py-2 text-sm font-medium text-gray-500 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Son Aramalar</span>
                  </div>
                  <button
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem('recentSearches');
                    }}
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Temizle
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // Arama terimini ayarla
                        setSearchTerm(search);

                        // Akıllı yönlendirme mantığı
                        if (vehicles && vehicles.length > 0 && search.length > 2) {
                          const searchLower = search.toLowerCase().trim();

                          // Tam eşleşme kontrolü (marka + model)
                          const exactMatch = vehicles.find(vehicle =>
                            `${vehicle.brand} ${vehicle.model}`.toLowerCase() === searchLower
                          );

                          // Marka kontrolü
                          const brandMatch = vehicles.find(vehicle =>
                            vehicle.brand.toLowerCase() === searchLower
                          );

                          // Model kontrolü
                          const modelMatch = vehicles.find(vehicle =>
                            vehicle.model.toLowerCase() === searchLower
                          );

                          // İçeren kontrolü
                          const containsMatches = vehicles.filter(vehicle =>
                            `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(searchLower) ||
                            vehicle.brand.toLowerCase().includes(searchLower) ||
                            vehicle.model.toLowerCase().includes(searchLower)
                          );

                          // Tam eşleşme varsa direkt araç detay sayfasına yönlendir
                          if (exactMatch) {
                            const slug = toSlug(`${exactMatch.brand}-${exactMatch.model}`);
                            router.push(`/elektrikli-araclar/${slug}`);
                            return;
                          }

                          // Sadece bir marka eşleşmesi varsa ve o markaya ait tek bir araç varsa
                          if (brandMatch && vehicles.filter(v => v.brand.toLowerCase() === searchLower).length === 1) {
                            const slug = toSlug(`${brandMatch.brand}-${brandMatch.model}`);
                            router.push(`/elektrikli-araclar/${slug}`);
                            return;
                          }

                          // Model ile tam eşleşme varsa ve birden fazla değilse
                          if (modelMatch && vehicles.filter(v => v.model.toLowerCase() === searchLower).length === 1) {
                            const slug = toSlug(`${modelMatch.brand}-${modelMatch.model}`);
                            router.push(`/elektrikli-araclar/${slug}`);
                            return;
                          }

                          // İçeren şeklinde tek bir eşleşme varsa
                          if (containsMatches.length === 1) {
                            const slug = toSlug(`${containsMatches[0].brand}-${containsMatches[0].model}`);
                            router.push(`/elektrikli-araclar/${slug}`);
                            return;
                          }
                        }

                        // Eşleşme yoksa veya birden fazla sonuç varsa, arama sayfasına yönlendir
                        router.push(`/elektrikli-araclar?search=${encodeURIComponent(search)}`);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-purple-50 rounded-lg flex items-center gap-3 transition-colors duration-150 border border-transparent hover:border-purple-100"
                      tabIndex={0}
                    >
                      <div className="w-8 h-8 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popüler aramalar */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-gray-500 font-medium text-sm">Popüler:</span>
        <div className="flex flex-wrap gap-2">
          {['Tesla', 'BMW', 'Porsche', 'Volkswagen', 'Hyundai', 'Mercedes-Benz', 'Audi'].map((term) => (
            <motion.button
              key={term}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => handlePopularClick(term)}
              className="px-3 py-1.5 bg-white hover:bg-purple-50 text-gray-700 rounded-lg border border-gray-200
                       hover:border-purple-300 transition-all duration-200 text-sm focus:outline-none 
                       focus:ring-2 focus:ring-purple-500/20 focus:border-transparent shadow-sm"
              tabIndex={0}
            >
              {term}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchBar; 