import { v2 as cloudinary } from 'cloudinary';

// Cloudinary konfigürasyonu (server-side)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dq3affpcx',
  api_key: process.env.CLOUDINARY_API_KEY || '111328868914628',
  api_secret: process.env.CLOUDINARY_API_SECRET || '_kvXVMDCgztaE9tYilJ96CwDBmw',
});

// Server-side Cloudinary işlemleri
export const cloudinaryServer = {
  // Görseli Cloudinary'ye yükle
  async uploadImage(imageUrl: string, publicId?: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        public_id: publicId,
        folder: 'elektrikli-araclar',
        transformation: [
          { quality: 'auto:good', fetch_format: 'auto' },
          { width: 800, height: 600, crop: 'fill' }
        ]
      });
      
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return imageUrl; // Hata durumunda orijinal URL'i döndür
    }
  },

  // Batch upload fonksiyonu
  async uploadMultipleImages(imageUrls: string[]): Promise<string[]> {
    const uploadPromises = imageUrls.map((url, index) => 
      this.uploadImage(url, `vehicle-${Date.now()}-${index}`)
    );
    
    return Promise.all(uploadPromises);
  }
};

export default cloudinaryServer; 