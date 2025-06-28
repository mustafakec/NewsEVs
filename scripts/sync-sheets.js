#!/usr/bin/env node

// Environment variables'ları yükle
require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });

// Komut satırı argümanlarını al
const args = process.argv.slice(2);
const action = args[0];
const vehicleId = args[1];

async function main() {
  console.log('🚗 Google Sheets - Supabase Senkronizasyon Başlatılıyor...\n');

  try {
    // API endpoint'i çağır
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    let url = `${baseUrl}/api/sync-sheets`;
    let method = 'GET';
    let body = null;

    switch (action) {
      case 'sync-all':
        console.log('📋 Tam senkronizasyon başlatılıyor...');
        method = 'POST';
        body = JSON.stringify({ action: 'sync-all' });
        break;
      
      case 'sync-latest':
        console.log('⚡ Hızlı senkronizasyon başlatılıyor...');
        method = 'GET';
        break;
      
      case 'sync-vehicle':
        if (!vehicleId) {
          console.error('❌ Hata: Araç ID\'si belirtilmedi');
          console.log('Kullanım: node scripts/sync-sheets.js sync-vehicle <vehicle-id>');
          process.exit(1);
        }
        console.log(`🔍 Araç senkronizasyonu başlatılıyor: ${vehicleId}`);
        method = 'POST';
        body = JSON.stringify({ action: 'sync-vehicle', vehicleId });
        break;
      
      default:
        console.log('📖 Kullanım:');
        console.log('  node scripts/sync-sheets.js sync-all          # Tam senkronizasyon');
        console.log('  node scripts/sync-sheets.js sync-latest       # Hızlı senkronizasyon');
        console.log('  node scripts/sync-sheets.js sync-vehicle <id> # Belirli araç senkronizasyonu');
        process.exit(0);
    }

    // API isteği gönder
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body
    });

    const result = await response.json();

    // Sonuçları göster
    console.log('\n📊 Senkronizasyon Sonucu:');
    console.log(`✅ Başarılı: ${result.success ? 'Evet' : 'Hayır'}`);
    console.log(`💬 Mesaj: ${result.message}`);
    
    if (result.data) {
      console.log(`➕ Eklenen Araç: ${result.data.addedCount}`);
      console.log(`🔄 Güncellenen Araç: ${result.data.updatedCount}`);
    }

    if (result.errors && result.errors.length > 0) {
      console.log('\n❌ Hatalar:');
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (result.success) {
      console.log('\n🎉 Senkronizasyon başarıyla tamamlandı!');
    } else {
      console.log('\n⚠️  Senkronizasyon sırasında hatalar oluştu.');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 Beklenmeyen hata:', error);
    process.exit(1);
  }
}

// Scripti çalıştır
main(); 