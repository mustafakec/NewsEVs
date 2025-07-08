'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  type ChartOptions,
  type ScaleOptions,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { tr } from 'date-fns/locale';
import { getStockChart, getStockQuote } from '@/lib/stocks';
import type { StockData, ChartData } from '@/lib/stocks';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface Stock {
  symbol: string;
  name: string;
  logo?: string;
}

const stocks: Stock[] = [
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NIO', name: 'NIO Inc.' },
  { symbol: 'XPEV', name: 'XPeng Inc.' },
  { symbol: 'RIVN', name: 'Rivian' },
  { symbol: 'LCID', name: 'Lucid Group' }
];

interface TimeRange {
  label: string;
  value: string;
  resolution: string;
  days: number;
}

const timeRanges: TimeRange[] = [
  { label: '1G', value: '1G', resolution: '5', days: 1 },
  { label: '7G', value: '7G', resolution: '15', days: 7 },
  { label: '30G', value: '30G', resolution: '60', days: 30 },
  { label: '1Y', value: '1Y', resolution: 'D', days: 365 },
  { label: '5Y', value: '5Y', resolution: 'W', days: 1825 }
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function BorsaPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>(timeRanges[0].value);
  const [selectedStock, setSelectedStock] = useState<Stock>(stocks[0]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stockQuotes, setStockQuotes] = useState<Record<string, StockData>>({});

  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const timeRange = timeRanges.find(r => r.value === selectedTimeRange);
      if (!timeRange) {
        throw new Error('Geçersiz zaman aralığı');
      }

      const to = Math.floor(Date.now() / 1000);
      const from = to - (timeRange.days * 24 * 60 * 60);

      const [chartData, quoteData] = await Promise.all([
        getStockChart(selectedStock.symbol, timeRange.resolution, from, to),
        getStockQuote(selectedStock.symbol)
      ]);

      setStockData(quoteData);
      setChartData(chartData);
    } catch (error) {
      console.error('Hisse verisi alınırken hata:', error);
      setError('Veriler alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [selectedTimeRange, selectedStock]);

  useEffect(() => {
    const fetchAllQuotes = async () => {
      try {
        const quotes: Record<string, StockData> = {};
        for (const stock of stocks) {
          try {
            const data = await getStockQuote(stock.symbol);
            quotes[stock.symbol] = data;
          } catch (error) {
            console.error(`${stock.symbol} için veri alınamadı:`, error);
          }
        }
        setStockQuotes(quotes);
      } catch (error) {
        console.error('Toplu veri alınırken hata:', error);
      }
    };

    fetchAllQuotes();
    const interval = setInterval(fetchAllQuotes, 5000); // 5 saniyede bir güncelle

    return () => clearInterval(interval);
  }, []);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: selectedTimeRange === '1d' ? 'hour' : 'day',
          displayFormats: {
            hour: 'HH:mm',
            day: 'dd MMM',
            week: 'dd MMM',
            month: 'MMM yyyy'
          },
        },
        adapters: {
          date: {
            locale: tr,
          },
        },
        display: true,
        title: {
          display: true,
          text: 'Tarih'
        }
      } as ScaleOptions<'time'>,
      y: {
        display: true,
        title: {
          display: true,
          text: 'Fiyat ($)'
        },
        ticks: {
          callback: (value: number) => `$${value.toFixed(2)}`
        }
      } as ScaleOptions<'linear'>
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
  };

  const lineChartData = chartData ? {
    labels: chartData.timestamp.map(ts => new Date(ts * 1000)),
    datasets: [
      {
        label: selectedStock.symbol,
        data: chartData.prices,
        borderColor: '#660566',
        backgroundColor: '#660566',
        pointRadius: 0,
        borderWidth: 2,
        tension: 0.1,
      }
    ]
  } : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent 
                      bg-gradient-to-r from-[#660566] via-[#330233] to-black">
            Elektrikli Araç Borsası
          </h1>
          <p className="text-gray-600 mt-2">
            Dünya borsalarında işlem gören elektrikli araç üreticilerinin anlık hisse performansları
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Hisse Seçenekleri */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-600 mb-2 px-2">Hisse Senetleri</div>
            {stocks.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => setSelectedStock(stock)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200
                  ${selectedStock.symbol === stock.symbol 
                    ? 'border-[#660566] bg-[#660566]/5 shadow-sm' 
                    : 'border-gray-200 hover:border-[#660566] hover:bg-[#660566]/5'}`}
                aria-label={`${stock.name} hissesini seç`}
                title={`${stock.name} (${stock.symbol})`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={stock.logo}
                    alt={stock.name}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/fallback-logo.png';
                    }}
                  />
                  <div className="text-left">
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-gray-500 truncate max-w-[120px]">{stock.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    ${stockQuotes[stock.symbol]?.price?.toFixed(2) || '-.--'}
                  </div>
                  <div className={`text-sm font-medium ${
                    !stockQuotes[stock.symbol]?.changePercent ? 'text-gray-400' :
                    stockQuotes[stock.symbol]?.changePercent > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stockQuotes[stock.symbol]?.changePercent > 0 ? '▲' : stockQuotes[stock.symbol]?.changePercent < 0 ? '▼' : ''}
                    {stockQuotes[stock.symbol]?.changePercent > 0 ? '+' : ''}
                    {stockQuotes[stock.symbol]?.changePercent?.toFixed(2) || '-.--'}%
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Grafik Bölümü */}
          <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            {/* Üst Bilgi */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStock.logo}
                  alt={selectedStock.name}
                  className="w-10 h-10 rounded-full shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/fallback-logo.png';
                  }}
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedStock.name} ({selectedStock.symbol})
                  </h2>
                  {stockData && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ${stockData.price.toFixed(2)}
                      </span>
                      <span className={`text-sm font-medium ${
                        stockData.changePercent > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stockData.changePercent > 0 ? '▲' : '▼'}
                        {stockData.changePercent > 0 ? '+' : ''}
                        {stockData.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Zaman Aralığı Seçimi */}
              <div className="flex flex-wrap gap-2">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedTimeRange(range.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${selectedTimeRange === range.value
                        ? 'bg-[#660566] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-[#660566]/10'}`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grafik */}
            {loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#660566] border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-red-500 text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{error}</p>
                </div>
              </div>
            ) : lineChartData ? (
              <div className="h-[400px]">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
} 