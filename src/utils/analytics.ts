export const GA_MEASUREMENT_ID = 'G-SM5XMFGZRM';

// Cookie izni kontrol et
const hasConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('cookieConsent') === 'accepted';
};

// Sayfa görüntüleme olayını gönder
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && hasConsent()) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Özel olay gönder
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag && hasConsent()) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Araç görüntüleme olayı
export const trackVehicleView = (vehicleId: string, vehicleName: string) => {
  event({
    action: 'view_vehicle',
    category: 'vehicle',
    label: vehicleName,
  });
};

// Araç karşılaştırma olayı
export const trackVehicleCompare = (vehicleIds: string[]) => {
  event({
    action: 'compare_vehicles',
    category: 'vehicle',
    label: vehicleIds.join(','),
  });
};

// Arama olayı
export const trackSearch = (searchTerm: string) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
  });
};

// Favori ekleme olayı
export const trackFavoriteAdd = (vehicleId: string, vehicleName: string) => {
  event({
    action: 'add_favorite',
    category: 'engagement',
    label: vehicleName,
  });
}; 