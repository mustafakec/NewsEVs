const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Cloudinary konfigürasyonu
cloudinary.config({
  cloud_name: 'dq3affpcx',
  api_key: '111328868914628',
  api_secret: '_kvXVMDCgztaE9tYilJ96CwDBmw',
});

// Public klasöründeki görselleri Cloudinary'ye yükle
async function uploadPublicImageToCloudinary(filePath, fileName) {
  try {
    console.log(`Yükleniyor: ${fileName}`);
    
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: `public-images/${fileName.replace(/\.[^/.]+$/, '')}`,
      folder: 'public-images',
      transformation: [
        { quality: 'auto:good', fetch_format: 'auto' },
        { width: 800, height: 600, crop: 'fill' }
      ]
    });
    
    console.log(`✅ Başarıyla yüklendi: ${result.secure_url}`);
    return {
      fileName,
      originalPath: filePath,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error(`❌ Yükleme hatası: ${fileName}`, error.message);
    return {
      fileName,
      originalPath: filePath,
      error: error.message
    };
  }
}

// Klasördeki tüm görselleri recursive olarak bul
function findImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // .DS_Store klasörlerini atla
      if (file !== '.DS_Store') {
        findImageFiles(filePath, fileList);
      }
    } else {
      // Sadece görsel dosyalarını al
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
        fileList.push({
          path: filePath,
          name: file,
          relativePath: path.relative('public', filePath)
        });
      }
    }
  });
  
  return fileList;
}

// Ana migration fonksiyonu
async function migratePublicImagesToCloudinary() {
  try {
    console.log('Public klasöründeki görseller Cloudinary\'ye aktarılıyor...');
    
    // Public klasöründeki tüm görselleri bul
    const publicDir = path.join(__dirname, '..', 'public');
    const imageFiles = findImageFiles(publicDir);
    
    console.log(`${imageFiles.length} görsel bulundu.`);
    
    if (imageFiles.length === 0) {
      console.log('Yüklenecek görsel bulunamadı.');
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    // Sonuçları saklamak için
    const results = [];
    
    for (const imageFile of imageFiles) {
      console.log(`\nGörsel işleniyor: ${imageFile.name}`);
      console.log(`Dosya yolu: ${imageFile.path}`);
      
      const result = await uploadPublicImageToCloudinary(imageFile.path, imageFile.name);
      results.push(result);
      
      if (result.error) {
        errorCount++;
      } else {
        successCount++;
      }
      
      // Rate limiting için bekle
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Sonuçları JSON dosyasına kaydet
    const resultsPath = path.join(__dirname, 'public-images-migration-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    
    console.log(`\n🎉 Migration tamamlandı!`);
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log(`📄 Sonuçlar: ${resultsPath}`);
    
    // Başarılı yüklemeleri listele
    console.log('\n📋 Başarıyla yüklenen görseller:');
    results.filter(r => !r.error).forEach(result => {
      console.log(`  - ${result.fileName}: ${result.cloudinaryUrl}`);
    });
    
    // Hataları listele
    if (errorCount > 0) {
      console.log('\n❌ Hata alan görseller:');
      results.filter(r => r.error).forEach(result => {
        console.log(`  - ${result.fileName}: ${result.error}`);
      });
    }
    
  } catch (error) {
    console.error('Migration hatası:', error);
  }
}

// Script'i çalıştır
if (require.main === module) {
  migratePublicImagesToCloudinary();
}

module.exports = { migratePublicImagesToCloudinary }; 