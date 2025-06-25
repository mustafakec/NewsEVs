const cloudinary = require('cloudinary').v2;

// Cloudinary konfigürasyonu
cloudinary.config({
  cloud_name: 'dq3affpcx',
  api_key: '111328868914628',
  api_secret: '_kvXVMDCgztaE9tYilJ96CwDBmw',
});

async function testCloudinary() {
  try {
    console.log('Cloudinary bağlantısı test ediliyor...');
    
    // Test upload - daha güvenilir bir test görseli
    const testImageUrl = 'https://picsum.photos/100/100';
    
    const result = await cloudinary.uploader.upload(testImageUrl, {
      public_id: 'test-upload',
      folder: 'elektrikli-araclar',
      transformation: [
        { quality: 'auto:good', fetch_format: 'auto' },
        { width: 100, height: 100, crop: 'fill' }
      ]
    });
    
    console.log('✅ Cloudinary bağlantısı başarılı!');
    console.log('Upload edilen görsel URL:', result.secure_url);
    
    // Test görselini sil
    await cloudinary.uploader.destroy('elektrikli-araclar/test-upload');
    console.log('✅ Test görseli silindi');
    
    return true;
  } catch (error) {
    console.error('❌ Cloudinary bağlantı hatası:', error.message);
    return false;
  }
}

// Test'i çalıştır
testCloudinary().then(success => {
  if (success) {
    console.log('\n🎉 Cloudinary hazır! Migration başlatılabilir.');
  } else {
    console.log('\n❌ Cloudinary konfigürasyonu kontrol edilmeli.');
  }
  process.exit(success ? 0 : 1);
}); 