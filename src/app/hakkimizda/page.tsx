export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-[#660566]/5 to-white border-b border-[#660566]/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent 
                      bg-gradient-to-r from-[#660566] via-[#330233] to-black
                      mb-4 text-center">
            Hakkımızda
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
            Elektrikli araç dünyasının öncü platformu
          </p>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Giriş */}
          <section className="prose prose-lg max-w-none">
            <p>
              Elektrikliyiz, Türkiye'nin elektrikli araç ekosistemini güçlendirmek ve sürdürülebilir ulaşımı 
              desteklemek amacıyla kurulmuş bir platformdur. Elektrikli araç sahipleri, meraklıları ve 
              sektör profesyonellerini bir araya getirerek bilgi paylaşımını ve topluluk oluşumunu teşvik ediyoruz.
            </p>
          </section>

          {/* Misyon & Vizyon */}
          <section className="grid md:grid-cols-2 gap-8">
            {/* Misyon */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="h-12 w-12 bg-gradient-to-br from-[#660566] to-[#330233] rounded-xl mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Misyonumuz</h2>
              <div className="prose prose-gray">
                <p>
                  Elektrikli araç kullanımını yaygınlaştırmak ve sürdürülebilir bir gelecek için toplumu 
                  bilinçlendirmek. Kullanıcılarımıza güvenilir bilgi, destek ve topluluk deneyimi sunarak 
                  elektrikli ulaşımın öncüsü olmak.
                </p>
              </div>
            </div>

            {/* Vizyon */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="h-12 w-12 bg-gradient-to-br from-[#660566] to-[#330233] rounded-xl mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Vizyonumuz</h2>
              <div className="prose prose-gray">
                <p>
                  Türkiye'nin elektrikli araç dönüşümüne öncülük ederek, temiz enerji ve sürdürülebilir 
                  ulaşım konusunda lider platform olmak. Yenilikçi çözümler ve güçlü topluluk yapımızla 
                  sektörün gelişimine katkı sağlamak.
                </p>
              </div>
            </div>
          </section>

          {/* Değerlerimiz */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Değerlerimiz</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="h-12 w-12 bg-gradient-to-br from-[#660566] to-[#330233] rounded-xl mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Güvenilirlik</h3>
                <p className="text-gray-600">
                  Doğru ve güncel bilgiyi şeffaf bir şekilde paylaşmak en önemli önceliğimizdir.
                </p>
              </div>

              <div>
                <div className="h-12 w-12 bg-gradient-to-br from-[#660566] to-[#330233] rounded-xl mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Topluluk</h3>
                <p className="text-gray-600">
                  Kullanıcılarımızın deneyimlerini paylaşabilecekleri güvenli ve samimi bir ortam sunuyoruz.
                </p>
              </div>

              <div>
                <div className="h-12 w-12 bg-gradient-to-br from-[#660566] to-[#330233] rounded-xl mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Yenilikçilik</h3>
                <p className="text-gray-600">
                  Teknolojik gelişmeleri yakından takip ederek platformumuzu sürekli geliştiriyoruz.
                </p>
              </div>
            </div>
          </section>

          {/* İletişim CTA */}
          <section className="bg-gradient-to-r from-[#660566] to-[#330233] rounded-2xl p-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Bize Ulaşın</h2>
              <p className="mb-6">
                Sorularınız veya önerileriniz için bizimle iletişime geçebilirsiniz.
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