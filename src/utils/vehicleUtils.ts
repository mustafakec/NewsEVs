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
    'van': 'Ticari',
    'ticari': 'Ticari',
    'minivan': 'MPV',
    'mpv': 'MPV',
    'station wagon': 'Station Wagon',
    'pickup': 'Pickup',
    'minibüs': 'Otobüs',
    'bus': 'Otobüs',
    'otobüs': 'Otobüs',
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