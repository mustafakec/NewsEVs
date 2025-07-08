'use client';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-[#660566]/5 to-white border-b border-[#660566]/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent 
                      bg-gradient-to-r from-[#660566] via-[#330233] to-black
                      mb-4 text-center">
            Contact
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
            Get in touch with us
          </p>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* İletişim Bilgileri */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center space-y-8">
              {/* E-posta */}
              <div>
                <div className="h-12 w-12 bg-gradient-to-br from-[#660566] to-[#330233] rounded-xl mb-4 mx-auto flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Email</h2>
                <a href="mailto:newsevs.yt@gmail.com" className="text-[#660566] hover:text-[#330233] transition-colors">
                  newsevs.yt@gmail.com
                </a>
              </div>

              {/* Sosyal Medya */}
              <div>
                <div className="h-12 w-12 bg-gradient-to-br from-[#660566] to-[#330233] rounded-xl mb-4 mx-auto flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Media</h2>
                <div className="flex justify-center gap-6">
                  <a
                    href="https://youtube.com/@NewsEVs"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="text-gray-500 hover:text-[#660566] transition-colors text-2xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                      <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.379 3.5 12 3.5 12 3.5s-7.379 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.207 0 12 0 12s0 3.793.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.621 20.5 12 20.5 12 20.5s7.379 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.793 24 12 24 12s0-3.793-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.tiktok.com/@news.evs"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="text-gray-500 hover:text-[#660566] transition-colors text-2xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                      <path d="M12.75 2v14.25a2.25 2.25 0 1 1-2.25-2.25h1.5a.75.75 0 0 0 0-1.5h-1.5A3.75 3.75 0 1 0 14.25 17V8.25a5.25 5.25 0 0 0 4.5 0V6.75a3.75 3.75 0 0 1-3-3.75h-3z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 