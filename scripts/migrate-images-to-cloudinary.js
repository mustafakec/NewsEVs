const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Supabase konfigürasyonu
const supabaseUrl = 'https://ifpwpeffddfuljtpchqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcHdwZWZmZGRmdWxqdHBjaHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzE1NzcsImV4cCI6MjA1ODI0NzU3N30.rO4qF2I7AVCeirrFryijJJrHN_KBdHG2hgJXyKZb3_g';
const supabase = createClient(supabaseUrl, supabaseKey);

// Cloudinary konfigürasyonu
cloudinary.config({
  cloud_name: 'dq3affpcx',
  api_key: '111328868914628',
  api_secret: '_kvXVMDCgztaE9tYilJ96CwDBmw',
});

// Görseli Cloudinary'ye yükle
async function uploadToCloudinary(imageUrl, imageId) {
  try {
    console.log(`Yükleniyor: ${imageUrl}`);
    
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: `elektrikli-araclar/image-${imageId}`,
      folder: 'elektrikli-araclar',
      transformation: [
        { quality: 'auto:good', fetch_format: 'auto' },
        { width: 800, height: 600, crop: 'fill' }
      ]
    });
    
    console.log(`Başarıyla yüklendi: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`Yükleme hatası: ${imageUrl}`, error.message);
    return imageUrl; // Hata durumunda orijinal URL'i döndür
  }
}

// Images tablosundaki URL'i güncelle
async function updateImageUrl(imageId, newUrl) {
  try {
    const { error } = await supabase
      .from('images')
      .update({ url: newUrl })
      .eq('id', imageId);
    
    if (error) {
      console.error(`Görsel güncelleme hatası (${imageId}):`, error);
      return false;
    }
    
    console.log(`Görsel güncellendi: ${imageId}`);
    return true;
  } catch (error) {
    console.error(`Görsel güncelleme hatası (${imageId}):`, error);
    return false;
  }
}

// Ana migration fonksiyonu
async function migrateImagesToCloudinary() {
  try {
    console.log('Görsel migration başlatılıyor...');
    
    // Images tablosundaki tüm görselleri çek
    const { data: images, error } = await supabase
      .from('images')
      .select('id, url');
    
    if (error) {
      console.error('Görseller çekilirken hata:', error);
      return;
    }
    
    console.log(`${images.length} görsel bulundu.`);
    
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    for (const image of images) {
      if (!image.url) {
        console.log(`Görsel ${image.id} için URL yok, atlanıyor.`);
        skippedCount++;
        continue;
      }
      
      console.log(`\nGörsel işleniyor: ${image.id}`);
      console.log(`Mevcut URL: ${image.url}`);
      
      // Eğer zaten Cloudinary URL'i ise atla
      if (image.url.includes('cloudinary.com')) {
        console.log(`Görsel zaten Cloudinary'de: ${image.url}`);
        skippedCount++;
        continue;
      }
      
      // Cloudinary'ye yükle
      const cloudinaryUrl = await uploadToCloudinary(image.url, image.id);
      
      // Images tablosunu güncelle
      const success = await updateImageUrl(image.id, cloudinaryUrl);
      
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
      
      // Rate limiting için bekle
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log(`\nMigration tamamlandı!`);
    console.log(`Başarılı: ${successCount}`);
    console.log(`Hatalı: ${errorCount}`);
    console.log(`Atlanan: ${skippedCount}`);
    
  } catch (error) {
    console.error('Migration hatası:', error);
  }
}

// Script'i çalıştır
if (require.main === module) {
  migrateImagesToCloudinary();
}

module.exports = { migrateImagesToCloudinary }; 