// Client-side için Cloudinary URL manipülasyonu
// Server-side upload işlemleri için ayrı bir dosya kullanılacak

// Cloudinary URL generator (client-side)
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dq3affpcx';

// Görsel optimizasyon fonksiyonları (client-side)
export const cloudinaryUtils = {
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
      `f_${format}`
    ].join(',');

    return `${baseUrl}${transformations}/${imageId}`;
  },

  // Thumbnail oluştur
  createThumbnail(url: string, width: number = 300, height: number = 200): string {
    if (!url.includes('cloudinary.com')) {
      return url;
    }

    return this.optimizeImage(url, { width, height });
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

  const params = ['f_auto', 'c_limit', 'w_' + width, 'q_' + (quality || 'auto')];
  return src.replace('/upload/', '/upload/' + params.join(',') + '/');
};

export default cloudinaryUtils; 