"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Form işlemleri burada yapılacak
  };

  return (
    <div 
      className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Image src="/electric.png" alt="Elektrikliyiz Logo" width={48} height={48} className="animate-float" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Hesabınıza Giriş Yapın' : 'Yeni Hesap Oluşturun'}
          </h2>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => setMode('login')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200
              ${mode === 'login' 
                ? 'bg-gradient-to-r from-[#660566] to-[#330233] text-white shadow-lg hover:shadow-xl' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setMode('register')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200
              ${mode === 'register' 
                ? 'bg-gradient-to-r from-[#660566] to-[#330233] text-white shadow-lg hover:shadow-xl' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Google Sign In */}
        <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 
                       rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-6">
          <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
          {mode === 'login' ? 'Google ile Giriş Yap' : 'Google ile Kayıt Ol'}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">veya e-posta ile devam et</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#660566] to-[#330233] text-white 
                   rounded-lg px-4 py-3 font-medium shadow-lg
                   hover:opacity-90 transition-all duration-200"
          >
            {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AuthModal; 
