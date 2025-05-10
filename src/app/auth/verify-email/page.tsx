'use client';

import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              E-posta Adresinizi Doğrulayın
            </h2>
            <p className="text-gray-600 mb-6">
              Kayıt işleminizi tamamlamak için e-posta adresinize gönderdiğimiz doğrulama bağlantısına tıklayın.
            </p>
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <p className="text-sm text-gray-500">
                E-posta almadınız mı? Spam klasörünü kontrol edin veya yeni bir doğrulama bağlantısı talep edin.
              </p>
            </div>
            <div className="space-y-4">
              <Link
                href="/auth/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#660566] hover:bg-[#4d044d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#660566]"
              >
                Giriş sayfasına dön
              </Link>
              <Link
                href="/auth/register"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-[#660566] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#660566]"
              >
                Yeni hesap oluştur
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 