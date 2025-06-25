const { createClient } = require('@supabase/supabase-js');

// Supabase konfigürasyonu
const supabaseUrl = 'https://ifpwpeffddfuljtpchqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcHdwZWZmZGRmdWxqdHBjaHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzE1NzcsImV4cCI6MjA1ODI0NzU3N30.rO4qF2I7AVCeirrFryijJJrHN_KBdHG2hgJXyKZb3_g';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStructure() {
  try {
    console.log('Veritabanı yapısı kontrol ediliyor...');
    
    // Önce tabloları listele
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Tablolar listelenirken hata:', tablesError);
      return;
    }
    
    console.log('\n📋 Mevcut tablolar:');
    tables.forEach(table => {
      console.log(`- ${table.table_name}`);
    });
    
    // electric_vehicles tablosunun yapısını kontrol et
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_schema', 'public')
      .eq('table_name', 'electric_vehicles');
    
    if (columnsError) {
      console.error('Kolonlar listelenirken hata:', columnsError);
      return;
    }
    
    console.log('\n📊 electric_vehicles tablosu kolonları:');
    columns.forEach(column => {
      console.log(`- ${column.column_name} (${column.data_type})`);
    });
    
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
      console.log('\n📝 Örnek araç verisi:');
      console.log(JSON.stringify(sampleVehicle[0], null, 2));
    } else {
      console.log('\n❌ electric_vehicles tablosunda veri yok');
    }
    
  } catch (error) {
    console.error('Genel hata:', error);
  }
}

// Script'i çalıştır
checkDatabaseStructure(); 