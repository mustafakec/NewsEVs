const { createClient } = require('@supabase/supabase-js');

// Supabase konfigürasyonu - diğer script'lerde kullanılan bilgiler
const supabaseUrl = 'https://ifpwpeffddfuljtpchqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcHdwZWZmZGRmdWxqdHBjaHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzE1NzcsImV4cCI6MjA1ODI0NzU3N30.rO4qF2I7AVCeirrFryijJJrHN_KBdHG2hgJXyKZb3_g';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkImagesTable() {
  try {
    console.log('🔍 Images tablosu yapısı kontrol ediliyor...\n');

    // Images tablosundaki tüm verileri çek
    const { data: images, error: imagesError } = await supabase
      .from('images')
      .select('*')
      .limit(5);

    if (imagesError) {
      console.error('❌ Images tablosu veri çekme hatası:', imagesError);
      return;
    }

    console.log('📊 Images tablosu örnek veriler:');
    console.log(JSON.stringify(images, null, 2));

    // Electric vehicles tablosundan örnek veri çek
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('electric_vehicles')
      .select('id, brand, model')
      .limit(3);

    if (vehiclesError) {
      console.error('❌ Electric vehicles tablosu veri çekme hatası:', vehiclesError);
      return;
    }

    console.log('\n📊 Electric vehicles tablosu örnek veriler:');
    console.log(JSON.stringify(vehicles, null, 2));

    // Foreign key constraint testi
    console.log('\n🔗 Foreign key constraint testi...');
    
    // Mevcut olmayan bir vehicle_id ile image eklemeye çalış
    const testImageData = {
      vehicle_id: 'non-existent-vehicle-id',
      url: 'https://test.com/image.jpg'
    };

    const { error: insertError } = await supabase
      .from('images')
      .insert(testImageData);

    if (insertError) {
      console.log('✅ Foreign key constraint aktif!');
      console.log('Hata mesajı:', insertError.message);
      console.log('Hata kodu:', insertError.code);
      console.log('Detaylar:', insertError.details);
    } else {
      console.log('❌ Foreign key constraint aktif değil!');
    }

    // Images tablosundaki unique vehicle_id'leri say
    const { data: uniqueVehicleIds, error: countError } = await supabase
      .from('images')
      .select('vehicle_id')
      .not('vehicle_id', 'is', null);

    if (!countError && uniqueVehicleIds) {
      const uniqueIds = [...new Set(uniqueVehicleIds.map(img => img.vehicle_id))];
      console.log(`\n📈 Images tablosunda ${uniqueVehicleIds.length} toplam kayıt var`);
      console.log(`📈 ${uniqueIds.length} benzersiz vehicle_id var`);
      
      // İlk 10 vehicle_id'yi göster
      console.log('\n🔍 İlk 10 vehicle_id:');
      uniqueIds.slice(0, 10).forEach(id => console.log(`- ${id}`));
    }

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

checkImagesTable(); 