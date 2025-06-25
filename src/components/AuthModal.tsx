"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { cloudinaryUtils } from '@/lib/cloudinary';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'resetPassword';
}

// Şifre güçlendirme
type PasswordStrength = 'weak' | 'medium' | 'strong';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'resetPassword'>(initialMode);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('weak');
  const setUser = useUserStore(state => state.setUser);
  const router = useRouter();

  // Şifre gücünü değerlendiren fonksiyon
  const evaluatePasswordStrength = (pass: string): PasswordStrength => {
    // Boş şifre
    if (!pass) return 'weak';

    let score = 0;

    // Minimum 6 karakter
    if (pass.length >= 6) score += 1;

    // Büyük harf içeriyor
    if (/[A-Z]/.test(pass)) score += 1;

    // Küçük harf içeriyor
    if (/[a-z]/.test(pass)) score += 1;

    // Sayı içeriyor
    if (/[0-9]/.test(pass)) score += 1;

    // Skora göre güçlendirme seviyesi belirleme
    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
  };

  // Şifre değiştiğinde gücünü değerlendir
  useEffect(() => {
    setPasswordStrength(evaluatePasswordStrength(password));
  }, [password]);

  // Şifre kriterleri kontrolleri
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (mode === 'login') {
        const user = await authService.login(email, password);

        if (user) {
          setUser(user);
          onClose();
          router.push('/profil');
        }
      } else if (mode === 'register') {
        // Şifre güvenliği kontrolü
        if (passwordStrength === 'weak') {
          setError('Lütfen daha güçlü bir şifre oluşturun');
          return;
        }

        const name = formData.get('name') as string;

        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
        })

        if (data?.user?.id) {
          setError('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
          setTimeout(() => {
            setMode('login');
            setPassword('');
            setError(null);
          }, 2000);
        } else {
          setError('Bir hata oluştu');
        }
      } else if (mode === 'resetPassword') {
        // Şifre sıfırlama işlemi
        if (passwordStrength === 'weak') {
          setError('Lütfen daha güçlü bir şifre oluşturun');
          return;
        }

        // Gerçek bir şifre sıfırlama işlemi burada olacak
        setError('Şifre sıfırlama talebi alındı. E-posta adresinize gönderilen bağlantıyı kontrol edin.');
        setTimeout(() => {
          setMode('login');
          setPassword('');
          setError(null);
        }, 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1001]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="bg-white rounded-xl w-full max-w-[420px] p-6 shadow-xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="text-center mb-5">
                  <div className="flex justify-center mb-3">
                    <Image 
                      src={cloudinaryUtils.getPublicImageUrl('electric.png')} 
                      alt="Elektrikliyiz Logo" 
                      width={42} 
                      height={42} 
                      className="animate-float"
                      unoptimized={true}
                    />
                  </div>
                  <Dialog.Title className="text-[22px] font-bold text-gray-900">
                    {mode === 'login' ? 'Hesabınıza Giriş Yapın' : 'Yeni Hesap Oluşturun'}
                  </Dialog.Title>
                </div>

                {/* Mode Selector */}
                <div className="flex gap-3 justify-center mb-6">
                  <button
                    onClick={() => {
                      setMode('login');
                      setPassword('');
                      setError(null);
                    }}
                    className={`flex-1 px-6 py-2 rounded-lg font-medium transition-all duration-200 text-[13px]
                      ${mode === 'login'
                        ? 'bg-gradient-to-r from-[#660566] to-[#330233] text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => {
                      setMode('register');
                      setPassword('');
                      setError(null);
                    }}
                    className={`flex-1 px-6 py-2 rounded-lg font-medium transition-all duration-200 text-[13px]
                      ${mode === 'register'
                        ? 'bg-gradient-to-r from-[#660566] to-[#330233] text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                  >
                    Kayıt Ol
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  {mode === 'register' && (
                    <>
                      <div>
                        <label htmlFor="name" className="block text-[11px] font-medium text-gray-700 mb-1">
                          Ad Soyad
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="w-full px-3.5 py-2 text-[13px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-[11px] font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3.5 py-2 text-[13px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-[11px] font-medium text-gray-700 mb-1">
                      Şifre
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2 text-[13px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                      disabled={isLoading}
                    />

                    {/* Şifre güvenlik seviyesi (kayıt olurken veya şifremi unuttum kısmında) */}
                    {(mode === 'register' || mode === 'resetPassword') && password && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-1 mb-2">
                          <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'weak' ? 'bg-red-400' :
                            passwordStrength === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                            }`}></div>
                          <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'weak' ? 'bg-gray-200' :
                            passwordStrength === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                            }`}></div>
                          <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'strong' ? 'bg-green-400' : 'bg-gray-200'
                            }`}></div>
                        </div>

                        {/* Şifre kriterleri listesi */}
                        <ul className="text-[11px] text-gray-600 space-y-1 mt-2">
                          <li className="flex items-center">
                            <span className={`mr-1 ${hasMinLength ? 'text-green-500' : 'text-red-500'}`}>
                              {hasMinLength ? '✓' : '✗'}
                            </span>
                            En az 6 karakter
                          </li>
                          <li className="flex items-center">
                            <span className={`mr-1 ${hasUpperCase ? 'text-green-500' : 'text-red-500'}`}>
                              {hasUpperCase ? '✓' : '✗'}
                            </span>
                            En az bir büyük harf
                          </li>
                          <li className="flex items-center">
                            <span className={`mr-1 ${hasLowerCase ? 'text-green-500' : 'text-red-500'}`}>
                              {hasLowerCase ? '✓' : '✗'}
                            </span>
                            En az bir küçük harf
                          </li>
                          <li className="flex items-center">
                            <span className={`mr-1 ${hasNumber ? 'text-green-500' : 'text-red-500'}`}>
                              {hasNumber ? '✓' : '✗'}
                            </span>
                            En az bir rakam
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || (mode === 'register' && passwordStrength === 'weak')}
                    className="w-full bg-gradient-to-r from-[#660566] to-[#330233] text-white text-[13px]
                           rounded-lg px-4 py-2.5 font-medium shadow-lg
                           hover:opacity-90 transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    ) : mode === 'login' ? 'Giriş Yap' : mode === 'resetPassword' ? 'Şifremi Sıfırla' : 'Kayıt Ol'}
                  </button>
                </form>

                {/* Şifremi Unuttum veya Hesap Oluştur linkleri */}
                {mode === 'login' && (
                  <div className="mt-4 text-center text-sm">
                    <button
                      onClick={() => {
                        setMode('resetPassword');
                        setPassword('');
                        setError(null);
                      }}
                      className="text-[#660566] hover:text-[#4d044d] transition-colors text-[12px]"
                    >
                      Şifremi Unuttum
                    </button>
                  </div>
                )}

                {mode === 'resetPassword' && (
                  <div className="mt-4 text-center text-sm">
                    <button
                      onClick={() => {
                        setMode('login');
                        setPassword('');
                        setError(null);
                      }}
                      className="text-[#660566] hover:text-[#4d044d] transition-colors text-[12px]"
                    >
                      Giriş Sayfasına Dön
                    </button>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 
