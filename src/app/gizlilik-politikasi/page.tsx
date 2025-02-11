'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-[#660566]/5 to-white border-b border-[#660566]/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent 
                      bg-gradient-to-r from-[#660566] via-[#330233] to-black
                      mb-4 text-center">
            Gizlilik Politikası
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
            Kişisel verilerinizin korunması bizim için önemli
          </p>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Giriş */}
          <section className="prose prose-lg max-w-none">
            <p>
              Elektrikliyiz olarak, kullanıcılarımızın gizliliğini korumayı taahhüt ediyoruz. Bu gizlilik politikası, 
              platformumuzda toplanan, kullanılan ve korunan bilgileri açıklamaktadır.
            </p>
          </section>

          {/* Bölümler */}
          <section className="space-y-8">
            {/* Toplanan Bilgiler */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Toplanan Bilgiler</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Platformumuzda aşağıdaki bilgileri toplayabiliriz:
                </p>
                <ul>
                  <li>Ad, soyad ve iletişim bilgileri</li>
                  <li>Kullanıcı hesap bilgileri</li>
                  <li>Platformdaki aktivite ve tercihler</li>
                  <li>Cihaz ve tarayıcı bilgileri</li>
                  <li>Çerezler aracılığıyla toplanan bilgiler</li>
                </ul>
              </div>
            </div>

            {/* Bilgilerin Kullanımı */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Bilgilerin Kullanımı</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Topladığımız bilgileri aşağıdaki amaçlarla kullanıyoruz:
                </p>
                <ul>
                  <li>Hizmetlerimizi sunmak ve geliştirmek</li>
                  <li>Kullanıcı deneyimini kişiselleştirmek</li>
                  <li>Güvenliği sağlamak</li>
                  <li>İletişim ve bilgilendirme</li>
                  <li>Yasal yükümlülükleri yerine getirmek</li>
                </ul>
              </div>
            </div>

            {/* Bilgi Güvenliği */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Bilgi Güvenliği</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Kişisel verilerinizin güvenliğini sağlamak için aşağıdaki önlemleri alıyoruz:
                </p>
                <ul>
                  <li>SSL şifreleme teknolojisi</li>
                  <li>Güvenli veri depolama sistemleri</li>
                  <li>Düzenli güvenlik güncellemeleri</li>
                  <li>Erişim kontrolü ve yetkilendirme</li>
                  <li>Veri yedekleme ve kurtarma prosedürleri</li>
                </ul>
              </div>
            </div>

            {/* Veri Paylaşımı */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Veri Paylaşımı</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Kişisel verilerinizi üçüncü taraflarla paylaşma konusundaki politikamız:
                </p>
                <ul>
                  <li>Yasal zorunluluklar dışında bilgileriniz paylaşılmaz</li>
                  <li>Hizmet sağlayıcılarla gizlilik sözleşmeleri yapılır</li>
                  <li>Veriler anonim hale getirilerek analiz edilir</li>
                  <li>Kullanıcı onayı olmadan reklam amaçlı paylaşım yapılmaz</li>
                </ul>
              </div>
            </div>

            {/* Kullanıcı Hakları */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Kullanıcı Hakları</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  KVKK kapsamında sahip olduğunuz haklar:
                </p>
                <ul>
                  <li>Kişisel verilerinize erişim hakkı</li>
                  <li>Düzeltme ve silme talep etme hakkı</li>
                  <li>İşleme faaliyetini kısıtlama hakkı</li>
                  <li>Veri taşınabilirliği hakkı</li>
                  <li>İtiraz etme hakkı</li>
                </ul>
                <p>
                  Bu haklarınızı kullanmak için <a href="/iletisim" className="text-[#660566] hover:text-[#330233]">iletişim</a> sayfamızdan 
                  bize ulaşabilirsiniz.
                </p>
              </div>
            </div>

            {/* Güncellemeler */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Politika Güncellemeleri</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Bu gizlilik politikası periyodik olarak güncellenebilir. Önemli değişiklikler olması durumunda 
                  kullanıcılarımızı bilgilendireceğiz. Politikanın son güncellenme tarihi: 11 Şubat 2025
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 