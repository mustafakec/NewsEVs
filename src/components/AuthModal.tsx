"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore(state => state.setUser);
  const router = useRouter();

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
      } else {
        // Register işlemi burada yapılacak
        setError('Kayıt sistemi henüz aktif değil');
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
                    <Image src="/electric.png" alt="Elektrikliyiz Logo" width={42} height={42} className="animate-float" />
                  </div>
                  <Dialog.Title className="text-[22px] font-bold text-gray-900">
                    {mode === 'login' ? 'Hesabınıza Giriş Yapın' : 'Yeni Hesap Oluşturun'}
                  </Dialog.Title>
                </div>

                {/* Mode Selector */}
                <div className="flex gap-3 justify-center mb-6">
                  <button
                    onClick={() => setMode('login')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 text-[13px]
                      ${mode === 'login' 
                        ? 'bg-gradient-to-r from-[#660566] to-[#330233] text-white shadow-lg hover:shadow-xl' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => setMode('register')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 text-[13px]
                      ${mode === 'register' 
                        ? 'bg-gradient-to-r from-[#660566] to-[#330233] text-white shadow-lg hover:shadow-xl' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                  >
                    Kayıt Ol
                  </button>
                </div>

                {/* Google Sign In */}
                <button 
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 
                         rounded-lg px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-5 text-[13px]
                         disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Image src="/google-icon.svg" alt="Google" width={19} height={19} />
                  {mode === 'login' ? 'Google ile Giriş Yap' : 'Google ile Kayıt Ol'}
                </button>

                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-[11px]">
                    <span className="px-2 bg-white text-gray-500">veya e-posta ile devam et</span>
                  </div>
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
                      
                      <div>
                        <label htmlFor="phone" className="block text-[11px] font-medium text-gray-700 mb-1">
                          Telefon Numarası
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="5XX XXX XX XX"
                          pattern="[0-9]{10}"
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
                      className="w-full px-3.5 py-2 text-[13px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#660566] to-[#330233] text-white text-[13px]
                           rounded-lg px-4 py-2.5 font-medium shadow-lg
                           hover:opacity-90 transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    ) : mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                  </button>
                </form>

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
