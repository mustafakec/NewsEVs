import { NextResponse } from 'next/server';

const BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

interface DataPoint {
  timestamp: number;
  price: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const range = searchParams.get('range');
    const interval = searchParams.get('interval');

    if (!symbol || !range || !interval) {
      return NextResponse.json(
        { error: 'Symbol, range ve interval parametreleri gereklidir' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BASE_URL}/${symbol}?range=${range}&interval=${interval}&includePrePost=false`,
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
    if (!data.chart?.result?.[0]?.timestamp || !data.chart?.result?.[0]?.indicators?.quote?.[0]?.close) {
      throw new Error('Geçersiz veri formatı');
    }

    // Geçersiz değerleri filtrele
    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const prices = result.indicators.quote[0].close;
    
    const validData = timestamps.map((timestamp: number, index: number) => {
      const price = prices[index];
      return price !== null && !isNaN(price) ? { timestamp, price } as DataPoint : null;
    }).filter((d: DataPoint | null): d is DataPoint => d !== null);

    if (validData.length === 0) {
      throw new Error('Geçerli veri bulunamadı');
    }

    // Veriyi yeniden yapılandır
    const chartData = {
      chart: {
        result: [{
          timestamp: validData.map((d: DataPoint) => d.timestamp),
          indicators: {
            quote: [{
              close: validData.map((d: DataPoint) => d.price)
            }]
          },
          meta: result.meta
        }]
      }
    };

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Hisse senedi verisi alınırken hata:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 