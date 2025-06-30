const { createClient } = require('@supabase/supabase-js');

// Supabase konfigürasyonu
const supabaseUrl = 'https://ifpwpeffddfuljtpchqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcHdwZWZmZGRmdWxqdHBjaHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzE1NzcsImV4cCI6MjA1ODI0NzU3N30.rO4qF2I7AVCeirrFryijJJrHN_KBdHG2hgJXyKZb3_g';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStructure() {
  try {
    console.log('Veritabanı yapısı kontrol ediliyor...');
    
    // electric_vehicles tablosunun yapısını kontrol et
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'electric_vehicles' });
    
    if (columnsError) {
      console.error('Kolonlar listelenirken hata:', columnsError);
      
      // Alternatif yöntem: Doğrudan tablo sorgusu
      const { data: sampleData, error: sampleError } = await supabase
        .from('electric_vehicles')
        .select('*')
        .limit(1);
      
      if (sampleError) {
        console.error('Tablo erişim hatası:', sampleError);
      return;
    }
    
      if (sampleData && sampleData.length > 0) {
        console.log('\n📊 electric_vehicles tablosu mevcut kolonları:');
        Object.keys(sampleData[0]).forEach(column => {
          console.log(`- ${column}`);
        });
      }
    } else {
    console.log('\n📊 electric_vehicles tablosu kolonları:');
    columns.forEach(column => {
      console.log(`- ${column.column_name} (${column.data_type})`);
    });
    }
    
    // Örnek bir araç verisi çek
    const { data: sampleVehicle, error: sampleError } = await supabase
      .from('electric_vehicles')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.error('Örnek veri çekilirken hata:', sampleError);
      return;
    }
    
    if (sampleVehicle && sampleVehicle.length > 0) {
      console.log('\n📋 Örnek araç verisi:');
      console.log(JSON.stringify(sampleVehicle[0], null, 2));
    } else {
      console.log('\n⚠️ Tabloda hiç veri bulunamadı');
    }
    
    // Tablo sayısını kontrol et
    const { count, error: countError } = await supabase
      .from('electric_vehicles')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Veri sayısı alınırken hata:', countError);
    } else {
      console.log(`\n📊 Toplam araç sayısı: ${count}`);
    }
    
  } catch (error) {
    console.error('Genel hata:', error);
  }
}

checkDatabaseStructure(); 