import { NextResponse } from 'next/server';

const BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parametresi gereklidir' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BASE_URL}/${symbol}?interval=1m&range=1d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        next: { revalidate: 60 }, // Her 60 saniyede bir önbelleği yenile
      }
    );

    if (!response.ok) {
      throw new Error('Yahoo Finance API yanıt vermedi');
    }

    const data = await response.json();

    // Veri doğrulama
    if (!data.chart?.result?.[0]) {
      throw new Error('Geçersiz veri formatı');
    }

    const result = data.chart.result[0];
    const quote = result.meta;
    const indicators = result.indicators.quote[0];
    const lastIndex = indicators.close.length - 1;
    
    // Son geçerli fiyatı bul
    let lastValidIndex = lastIndex;
    while (lastValidIndex >= 0 && (indicators.close[lastValidIndex] === null || isNaN(indicators.close[lastValidIndex]))) {
      lastValidIndex--;
    }

    if (lastValidIndex < 0) {
      throw new Error('Geçerli fiyat bulunamadı');
    }

    const currentPrice = indicators.close[lastValidIndex];
    const previousClose = quote.previousClose;
    
    if (typeof currentPrice !== 'number' || typeof previousClose !== 'number') {
      throw new Error('Geçersiz fiyat değerleri');
    }

    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;
    
    return NextResponse.json({
      price: currentPrice,
      change: change,
      changePercent: changePercent,
      previousClose: previousClose,
      timestamp: result.timestamp[lastValidIndex]
    });
  } catch (error) {
    console.error('Hisse senedi fiyat bilgisi alınırken hata:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 