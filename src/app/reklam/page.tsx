export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-[#660566]/5 to-white border-b border-[#660566]/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent 
                      bg-gradient-to-r from-[#660566] via-[#330233] to-black
                      mb-4 text-center">
            Reklam ve İş Birliği
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
            Markanızı elektrikli araç tutkunlarıyla buluşturun
          </p>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Giriş */}
          <section className="prose prose-lg max-w-none">
            <p>
              Elektrikliyiz, Türkiye'nin en büyük elektrikli araç topluluğuna ev sahipliği yapan bir platformdur. 
              Markanızı hedef kitlenizle buluşturmak için çeşitli reklam ve iş birliği fırsatları sunuyoruz.
            </p>
          </section>

          {/* Reklam Seçenekleri */}
          <section className="grid md:grid-cols-2 gap-8">
            {/* Banner Reklamları */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="h-12 w-12 bg-gradient-to-br from-[#660566] to-[#330233] rounded-xl mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Banner Reklamları</h2>
              <div className="prose prose-gray">
                <ul>
                  <li>Ana sayfa banner alanları</li>
                  <li>Kategori sayfaları</li>
                  <li>İçerik sayfaları</li>
                  <li>Mobil uyumlu görünüm</li>
                </ul>
              </div>
            </div>

            {/* Sponsorlu İçerik */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="h-12 w-12 bg-gradient-to-br from-[#660566] to-[#330233] rounded-xl mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sponsorlu İçerik</h2>
              <div className="prose prose-gray">
                <ul>
                  <li>Özel içerik üretimi</li>
                  <li>Video incelemeler</li>
                  <li>Ürün tanıtımları</li>
                  <li>Marka hikayeleri</li>
                </ul>
              </div>
            </div>

            {/* E-posta Pazarlama */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="h-12 w-12 bg-gradient-to-br from-[#660566] to-[#330233] rounded-xl mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">E-posta Pazarlama</h2>
              <div className="prose prose-gray">
                <ul>
                  <li>Özel e-bültenler</li>
                  <li>Hedefli kampanyalar</li>
                  <li>Ürün duyuruları</li>
                  <li>Etkinlik bildirimleri</li>
                </ul>
              </div>
            </div>

            {/* Sosyal Medya */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="h-12 w-12 bg-gradient-to-br from-[#660566] to-[#330233] rounded-xl mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sosyal Medya</h2>
              <div className="prose prose-gray">
                <ul>
                  <li>Sponsorlu paylaşımlar</li>
                  <li>Influencer iş birlikleri</li>
                  <li>Canlı yayınlar</li>
                  <li>Sosyal medya kampanyaları</li>
                </ul>
              </div>
            </div>
          </section>

          {/* İletişim CTA */}
          <section className="bg-gradient-to-r from-[#660566] to-[#330233] rounded-2xl p-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Reklam vermek ister misiniz?</h2>
              <p className="mb-6">
                Size özel reklam çözümleri için bizimle iletişime geçin.
              </p>
              <a
                href="mailto:info@elektrikliyiz.com"
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