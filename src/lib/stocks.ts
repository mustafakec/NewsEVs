'use client';

const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export interface StockData {
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  timestamp: number;
  marketState: string;
  currency: string;
}

export interface ChartData {
  timestamp: number[];
  prices: number[];
  meta: any;
}

// Statik veri
const mockStockData: Record<string, StockData> = {
  'TSLA': {
    price: 193.57,
    change: 4.25,
    changePercent: 2.24,
    previousClose: 189.32,
    timestamp: Math.floor(Date.now() / 1000),
    marketState: 'REGULAR',
    currency: 'USD'
  },
  'NIO': {
    price: 6.24,
    change: -0.18,
    changePercent: -2.81,
    previousClose: 6.42,
    timestamp: Math.floor(Date.now() / 1000),
    marketState: 'REGULAR',
    currency: 'USD'
  },
  'XPEV': {
    price: 9.85,
    change: 0.32,
    changePercent: 3.36,
    previousClose: 9.53,
    timestamp: Math.floor(Date.now() / 1000),
    marketState: 'REGULAR',
    currency: 'USD'
  },
  'RIVN': {
    price: 12.45,
    change: -0.55,
    changePercent: -4.23,
    previousClose: 13.00,
    timestamp: Math.floor(Date.now() / 1000),
    marketState: 'REGULAR',
    currency: 'USD'
  },
  'LCID': {
    price: 3.28,
    change: -0.12,
    changePercent: -3.53,
    previousClose: 3.40,
    timestamp: Math.floor(Date.now() / 1000),
    marketState: 'REGULAR',
    currency: 'USD'
  }
};

// Rastgele fiyat değişimi oluştur
function generateRandomPrice(basePrice: number, volatility: number = 0.02): number {
  const change = basePrice * volatility * (Math.random() - 0.5);
  return basePrice + change;
}

// Geçmiş veri oluştur
function generateHistoricalData(symbol: string, days: number): ChartData {
  const basePrice = mockStockData[symbol].price;
  const now = Math.floor(Date.now() / 1000);
  const timestamps: number[] = [];
  const prices: number[] = [];
  let currentPrice = basePrice;

  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60);
    timestamps.push(timestamp);
    currentPrice = generateRandomPrice(currentPrice);
    prices.push(currentPrice);
  }

  return {
    timestamp: timestamps,
    prices: prices,
    meta: {
      symbol,
      currency: 'USD'
    }
  };
}

export async function getStockQuote(symbol: string): Promise<StockData> {
  // Simüle edilmiş gecikme
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const data = mockStockData[symbol];
  if (!data) {
    throw new Error('Hisse verisi bulunamadı');
  }

  // Fiyatı rastgele güncelle
  const newPrice = generateRandomPrice(data.price);
  const change = newPrice - data.previousClose;
  const changePercent = (change / data.previousClose) * 100;

  return {
    ...data,
    price: newPrice,
    change,
    changePercent,
    timestamp: Math.floor(Date.now() / 1000)
  };
}

export async function getStockChart(
  symbol: string,
  resolution: string = 'D',
  from: number = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000),
  to: number = Math.floor(Date.now() / 1000)
): Promise<ChartData> {
  // Simüle edilmiş gecikme
  await new Promise(resolve => setTimeout(resolve, 500));

  const days = Math.ceil((to - from) / (24 * 60 * 60));
  return generateHistoricalData(symbol, days);
} 