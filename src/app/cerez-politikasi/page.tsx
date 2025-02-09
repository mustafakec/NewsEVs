'use client';


sadjhas
export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-[#660566]/5 to-white border-b border-[#660566]/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent 
                      bg-gradient-to-r from-[#660566] via-[#330233] to-black
                      mb-4 text-center">
            Çerez Politikası
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
            Web sitemizde kullanılan çerezler hakkında bilgilendirme
          </p>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Giriş */}
          <section className="prose prose-lg max-w-none">
            <p>
              Elektrikliyiz olarak, web sitemizde çerezleri kullanmaktayız. Bu politika, hangi çerezleri 
              kullandığımızı ve bunların nasıl yönetileceğini açıklamaktadır.
            </p>
          </section>

          {/* Bölümler */}
          <section className="space-y-8">
            {/* Çerez Nedir */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Çerez Nedir?</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınıza yerleştirilen küçük metin dosyalarıdır. 
                  Bu dosyalar:
                </p>
                <ul>
                  <li>Oturum yönetimi sağlar</li>
                  <li>Site tercihlerinizi hatırlar</li>
                  <li>Güvenli bir deneyim sunar</li>
                  <li>Site performansını analiz eder</li>
                </ul>
              </div>
            </div>

            {/* Çerez Türleri */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Kullandığımız Çerez Türleri</h2>
              <div className="prose prose-gray max-w-none">
                <h3 className="text-xl font-medium mb-2">Zorunlu Çerezler</h3>
                <p>
                  Web sitemizin temel işlevleri için gerekli olan çerezlerdir. Bunlar olmadan site düzgün çalışmaz.
                </p>

                <h3 className="text-xl font-medium mb-2 mt-6">Performans Çerezleri</h3>
                <p>
                  Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olan analitik çerezlerdir.
                </p>

                <h3 className="text-xl font-medium mb-2 mt-6">İşlevsellik Çerezleri</h3>
                <p>
                  Dil tercihi gibi seçimlerinizi hatırlayan ve size kişiselleştirilmiş bir deneyim sunan çerezlerdir.
                </p>

                <h3 className="text-xl font-medium mb-2 mt-6">Hedefleme/Reklam Çerezleri</h3>
                <p>
                  İlgi alanlarınıza uygun reklamlar sunmak için kullanılan çerezlerdir.
                </p>
              </div>
            </div>

            {/* Çerez Yönetimi */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Çerez Yönetimi</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Tarayıcınızın ayarlarından çerezleri yönetebilirsiniz:
                </p>
                <ul>
                  <li>Tüm çerezleri kabul edebilir</li>
                  <li>Çerez ayarlarını özelleştirebilir</li>
                  <li>Tüm çerezleri reddedebilirsiniz</li>
                </ul>
                <p className="mt-4">
                  Çerezleri reddetmeniz durumunda bazı site özellikleri düzgün çalışmayabilir.
                </p>
              </div>
            </div>

            {/* Üçüncü Taraf Çerezleri */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Üçüncü Taraf Çerezleri</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Web sitemizde üçüncü taraf hizmet sağlayıcılarının çerezleri de kullanılmaktadır:
                </p>
                <ul>
                  <li>Google Analytics - Ziyaretçi analizi için</li>
                  <li>Sosyal medya platformları - Paylaşım özellikleri için</li>
                  <li>Reklam ağları - Kişiselleştirilmiş reklamlar için</li>
                </ul>
              </div>
            </div>

            {/* Veri Koruma */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Veri Koruma</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Çerezler aracılığıyla toplanan verileriniz:
                </p>
                <ul>
                  <li>Güvenli sistemlerde saklanır</li>
                  <li>Yetkisiz erişime karşı korunur</li>
                  <li>Yasal sürelere uygun olarak tutulur</li>
                  <li>KVKK prensiplerine uygun işlenir</li>
                </ul>
                <p className="mt-4">
                  Daha detaylı bilgi için <a href="/gizlilik-politikasi" className="text-[#660566] hover:text-[#330233]">Gizlilik Politikamızı</a> inceleyebilirsiniz.
                </p>
              </div>
            </div>
          </section>

          {/* İletişim */}
          <section className="bg-gradient-to-r from-[#660566] to-[#330233] rounded-2xl p-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Sorularınız mı var?</h2>
              <p className="mb-6">
                Çerez politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz.
              </p>
              <a
                href="/iletisim"
                className="inline-block bg-white text-[#660566] px-6 py-2 rounded-lg font-medium
                       hover:bg-gray-100 transition-colors duration-200"
              >
                İletişime Geç
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 