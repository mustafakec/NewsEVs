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

const stocks = [
  { symbol: 'TSLA', name: 'Tesla Inc.', logo: 'https://logo.clearbit.com/tesla.com' },
  { symbol: 'NIO', name: 'NIO Inc.', logo: 'https://logo.clearbit.com/nio.com' },
  { symbol: 'XPEV', name: 'XPeng Inc.', logo: 'https://logo.clearbit.com/xiaopeng.com' },
  { symbol: 'RIVN', name: 'Rivian', logo: 'https://logo.clearbit.com/rivian.com' },
  { symbol: 'LCID', name: 'Lucid Group', logo: 'https://logo.clearbit.com/lucidmotors.com' },
];

const timeRanges = [
  { label: '1G', value: '1d', interval: '5m' },
  { label: '7G', value: '7d', interval: '1h' },
  { label: '30G', value: '1mo', interval: '1d' },
  { label: '1Y', value: '1y', interval: '1d' },
  { label: '5Y', value: '5y', interval: '1wk' },
  { label: 'Tüm Zamanlar', value: 'max', interval: '1mo' },
];

export default function BorsaPage() {
  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  const [selectedRange, setSelectedRange] = useState(timeRanges[0]);
  const [chartData, setChartData] = useState<any>(null);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stockQuotes, setStockQuotes] = useState<Record<string, { price: number; changePercent: number }>>({});

  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [chartResponse, quoteResponse] = await Promise.all([
        fetch(`/api/stocks?symbol=${selectedStock.symbol}&range=${selectedRange.value}&interval=${selectedRange.interval}`),
        fetch(`/api/stocks/quote?symbol=${selectedStock.symbol}`)
      ]);

      if (!chartResponse.ok || !quoteResponse.ok) {
        throw new Error('Veri alınamadı');
      }

      const [chartJson, quoteJson] = await Promise.all([
        chartResponse.json(),
        quoteResponse.json()
      ]);

      if (chartJson.error || quoteJson.error) {
        throw new Error(chartJson.error || quoteJson.error);
      }

      setChartData(chartJson);
      setQuoteData(quoteJson);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [selectedStock, selectedRange]);

  useEffect(() => {
    const fetchAllQuotes = async () => {
      const quotes: Record<string, { price: number; changePercent: number }> = {};
      for (const stock of stocks) {
        try {
          const response = await fetch(`/api/stocks/quote?symbol=${stock.symbol}`);
          const data = await response.json();
          if (data.price && data.changePercent) {
            quotes[stock.symbol] = {
              price: data.price,
              changePercent: data.changePercent
            };
          }
        } catch (error) {
          console.error(`Error fetching quote for ${stock.symbol}:`, error);
        }
      }
      setStockQuotes(quotes);
    };

    fetchAllQuotes();
    const interval = setInterval(fetchAllQuotes, 60000); // Her dakika güncelle

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
          unit: selectedRange.value === '1d' ? 'hour' : 'day',
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
                  {quoteData && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ${quoteData.price?.toFixed(2)}
                      </span>
                      <span className={`text-sm font-medium flex items-center gap-1 ${
                        quoteData.changePercent > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {quoteData.changePercent > 0 ? '▲' : '▼'}
                        {quoteData.changePercent > 0 ? '+' : ''}
                        {quoteData.changePercent?.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Zaman Aralığı Seçici */}
              <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-lg self-stretch sm:self-auto">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedRange.value === range.value
                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    aria-label={`${range.label} grafiğini göster`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grafik */}
            <div className="h-[400px] relative">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#660566] border-t-transparent"></div>
                    <span className="text-sm text-gray-500">Veriler yükleniyor...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-red-500 mb-3">{error}</div>
                    <button
                      onClick={fetchStockData}
                      className="text-sm bg-[#660566] text-white px-4 py-2 rounded-lg hover:bg-[#330233] transition-colors duration-200"
                    >
                      Tekrar Dene
                    </button>
                  </div>
                </div>
              ) : chartData ? (
                <>
                  <Line
                    data={{
                      labels: chartData.chart.result[0].timestamp.map((t: number) => new Date(t * 1000)),
                      datasets: [
                        {
                          label: selectedStock.symbol,
                          data: chartData.chart.result[0].indicators.quote[0].close,
                          borderColor: '#660566',
                          backgroundColor: '#660566',
                          borderWidth: 2,
                          pointRadius: 0,
                          tension: 0.1,
                          fill: false,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                  {chartData.chart.result[0].meta.delay > 0 && (
                    <div className="text-sm text-gray-500 mt-4 text-center bg-gray-50 py-2 rounded-lg">
                      * Veriler {chartData.chart.result[0].meta.delay} dakika gecikmeli olarak gösterilmektedir.
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 