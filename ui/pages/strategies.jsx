import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

const strategies = [
  {
    id: 'gold-scalping',
    name: 'Improved Gold Scalping BOS & CHoCH',
    description: 'An enhanced strategy for scalping gold using Break of Structure and Change of Character patterns with additional filters.',
    timeframes: ['15m', '1h', '4h'],
    tags: ['Gold', 'Scalping', 'BOS', 'CHoCH', 'RSI', 'Volume'],
    performance: {
      winRate: '67.8%',
      profitFactor: 2.27,
      netProfit: '$3,876.24'
    }
  },
  {
    id: 'bollinger-bands',
    name: 'Bollinger Bands Strategy',
    description: 'A classic mean-reversion strategy using Bollinger Bands with volume confirmation and adaptive exit rules.',
    timeframes: ['5m', '15m', '1h'],
    tags: ['Bollinger', 'Mean-Reversion', 'Volume', 'Multi-timeframe'],
    performance: {
      winRate: '62.4%',
      profitFactor: 1.95,
      netProfit: '$2,152.18'
    }
  },
  {
    id: 'macd-crossover',
    name: 'MACD Momentum Crossover',
    description: 'Captures momentum trends using MACD crossover signals with price action confirmation.',
    timeframes: ['1h', '4h', 'D'],
    tags: ['MACD', 'Momentum', 'Trend', 'Crossover'],
    performance: {
      winRate: '58.7%',
      profitFactor: 1.82,
      netProfit: '$1,937.50'
    }
  }
];

export default function Strategies() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Trading Strategies</h1>
        
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            Browse our collection of optimized PineScript trading strategies
          </p>
          <div className="flex space-x-2">
            <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm">
              <option>All Categories</option>
              <option>Trend Following</option>
              <option>Mean Reversion</option>
              <option>Breakout</option>
              <option>Scalping</option>
            </select>
            <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm">
              <option>All Timeframes</option>
              <option>5m</option>
              <option>15m</option>
              <option>1h</option>
              <option>4h</option>
              <option>Daily</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <div key={strategy.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{strategy.name}</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {strategy.description}
                </p>
                
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Performance</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Win Rate</div>
                      <div className="font-medium">{strategy.performance.winRate}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Profit Factor</div>
                      <div className="font-medium">{strategy.performance.profitFactor}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Net Profit</div>
                      <div className="font-medium">{strategy.performance.netProfit}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Timeframes</h3>
                  <div className="flex flex-wrap gap-1">
                    {strategy.timeframes.map((timeframe) => (
                      <span key={timeframe} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                        {timeframe}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {strategy.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <Link href={strategy.id === 'gold-scalping' ? '/backtest-results' : '#'} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                    View Backtest Results
                  </Link>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1 px-3 rounded">
                    Use Strategy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
} 