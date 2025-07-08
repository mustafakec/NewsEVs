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
            Privacy Policy
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
            Protecting your personal data is important to us
          </p>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Giriş */}
          <section className="prose prose-lg max-w-none">
            <p>
              At NewsEVs, we are committed to protecting the privacy of our users. This privacy policy explains the information collected, used, and protected on our platform.
            </p>
          </section>

          {/* Bölümler */}
          <section className="space-y-8">
            {/* Toplanan Bilgiler */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  We may collect the following information on our platform:
                </p>
                <ul>
                  <li>Name, surname, and contact information</li>
                  <li>User account information</li>
                  <li>Platform activity and preferences</li>
                  <li>Device and browser information</li>
                  <li>Information collected via cookies</li>
                </ul>
              </div>
            </div>

            {/* Bilgilerin Kullanımı */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Information</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  We use the information we collect for the following purposes:
                </p>
                <ul>
                  <li>To provide and improve our services</li>
                  <li>To personalize user experience</li>
                  <li>To ensure security</li>
                  <li>To communicate and inform</li>
                  <li>To fulfill legal obligations</li>
                </ul>
              </div>
            </div>

            {/* Bilgi Güvenliği */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Security</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  We take the following measures to ensure the security of your personal data:
                </p>
                <ul>
                  <li>SSL encryption technology</li>
                  <li>Secure data storage systems</li>
                  <li>Regular security updates</li>
                  <li>Access control and authorization</li>
                  <li>Data backup and recovery procedures</li>
                </ul>
              </div>
            </div>

            {/* Veri Paylaşımı */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Our policy on sharing your personal data with third parties:
                </p>
                <ul>
                  <li>Your information is not shared except where legally required</li>
                  <li>Confidentiality agreements with service providers</li>
                  <li>Data is anonymized for analysis</li>
                  <li>No advertising sharing without user consent</li>
                </ul>
              </div>
            </div>

            {/* Kullanıcı Hakları */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Rights</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Your rights under GDPR:
                </p>
                <ul>
                  <li>Right to access your personal data</li>
                  <li>Right to request correction and deletion</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object</li>
                </ul>
                <p>
                  To exercise these rights, you can contact us via our <a href="/contact" className="text-[#660566] hover:text-[#330233]">contact</a> page.
                </p>
              </div>
            </div>

            {/* Güncellemeler */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Policy Updates</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  This privacy policy may be updated periodically. In case of significant changes, we will inform our users. Last updated: February 11, 2025
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 