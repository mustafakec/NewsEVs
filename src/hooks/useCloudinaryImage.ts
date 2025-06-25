import { useMemo } from 'react';
import { cloudinaryUtils } from '@/lib/cloudinary';

interface UseCloudinaryImageOptions {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
  responsive?: boolean;
}

interface UseCloudinaryImageReturn {
  optimizedUrl: string;
  responsiveUrls: {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
    original: string;
  };
  isCloudinary: boolean;
}

export const useCloudinaryImage = (
  imageUrl: string | undefined,
  options: UseCloudinaryImageOptions = {}
): UseCloudinaryImageReturn => {
  const {
    width = 800,
    height = 600,
    quality = 'auto:good',
    format = 'auto',
    responsive = false
  } = options;

  const isCloudinary = useMemo(() => {
    return imageUrl?.includes('cloudinary.com') || false;
  }, [imageUrl]);

  const optimizedUrl = useMemo(() => {
    if (!imageUrl) return '/images/car-placeholder.jpg';
    
    if (isCloudinary) {
      return cloudinaryUtils.optimizeImage(imageUrl, {
        width,
        height,
        quality,
        format
      });
    }
    
    return imageUrl;
  }, [imageUrl, isCloudinary, width, height, quality, format]);

  const responsiveUrls = useMemo(() => {
    if (!imageUrl || !isCloudinary) {
      return {
        thumbnail: imageUrl || '/images/car-placeholder.jpg',
        small: imageUrl || '/images/car-placeholder.jpg',
        medium: imageUrl || '/images/car-placeholder.jpg',
        large: imageUrl || '/images/car-placeholder.jpg',
        original: imageUrl || '/images/car-placeholder.jpg'
      };
    }

    return cloudinaryUtils.createResponsiveImages(imageUrl);
  }, [imageUrl, isCloudinary]);

  return {
    optimizedUrl,
    responsiveUrls,
    isCloudinary
  };
};

// Özel kullanım senaryoları için hook'lar
export const useVehicleCardImage = (imageUrl: string | undefined) => {
  return useCloudinaryImage(imageUrl, {
    width: 800,
    height: 450,
    quality: 'auto:good',
    responsive: true
  });
};

export const useVehicleDetailImage = (imageUrl: string | undefined) => {
  return useCloudinaryImage(imageUrl, {
    width: 1200,
    height: 900,
    quality: 'auto:good',
    responsive: true
  });
};

export const useThumbnailImage = (imageUrl: string | undefined) => {
  return useCloudinaryImage(imageUrl, {
    width: 300,
    height: 200,
    quality: 'auto:good',
    responsive: false
  });
}; 