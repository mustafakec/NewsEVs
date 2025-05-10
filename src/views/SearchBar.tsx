"use client";

import { useState } from 'react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Arama işlemi
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className={`
        relative bg-white rounded-2xl shadow-lg transition-all duration-200
        ${isFocused ? 'ring-2 ring-purple-500/20 shadow-purple-500/5' : 'hover:shadow-xl'}
      `}>
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center">
            <div className="absolute left-6">
              <svg
                className={`w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-purple-500' : 'text-gray-400'
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Marka, model veya özellik ara..."
              className="w-full pl-14 pr-36 py-5 text-lg bg-transparent placeholder-gray-400 
                       focus:outline-none text-gray-900"
            />
            <div className="absolute right-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#660566] to-[#330233] text-white px-6 py-2 rounded-lg
                       hover:opacity-90 transition-all duration-200 font-medium"
              >
                Ara
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Popüler aramalar */}
      <div className="mt-4 flex items-center gap-3 text-sm">
        <span className="text-gray-500 font-medium">Popüler:</span>
        <div className="flex flex-wrap gap-2">
          {['Tesla', 'Porsche', 'BMW', '500km+ Menzil'].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setSearchTerm(term)}
              className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-600 rounded-lg border border-gray-200
                       transition-colors duration-200 text-sm focus:outline-none focus:ring-2 
                       focus:ring-purple-500/20 focus:border-transparent"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

