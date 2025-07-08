/**
 * Araç tipi normalleştirme yardımcı fonksiyonu
 * Farklı formatlarda yazılmış araç tiplerini standartlaştırır
 */
export const normalizeVehicleType = (type: string): string => {
  // Önce gelen değeri büyük-küçük harf duyarsız hale getir
  const lowerType = type.toLowerCase().trim();
  
  // Basit bir eşleşme tablosu oluştur
  const typeMapping: Record<string, string> = {
    'suv': 'SUV',
    'crossover': 'SUV',
    'cuv': 'SUV',
    'coupe': 'Spor',
    'sportback': 'Spor',
    'sports': 'Spor',
    'spor': 'Spor',
    'cabrio': 'Spor',
    'roadster': 'Spor',
    'sedan': 'Sedan',
    'hatchback': 'Hatchback',
    'van': 'Van',
    'ticari': 'Ticari',
    'commercial': 'Ticari',
    'minivan': 'MPV',
    'mpv': 'MPV',
    'station wagon': 'Station Wagon',
    'stationwagon': 'Station Wagon',
    'pickup': 'Pickup',
    'minibüs': 'Otobüs',
    'minibus': 'Otobüs',
    'bus': 'Otobüs',
    'otobüs': 'Otobüs',
    'otobus': 'Otobüs',
    'truck': 'Kamyonet',
    'kamyonet': 'Kamyonet',
    'motosiklet': 'Motosiklet',
    'motorcycle': 'Motosiklet',
    'moto': 'Motosiklet',
    'scooter': 'Scooter',
    'elektrikli scooter': 'Scooter',
    'e-scooter': 'Scooter'
  };
  
  // Eşleşme varsa, eşleşen tipi döndür
  if (typeMapping[lowerType]) {
    return typeMapping[lowerType];
  }
  
  // Eşleşme bulunamazsa, ilk harf büyük gerisi küçük tipinde format
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

/**
 * String'i URL slug formatına dönüştüren yardımcı fonksiyon
 * Özel karakterleri ve boşlukları temizler, tirelere dönüştürür
 */
export const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')      // Boşlukları tire ile değiştir
    .replace(/\./g, '')        // Noktaları kaldır
    .normalize('NFD')          // Aksanlı karakterleri ayır
    .replace(/[\u0300-\u036f]/g, '') // Aksan işaretlerini kaldır
    .replace(/[^a-z0-9-]/g, ''); // Alfanümerik olmayan karakterleri kaldır
}; 