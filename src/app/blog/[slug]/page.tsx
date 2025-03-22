import { notFound } from 'next/navigation';

interface BlogPost {
  title: string;
  category: string;
  readTime: string;
  publishDate: string;
  content: string;
}

type BlogPosts = {
  [key: string]: BlogPost;
};

// Gerçek uygulamada bu veriler bir CMS veya veritabanından gelecektir
const blogPosts: BlogPosts = {
  // Kullanım Rehberi Kategorisi
  'elektrikli-arac-bakimi': {
    title: 'Elektrikli Araç Bakımı',
    category: 'Kullanım Rehberi',
    readTime: '6 dk',
    publishDate: '10 Kasım 2024',
    content: `
      Elektrikli araçlar, içten yanmalı motorlu araçlara göre daha az bakım gerektirir.
      Ancak düzenli kontrol edilmesi gereken noktalar vardır:

      ## Temel Bakım Noktaları

      1. **Batarya Sağlığı**: Şarj seviyelerini optimum aralıkta tutun
      2. **Fren Sistemi**: Rejeneratif frenleme kontrolü
      3. **Lastikler**: Basınç ve aşınma kontrolü

      ## Periyodik Kontroller

      1. **Aylık Kontroller**: Lastik basıncı, fren sıvısı
      2. **6 Aylık Kontroller**: Süspansiyon, rotlar
      3. **Yıllık Kontroller**: Batarya diagnostiği

      Düzenli bakım, aracınızın ömrünü uzatır ve performansını korur.
    `,
  },
  'ilk-elektrikli-arac-rehberi': {
    title: 'İlk Elektrikli Aracınız İçin Kapsamlı Rehber',
    category: 'Kullanım Rehberi',
    readTime: '12 dk',
    publishDate: '17 Kasım 2024',
    content: `
      Elektrikli araç dünyasına yeni adım atanlar için kapsamlı bir rehber hazırladık.
      İşte bilmeniz gereken temel konular:

      ## Temel Kavramlar

      1. **kWh (Kilowatt Saat)**: Batarya kapasitesini gösteren birim
      2. **Menzil**: Tek şarjla gidilebilecek mesafe
      3. **Şarj Tipleri**: AC ve DC şarj seçenekleri

      ## İlk Kullanım İpuçları

      1. **Şarj Planlaması**: Günlük rutininize göre şarj planı oluşturun
      2. **Sürüş Modları**: Farklı sürüş modlarını öğrenin ve deneyin
      3. **Enerji Takibi**: Enerji tüketimini düzenli kontrol edin

      ## Yaygın Endişeler

      1. **Menzil Kaygısı**: Doğru planlama ile üstesinden gelin
      2. **Şarj İstasyonları**: Güzergah üzerindeki istasyonları önceden belirleyin
      3. **Batarya Ömrü**: Optimum kullanım ile batarya ömrünü uzatın

      Elektrikli araç kullanımı, kısa bir adaptasyon sürecinden sonra çok keyifli hale gelecektir.
    `,
  },
  'regeneratif-frenleme-kullanimi': {
    title: 'Rejeneratif Frenleme: Verimli Kullanım Rehberi',
    category: 'Kullanım Rehberi',
    readTime: '7 dk',
    publishDate: '24 Kasım 2024',
    content: `
      Rejeneratif frenleme, elektrikli araçların en önemli özelliklerinden biridir.
      Bu teknolojiden maksimum verim almak için ipuçları:

      ## Rejeneratif Frenleme Nedir?

      1. **Temel Prensip**: Frenleme enerjisinin elektriğe dönüştürülmesi
      2. **Verimlilik**: %10-20 arası menzil artışı sağlar
      3. **Sistem Çalışması**: Motor jeneratör olarak çalışır

      ## Doğru Kullanım

      1. **Yumuşak Frenleme**: Ani frenlerden kaçının
      2. **Öngörülü Sürüş**: Trafik akışını önceden okuyun
      3. **Mod Seçimi**: Farklı rejenerasyon seviyelerini deneyin

      ## İleri Teknikler

      1. **One Pedal Driving**: Tek pedal kullanımı
      2. **Yokuş Aşağı**: Enerji kazanımını maksimize edin
      3. **Trafik Takibi**: Akıllı mesafe bırakma

      Doğru rejeneratif frenleme kullanımı, menzili önemli ölçüde artırır.
    `,
  },
  'elektrikli-arac-surus-teknikleri': {
    title: 'Elektrikli Araç Sürüş Teknikleri',
    category: 'Kullanım Rehberi',
    readTime: '9 dk',
    publishDate: '1 Aralık 2024',
    content: `
      Elektrikli araç sürüşü, geleneksel araçlardan farklı teknikler gerektirir.
      İşte verimli sürüş için önemli noktalar:

      ## Temel Sürüş Teknikleri

      1. **Ani Hızlanma**: Kontrollü ivmelenme ile enerji tasarrufu
      2. **Momentum Kullanımı**: Aracın atalet enerjisinden faydalanma
      3. **Mesafe Kontrolü**: Güvenli ve verimli takip mesafesi

      ## İleri Sürüş Teknikleri

      1. **Enerji Akış Takibi**: Gösterge panelini etkin kullanma
      2. **Mod Optimizasyonu**: Yol şartlarına göre mod seçimi
      3. **Hız Sabitleyici**: Akıllı kullanım stratejileri

      ## Güvenlik İpuçları

      1. **Sessiz Sürüş**: Yayalara karşı dikkatli olun
      2. **Ağırlık Merkezi**: Düşük ağırlık merkezini göz önünde bulundurun
      3. **Acil Durumlar**: Elektrikli araça özel müdahale yöntemleri

      Doğru sürüş teknikleri hem güvenliği artırır hem de verimliliği maksimize eder.
    `,
  },

  // Verimlilik Kategorisi
  'menzil-optimizasyonu': {
    title: 'Menzil Optimizasyonu: Her Şarjdan Maksimum Verim',
    category: 'Verimlilik',
    readTime: '8 dk',
    publishDate: '8 Aralık 2024',
    content: `
      Elektrikli aracınızdan maksimum menzil almak için kapsamlı öneriler:

      ## Sürüş Alışkanlıkları

      1. **Hız Kontrolü**: Optimum hız aralığını koruyun
      2. **İvmelenme**: Yumuşak hızlanma ve yavaşlama
      3. **Rota Planlaması**: Enerji verimli rotalar seçin

      ## Araç Ayarları

      1. **Eco Mod**: Doğru sürüş modunun seçimi
      2. **Klima Kullanımı**: Akıllı iklimlendirme stratejileri
      3. **Lastik Basıncı**: Düzenli kontrol ve optimizasyon

      ## İleri Teknikler

      1. **Enerji Monitörü**: Tüketim verilerini analiz edin
      2. **Şarj Stratejisi**: Optimum şarj seviyelerini koruyun
      3. **Aerodinamik**: Gereksiz yüklerden kaçının

      Verimli kullanım ile menzili %20'ye kadar artırmak mümkün.
    `,
  },
  'enerji-tasarrufu-taktikleri': {
    title: 'Enerji Tasarrufu: Akıllı Kullanım Taktikleri',
    category: 'Verimlilik',
    readTime: '7 dk',
    publishDate: '15 Aralık 2024',
    content: `
      Elektrikli aracınızın enerji tüketimini optimize etmek için öneriler:

      ## Günlük Kullanım

      1. **Ön Şartlandırma**: Şarjdayken kabini hazırlayın
      2. **Rota Optimizasyonu**: Enerji verimli güzergahlar
      3. **Yük Yönetimi**: Gereksiz ağırlıkları azaltın

      ## Şarj Stratejileri

      1. **Zamanlamalı Şarj**: Uygun tarife saatlerini kullanın
      2. **Şarj Limitleri**: Optimum batarya ömrü için
      3. **Şarj Planlaması**: Günlük rutine göre planlama

      ## Verimlilik İpuçları

      1. **Enerji Geri Kazanımı**: Maksimum rejenerasyon
      2. **Sürüş Modları**: Durum bazlı mod seçimi
      3. **İklimlendirme**: Akıllı klima kullanımı

      Bu taktiklerle enerji tüketimini optimize edebilirsiniz.
    `,
  },
  'batarya-omru-uzatma': {
    title: 'Batarya Ömrünü Uzatma Rehberi',
    category: 'Verimlilik',
    readTime: '10 dk',
    publishDate: '22 Aralık 2024',
    content: `
      Elektrikli aracınızın batarya ömrünü maksimize etmek için öneriler:

      ## Şarj Alışkanlıkları

      1. **Şarj Aralığı**: %20-80 kuralına uyun
      2. **Hızlı Şarj**: Minimum seviyede tutun
      3. **Şarj Sıcaklığı**: Optimum sıcaklık kontrolü

      ## Kullanım İpuçları

      1. **Depolama**: Uzun süreli park stratejileri
      2. **Sıcaklık Yönetimi**: Aşırı sıcak/soğuktan koruma
      3. **Düzenli Kullanım**: Optimum kullanım sıklığı

      ## Batarya Bakımı

      1. **Diagnostik**: Düzenli batarya kontrolü
      2. **Yazılım**: Güncel yazılım takibi
      3. **Servis**: Periyodik bakım planı

      Doğru bakım ile batarya ömrünü uzatmak mümkün.
    `,
  },
  'akilli-sarj-stratejileri': {
    title: 'Akıllı Şarj Stratejileri',
    category: 'Verimlilik',
    readTime: '8 dk',
    publishDate: '29 Aralık 2024',
    content: `
      Elektrikli aracınızı daha akıllı şarj etmek için stratejiler:

      ## Şarj Planlaması

      1. **Tarife Optimizasyonu**: Ucuz elektrik saatleri
      2. **Şarj Programlama**: Akıllı zamanlama
      3. **Şarj Seviyesi**: İhtiyaca göre planlama

      ## Şarj Tipleri

      1. **AC Şarj**: Ev ve ofis şarjı stratejileri
      2. **DC Şarj**: Hızlı şarj kullanım senaryoları
      3. **Destination Charging**: Varış noktası şarjı

      ## Verimli Şarj

      1. **Sıcaklık Kontrolü**: Optimum şarj sıcaklığı
      2. **Şarj Hızı**: Durum bazlı hız seçimi
      3. **Batarya Sağlığı**: Uzun vadeli koruma

      Akıllı şarj stratejileri ile maksimum verim sağlayın.
    `,
  },

  // Mevsimsel Rehber Kategorisi
  'soguk-havalarda-menzil-kaybi': {
    title: 'Soğuk Havalarda Menzil Kaybını Minimize Etme',
    category: 'Mevsimsel Rehber',
    readTime: '8 dk',
    publishDate: '5 Ocak 2025',
    content: `
      Kış aylarında elektrikli araç kullanıcılarının en büyük endişelerinden biri menzil kaybıdır. 
      Soğuk havalarda batarya performansı düşebilir ve ısıtma sistemi ekstra enerji tüketebilir. 
      İşte menzil kaybını minimize etmek için önerilerimiz:

      ## Sürüş Öncesi Hazırlık

      1. **Aracı Şarjda Tutun**: Mümkünse aracınızı kapalı bir alanda park edin ve şarjda tutun.
      2. **Ön Isıtma Kullanın**: Araç şarjdayken yola çıkmadan önce kabini ısıtın.
      3. **Lastik Basıncını Kontrol Edin**: Doğru lastik basıncı, enerji verimliliği için kritiktir.

      ## Sürüş Sırasında

      1. **Eco Modu Kullanın**: Eco sürüş modu, enerji tüketimini optimize eder.
      2. **Kademeli Frenleme**: Rejeneratif frenlemeyi maksimize etmek için yumuşak frenlemeler yapın.
      3. **Hız Kontrolü**: Sabit ve makul bir hızda seyredin.

      ## Kabin İçi Konfor

      1. **Koltuk Isıtma**: Kabin ısıtması yerine koltuk ısıtmayı tercih edin.
      2. **Akıllı Klima Kullanımı**: Otomatik klima yerine manuel kontrol kullanın.
      3. **Yalıtım**: Araç içi yalıtımı güçlendirin.

      ## Batarya Yönetimi

      1. **Şarj Seviyesi**: %20-80 aralığında tutmaya çalışın.
      2. **Hızlı Şarj**: Soğuk havalarda hızlı şarjı minimize edin.
      3. **Şarj Planlaması**: Gece şarjı için zamanlayıcı kullanın.

      Bu önerileri uygulayarak kış aylarında menzil kaybını %15-30 oranında azaltabilirsiniz.
    `,
  },
  'yaz-sicaklarinda-batarya-yonetimi': {
    title: 'Yaz Sıcaklarında Batarya Yönetimi',
    category: 'Mevsimsel Rehber',
    readTime: '7 dk',
    publishDate: '12 Ocak 2025',
    content: `
      Yaz aylarında batarya performansını korumak için öneriler:

      ## Sıcaklık Yönetimi

      1. **Park Stratejisi**: Gölgede park önemli
      2. **Ön Soğutma**: Şarj esnasında kabini soğutun
      3. **Batarya Soğutma**: Sistem kontrolü ve bakımı

      ## Yaz Kullanımı

      1. **Klima Kullanımı**: Verimli soğutma stratejileri
      2. **Şarj Zamanlaması**: Serin saatleri tercih edin
      3. **Havalandırma**: Doğal soğutmadan faydalanın

      ## Performans İpuçları

      1. **Sürüş Modları**: Sıcağa uygun mod seçimi
      2. **Menzil Planlaması**: Sıcak hava faktörünü hesaplayın
      3. **Batarya Kontrolü**: Düzenli durum takibi

      Sıcak havada doğru kullanım batarya ömrünü korur.
    `,
  },
  'bahar-aylarinda-elektrikli-arac': {
    title: 'Bahar Aylarında Elektrikli Araç Kullanımı',
    category: 'Mevsimsel Rehber',
    readTime: '6 dk',
    publishDate: '19 Ocak 2025',
    content: `
      Bahar aylarında elektrikli araç kullanımı için öneriler:

      ## Mevsim Geçişi

      1. **Sistem Kontrolü**: Kış sonrası genel kontrol
      2. **Lastik Değişimi**: Mevsime uygun lastik seçimi
      3. **Batarya Bakımı**: Bahar bakımı önerileri

      ## Verimlilik

      1. **Doğal Havalandırma**: Klima yerine pencere kullanımı
      2. **Rota Planlaması**: Bahar aktivitelerine göre planlama
      3. **Enerji Tasarrufu**: Optimal sürüş koşulları

      ## Bakım İpuçları

      1. **Temizlik**: Kapsamlı bahar temizliği
      2. **Filtre Kontrolü**: Polen filtresi değişimi
      3. **Yazılım**: Sezon güncellemeleri

      Bahar ayları elektrikli araç için ideal mevsimdir.
    `,
  },
  'mevsim-gecislerinde-adaptasyon': {
    title: 'Mevsim Geçişlerinde Adaptasyon Rehberi',
    category: 'Mevsimsel Rehber',
    readTime: '9 dk',
    publishDate: '26 Ocak 2025',
    content: `
      Mevsim geçişlerinde elektrikli aracınızı adapte etme rehberi:

      ## Geçiş Hazırlığı

      1. **Kontrol Listesi**: Mevsimsel kontrol noktaları
      2. **Ekipman Değişimi**: Mevsime uygun ekipman
      3. **Sistem Ayarları**: Mevsimsel mod optimizasyonu

      ## Sürüş Adaptasyonu

      1. **Hava Koşulları**: Değişken hava şartlarına uyum
      2. **Menzil Planlaması**: Mevsimsel faktörleri hesaplama
      3. **Enerji Tüketimi**: Geçiş dönemi stratejileri

      ## Bakım Planı

      1. **Periyodik Kontrol**: Mevsim geçiş kontrolü
      2. **Önleyici Bakım**: Potansiyel sorunları önleme
      3. **Performans İzleme**: Adaptasyon takibi

      Mevsim geçişlerinde doğru adaptasyon önemlidir.
    `,
  },

  // Şarj İpuçları Kategorisi
  'ev-sarj-istasyonu-kurulumu': {
    title: 'Ev Şarj İstasyonu Kurulumu',
    category: 'Şarj İpuçları',
    readTime: '10 dk',
    publishDate: '2 Şubat 2025',
    content: `
      Elektrikli araç sahipleri için ev şarj istasyonu, büyük kolaylık sağlar. 
      İşte ev şarj istasyonu kurulumu hakkında bilmeniz gerekenler:

      ## Temel Gereksinimler

      1. **Elektrik Altyapısı**: Minimum 32A destekleyen elektrik tesisatı
      2. **Montaj Alanı**: Havalandırması iyi olan, korunaklı bir alan
      3. **İzinler**: Belediye ve elektrik dağıtım şirketi onayları

      ## Maliyet Kalemleri

      1. **Şarj Ünitesi**: 15.000 TL - 30.000 TL arası
      2. **Montaj**: 5.000 TL - 10.000 TL arası
      3. **Ek Ekipman**: Kablo, sigorta vb. 2.000 TL - 5.000 TL

      ## Kurulum Süreci

      1. **Ön İnceleme**: Elektrik tesisatının kontrolü
      2. **İzinler**: Gerekli başvuruların yapılması
      3. **Montaj**: Profesyonel ekip tarafından kurulum

      Detaylı bilgi için yetkili servislere danışmanızı öneririz.
    `,
  },
  'halka-acik-sarj-istasyonlari': {
    title: 'Halka Açık Şarj İstasyonları Rehberi',
    category: 'Şarj İpuçları',
    readTime: '8 dk',
    publishDate: '9 Şubat 2025',
    content: `
      Halka açık şarj istasyonlarını verimli kullanma rehberi:

      ## İstasyon Bulma

      1. **Uygulama Kullanımı**: Şarj noktası bulma apps
      2. **Planlama**: Rota üzerinde istasyon belirleme
      3. **Rezervasyon**: Uygun olduğunda önceden rezerve

      ## Verimli Kullanım

      1. **Ödeme Seçenekleri**: Farklı ödeme metodları
      2. **Şarj Hızları**: İstasyon tipine göre planlama
      3. **Bekleme Süresi**: Verimli zaman kullanımı

      ## Pratik İpuçları

      1. **Kablo Uyumluluğu**: Adaptör ihtiyaçları
      2. **İstasyon Etiketleri**: Durum bilgisi kontrolü
      3. **Sorun Giderme**: Yaygın problemler ve çözümler

      Halka açık istasyonları etkin kullanmak önemlidir.
    `,
  },
  'hizli-sarj-teknolojileri': {
    title: 'Hızlı Şarj Teknolojileri ve Kullanımı',
    category: 'Şarj İpuçları',
    readTime: '9 dk',
    publishDate: '16 Şubat 2025',
    content: `
      Hızlı şarj teknolojilerini anlamak ve doğru kullanmak:

      ## Hızlı Şarj Temelleri

      1. **DC Şarj**: Yüksek güç aktarımı
      2. **Güç Seviyeleri**: Farklı hız seçenekleri
      3. **Batarya Etkisi**: Hızlı şarjın etkileri

      ## Doğru Kullanım

      1. **Sıcaklık Kontrolü**: Optimum şarj sıcaklığı
      2. **Şarj Eğrisi**: Güç azalma noktaları
      3. **Kullanım Sıklığı**: Önerilen kullanım aralıkları

      ## Güvenlik

      1. **Kablo Kontrolü**: Fiziksel kontroller
      2. **Soğutma Sistemi**: Sistem performansı
      3. **Acil Durumlar**: Güvenlik prosedürleri

      Hızlı şarj doğru kullanıldığında çok faydalıdır.
    `,
  },
  'sarj-maliyeti-optimizasyonu': {
    title: 'Şarj Maliyeti Optimizasyonu',
    category: 'Şarj İpuçları',
    readTime: '7 dk',
    publishDate: '23 Şubat 2025',
    content: `
      Şarj maliyetlerini minimize etme stratejileri:

      ## Maliyet Analizi

      1. **Tarife Karşılaştırma**: Elektrik tarifeleri
      2. **Şarj Tipleri**: Maliyet farklılıkları
      3. **Abonelikler**: Üyelik avantajları

      ## Tasarruf Stratejileri

      1. **Ev Şarjı**: Gece tarifesi kullanımı
      2. **İstasyon Seçimi**: Fiyat karşılaştırması
      3. **Kampanyalar**: Özel fırsatları takip

      ## Uzun Vadeli Planlama

      1. **Güneş Enerjisi**: Ev sistemi entegrasyonu
      2. **Şarj Planı**: Maliyet odaklı planlama
      3. **Verimlilik**: Tüketim optimizasyonu

      Akıllı şarj stratejileri ile tasarruf mümkün.
    `,
  },
  // Satışlar ve Raporlar Kategorisi
  'elektrikli-arac-satis-verileri-q1-2025': {
    title: 'Elektrikli Araç Satış Verileri - Q1 2025',
    category: 'Satışlar ve Raporlar',
    readTime: '12 dk',
    publishDate: '30 Mart 2025',
    content: `
      2025 yılının ilk çeyreğine ait elektrikli araç satış verilerinin detaylı bir analizi:

      ## Küresel Pazar

      1. **Büyüme Oranı**: Bir önceki yıla göre %25 artış
      2. **Pazar Liderleri**: Marka bazında dağılım
      3. **Segment Analizi**: Araç tiplerine göre satış dağılımı

      ## Türkiye Pazarı

      1. **Satış Hacmi**: 15.000 araç (3 ay toplamı)
      2. **Model Dağılımı**: En çok satılan elektrikli modeller
      3. **Şehir Bazlı Analiz**: İl bazında satış oranları

      ## Trend Analizi

      1. **Fiyat Eğilimi**: Fiyat segmentlerine göre satış dağılımı
      2. **Menzil Etkisi**: Tercih edilen menzil aralıkları
      3. **Teşvik Etkisi**: Devlet teşviklerinin satışlara etkisi

      Elektrikli araç pazarı hızla büyümeye devam ediyor. Türkiye'de özellikle orta segment araçlarda önemli bir artış görülmekte.
    `,
  },
  'avrupa-elektrikli-arac-pazar-raporu': {
    title: 'Avrupa Elektrikli Araç Pazar Raporu',
    category: 'Satışlar ve Raporlar',
    readTime: '15 dk',
    publishDate: '15 Mart 2025',
    content: `
      Avrupa elektrikli araç pazarındaki son gelişmeler ve Türkiye pazarına etkileri:

      ## Avrupa Pazarı Genel Görünüm

      1. **Pazar Büyüklüğü**: 800.000 araç (Çeyrek bazlı)
      2. **Lider Ülkeler**: Norveç, Hollanda, Almanya
      3. **Yeni Düzenlemeler**: Avrupa Birliği emisyon hedefleri

      ## Marka Payları

      1. **Premium Segment**: Marka bazlı pazar payları
      2. **Orta Segment**: En çok satılan modeller
      3. **Ekonomik Segment**: Yeni oyuncuların etkisi

      ## Türkiye'ye Etkiler

      1. **İthalat Trendi**: Avrupa'dan gelen modeller
      2. **Fiyat Politikaları**: Avrupa fiyatlarının yansımaları
      3. **Üretim Yatırımları**: Türkiye'deki üretim planları

      Avrupa'daki elektrikli araç pazarı dinamikleri, Türkiye pazarını doğrudan etkilemeye devam ediyor. Özellikle fiyatlandırma ve model çeşitliliğinde Avrupa trendleri belirleyici oluyor.
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

const BlogContent = ({ content }: { content: string }) => {
  return (
    <div className="prose prose-lg prose-purple max-w-none">
      {content.split('\n').map((paragraph: string, index: number) => {
        const trimmedParagraph = paragraph.trim();
        
        if (!trimmedParagraph) return null;
        
        if (trimmedParagraph.startsWith('##')) {
          return (
            <h2 key={index} className="text-2xl font-semibold mt-8 mb-4">
              {trimmedParagraph.replace('##', '').trim()}
            </h2>
          );
        }
        
        if (trimmedParagraph.match(/^\d+\./)) {
          const items = trimmedParagraph.split('\n').filter(Boolean);
          return (
            <ol key={index} className="list-decimal pl-6 mb-6">
              {items.map((item: string, i: number) => {
                const formattedItem = item
                  .replace(/^\d+\.\s*/, '')
                  .replace(/\*\*([^*]+)\*\*/g, (_, text) => `<strong>${text}</strong>`);
                
                return (
                  <li 
                    key={i} 
                    className="mb-2"
                    dangerouslySetInnerHTML={{ __html: formattedItem }}
                  />
                );
              })}
            </ol>
          );
        }
        
        return (
          <p key={index} className="mb-4">
            {trimmedParagraph}
          </p>
        );
      })}
    </div>
  );
};

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#660566] mb-3">
          <span>{post.category}</span>
          <span>•</span>
          <span>{post.readTime}</span>
          <span>•</span>
          <span>{post.publishDate}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
      </header>

      <BlogContent content={post.content} />
    </article>
  );
} 