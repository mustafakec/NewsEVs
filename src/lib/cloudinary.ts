// Client-side için Cloudinary URL manipülasyonu
// Server-side upload işlemleri için ayrı bir dosya kullanılacak

// Cloudinary URL generator (client-side)
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dq3affpcx';

// Public görseller için Cloudinary URL'leri
const PUBLIC_IMAGES_CLOUDINARY: { [key: string]: string } = {
  'logo.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890466/public-images/public-images/logo.png',
  'electric.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890432/public-images/public-images/electric.png',
  'charging-station.svg': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890428/public-images/public-images/charging-station.png',
  'grid.svg': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890434/public-images/public-images/grid.png',
  'icons/hatchback.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890437/public-images/public-images/hatchback.png',
  'icons/kamyonet.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890439/public-images/public-images/kamyonet.png',
  'icons/motors2.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890441/public-images/public-images/motors2.png',
  'icons/mpv.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890443/public-images/public-images/mpv.png',
  'icons/otobus.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890445/public-images/public-images/otobus.png',
  'icons/pickup.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890447/public-images/public-images/pickup.png',
  'icons/scoot.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890448/public-images/public-images/scoot.png',
  'icons/sedan.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890450/public-images/public-images/sedan.png',
  'icons/spor.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890452/public-images/public-images/spor.png',
  'icons/station-wagon.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890454/public-images/public-images/station-wagon.png',
  'icons/suv.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890456/public-images/public-images/suv.png',
  'icons/tesla.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890458/public-images/public-images/tesla.png',
  'icons/ticari.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890462/public-images/public-images/ticari.png',
  'icons/trugo.png': 'https://res.cloudinary.com/dq3affpcx/image/upload/v1750890464/public-images/public-images/trugo.png'
};

// Görsel optimizasyon fonksiyonları (client-side)
export const cloudinaryUtils = {
  // Public görsel URL'ini al
  getPublicImageUrl(imagePath: string): string {
    // Önce Cloudinary URL'ini kontrol et
    if (PUBLIC_IMAGES_CLOUDINARY[imagePath]) {
      return PUBLIC_IMAGES_CLOUDINARY[imagePath];
    }
    
    // Bulunamazsa orijinal public path'i döndür
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  },

  // Görseli optimize et (mevcut Cloudinary URL'i için)
  optimizeImage(url: string, options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}): string {
    if (!url.includes('cloudinary.com')) {
      return url; // Cloudinary URL değilse orijinal URL'i döndür
    }

    const {
      width = 800,
      height = 600,
      quality = 'auto:good',
      format = 'auto'
    } = options;

    // Cloudinary URL'ini optimize et
    const baseUrl = url.split('/upload/')[0] + '/upload/';
    const imageId = url.split('/upload/')[1];
    
    const transformations = [
      `w_${width}`,
      `h_${height}`,
      `c_fill`,
      `q_${quality}`,
      `f_${format}`,
      `fl_progressive`,
      `fl_force_strip`
    ].join(',');

    return `${baseUrl}${transformations}/${imageId}`;
  },

  // Thumbnail oluştur
  createThumbnail(url: string, width: number = 300, height: number = 200): string {
    if (!url.includes('cloudinary.com')) {
      return url;
    }

    return this.optimizeImage(url, { 
      width, 
      height,
      quality: 'auto:good',
      format: 'auto'
    });
  },

  // Responsive görsel URL'leri oluştur
  createResponsiveImages(url: string): {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
    original: string;
  } {
    if (!url.includes('cloudinary.com')) {
      return {
        thumbnail: url,
        small: url,
        medium: url,
        large: url,
        original: url
      };
    }

    return {
      thumbnail: this.createThumbnail(url, 150, 100),
      small: this.optimizeImage(url, { width: 400, height: 300 }),
      medium: this.optimizeImage(url, { width: 800, height: 600 }),
      large: this.optimizeImage(url, { width: 1200, height: 900 }),
      original: url
    };
  },

  // WebP formatında optimize et
  optimizeForWeb(url: string, width: number = 800, height: number = 600): string {
    if (!url.includes('cloudinary.com')) {
      return url;
    }

    return this.optimizeImage(url, {
      width,
      height,
      quality: 'auto:good',
      format: 'webp'
    });
  },

  // Mobil için optimize et
  optimizeForMobile(url: string): string {
    if (!url.includes('cloudinary.com')) {
      return url;
    }

    return this.optimizeImage(url, {
      width: 400,
      height: 300,
      quality: 'auto:good',
      format: 'auto'
    });
  }
};

// Next.js Image component için Cloudinary loader
export const cloudinaryLoader = ({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) => {
  if (!src.includes('cloudinary.com')) {
    return src;
  }

  const params = [
    'f_auto',
    'c_limit',
    'w_' + width,
    'q_' + (quality || 'auto'),
    'fl_progressive',
    'fl_force_strip'
  ];
  return src.replace('/upload/', '/upload/' + params.join(',') + '/');
};

export default cloudinaryUtils; 