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
  { label: 'MAX', value: 'max', interval: '1mo' },
];

export default function BorsaPage() {
  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  const [selectedRange, setSelectedRange] = useState(timeRanges[0]);
  const [chartData, setChartData] = useState<any>(null);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            Dünya borsalarında işlem gören elektrikli araç üreticilerinin hisse performansları
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sol Panel - Hisse Listesi */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Hisse Senetleri</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {stocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${
                      selectedStock.symbol === stock.symbol ? 'bg-gray-50' : ''
                    }`}
                  >
                    <img
                      src={stock.logo}
                      alt={stock.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/fallback-logo.png';
                      }}
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{stock.symbol}</div>
                      <div className="text-sm text-gray-500">{stock.name}</div>
                    </div>
                    {quoteData && selectedStock.symbol === stock.symbol && (
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          ${quoteData.price?.toFixed(2)}
                        </div>
                        <div className={`text-sm ${
                          quoteData.changePercent > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {quoteData.changePercent > 0 ? '+' : ''}
                          {quoteData.changePercent?.toFixed(2)}%
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Panel - Grafik */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              {/* Üst Bilgi */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedStock.logo}
                    alt={selectedStock.name}
                    className="w-10 h-10 rounded-full"
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
                        <span className={`text-sm font-medium ${
                          quoteData.changePercent > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {quoteData.changePercent > 0 ? '+' : ''}
                          {quoteData.changePercent?.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Zaman Aralığı Seçici */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg self-stretch sm:self-auto">
                  {timeRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setSelectedRange(range)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedRange.value === range.value
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grafik */}
              <div className="h-[400px]">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#660566] border-t-transparent"></div>
                  </div>
                ) : error ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-red-500 mb-2">{error}</div>
                      <button
                        onClick={fetchStockData}
                        className="text-sm text-[#660566] hover:text-[#330233] font-medium"
                      >
                        Tekrar Dene
                      </button>
                    </div>
                  </div>
                ) : chartData ? (
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
                          tension: 0,
                          fill: false,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 