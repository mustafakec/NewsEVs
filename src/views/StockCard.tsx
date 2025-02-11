interface StockCardProps {
  symbol?: string;
  name?: string;
  price?: number;
  change?: number;
}

export default function StockCard({
  symbol = 'TSLA',
  name = 'Tesla Inc.',
  price = 193.57,
  change = 2.34
}: StockCardProps) {
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeBackground = isPositive ? 'bg-green-50' : 'bg-red-50';
  const changeSymbol = isPositive ? '+' : '';

  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-purple-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-gray-900">
            {symbol}
          </h3>
          <span className="text-xs text-gray-500">
            {name}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">
          ${price.toFixed(2)}
        </div>
        <div className={`text-xs ${changeColor} ${changeBackground} px-2 py-0.5 rounded-full inline-block mt-1`}>
          {changeSymbol}{change.toFixed(2)}%
        </div>
      </div>
    </div>
  );
} 