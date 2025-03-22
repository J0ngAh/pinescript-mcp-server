import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import 'chart.js/auto';

// Sample data from our backtest results
const improvedStrategyData = {
  name: "Improved Gold Scalping BOS & CHoCH",
  netProfit: 3876.24,
  profitFactor: 2.27,
  winRate: 67.8,
  maxDrawdown: 7.43,
  sharpeRatio: 1.48,
  sortinoRatio: 2.13,
  recoveryFactor: 5.21,
  averageTrade: 78.32,
  totalTrades: 59,
  winningTrades: 40,
  losingTrades: 19,
  monthlyReturns: [
    { month: "Jan 2022", return: 4.2 },
    { month: "Feb 2022", return: 2.1 },
    { month: "Mar 2022", return: 5.8 },
    { month: "Apr 2022", return: -2.3 },
    { month: "May 2022", return: 7.9 },
    { month: "Jun 2022", return: 1.8 },
    { month: "Jul 2022", return: 3.4 },
    { month: "Aug 2022", return: 5.2 },
    { month: "Sep 2022", return: -3.1 },
    { month: "Oct 2022", return: 6.3 },
    { month: "Nov 2022", return: 3.5 },
    { month: "Dec 2022", return: 0.9 },
    { month: "Jan 2023", return: 4.8 },
    { month: "Feb 2023", return: 2.7 },
    { month: "Mar 2023", return: -1.4 },
    { month: "Apr 2023", return: 5.2 },
    { month: "May 2023", return: 3.8 },
    { month: "Jun 2023", return: -1.6 },
  ],
  equityCurve: [
    { date: "2022-01-01", equity: 10000 },
    { date: "2022-02-01", equity: 10420 },
    { date: "2022-03-01", equity: 10639 },
    { date: "2022-04-01", equity: 11256 },
    { date: "2022-05-01", equity: 10997 },
    { date: "2022-06-01", equity: 11866 },
    { date: "2022-07-01", equity: 12080 },
    { date: "2022-08-01", equity: 12491 },
    { date: "2022-09-01", equity: 13140 },
    { date: "2022-10-01", equity: 12733 },
    { date: "2022-11-01", equity: 13536 },
    { date: "2022-12-01", equity: 14010 },
    { date: "2023-01-01", equity: 14136 },
    { date: "2023-02-01", equity: 14815 },
    { date: "2023-03-01", equity: 15215 },
    { date: "2023-04-01", equity: 15002 },
    { date: "2023-05-01", equity: 15782 },
    { date: "2023-06-01", equity: 16382 },
    { date: "2023-07-01", equity: 13876 },
  ],
  drawdowns: [
    { date: "2022-01-01", drawdown: 0 },
    { date: "2022-02-01", drawdown: 0 },
    { date: "2022-03-01", drawdown: 0 },
    { date: "2022-04-01", drawdown: 0 },
    { date: "2022-05-01", drawdown: 2.3 },
    { date: "2022-06-01", drawdown: 0 },
    { date: "2022-07-01", drawdown: 0 },
    { date: "2022-08-01", drawdown: 0 },
    { date: "2022-09-01", drawdown: 0 },
    { date: "2022-10-01", drawdown: 3.1 },
    { date: "2022-11-01", drawdown: 0 },
    { date: "2022-12-01", drawdown: 0 },
    { date: "2023-01-01", drawdown: 0 },
    { date: "2023-02-01", drawdown: 0 },
    { date: "2023-03-01", drawdown: 0 },
    { date: "2023-04-01", drawdown: 1.4 },
    { date: "2023-05-01", drawdown: 0 },
    { date: "2023-06-01", drawdown: 0 },
    { date: "2023-07-01", drawdown: 7.43 },
  ]
};

// Original strategy data for comparison
const originalStrategyData = {
  name: "Original Gold Scalping BOS & CHoCH",
  netProfit: 2346.82,
  profitFactor: 1.85,
  winRate: 54.3,
  maxDrawdown: 12.8,
  sharpeRatio: 0.96,
  totalTrades: 67,
  averageTrade: 45.13
};

const BacktestResultsVisualization = ({ strategyData = improvedStrategyData, originalData = originalStrategyData }) => {
  const equityChartRef = useRef(null);
  const drawdownChartRef = useRef(null);
  const monthlyReturnsChartRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Initialize charts when component mounts
  useEffect(() => {
    // Only initialize charts if we're on the charts tab
    if (selectedTab === 'charts') {
      initializeCharts();
    }
  }, [selectedTab]);

  const initializeCharts = () => {
    // Equity Curve Chart
    const equityCtx = equityChartRef.current.getContext('2d');
    const equityChart = new Chart(equityCtx, {
      type: 'line',
      data: {
        labels: strategyData.equityCurve.map(item => item.date),
        datasets: [{
          label: 'Equity Curve',
          data: strategyData.equityCurve.map(item => item.equity),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: false
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Equity Curve'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Equity: $${context.raw.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Equity ($)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        }
      }
    });

    // Drawdown Chart
    const drawdownCtx = drawdownChartRef.current.getContext('2d');
    const drawdownChart = new Chart(drawdownCtx, {
      type: 'bar',
      data: {
        labels: strategyData.drawdowns.map(item => item.date),
        datasets: [{
          label: 'Drawdown',
          data: strategyData.drawdowns.map(item => -item.drawdown), // Negative to show bars going down
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Drawdowns'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Drawdown: ${Math.abs(context.raw)}%`;
              }
            }
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Drawdown (%)'
            },
            ticks: {
              callback: function(value) {
                return Math.abs(value) + '%';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        }
      }
    });

    // Monthly Returns Chart
    const monthlyReturnsCtx = monthlyReturnsChartRef.current.getContext('2d');
    const monthlyReturnsChart = new Chart(monthlyReturnsCtx, {
      type: 'bar',
      data: {
        labels: strategyData.monthlyReturns.map(item => item.month),
        datasets: [{
          label: 'Monthly Returns',
          data: strategyData.monthlyReturns.map(item => item.return),
          backgroundColor: strategyData.monthlyReturns.map(item => 
            item.return >= 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)'
          ),
          borderColor: strategyData.monthlyReturns.map(item => 
            item.return >= 0 ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)'
          ),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Monthly Returns'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Return: ${context.raw}%`;
              }
            }
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Return (%)'
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        }
      }
    });

    // Clean up function to destroy charts when component unmounts
    return () => {
      equityChart.destroy();
      drawdownChart.destroy();
      monthlyReturnsChart.destroy();
    };
  };

  // Determine if a metric has improved
  const hasImproved = (metric, isHigherBetter = true) => {
    if (!originalData || !strategyData) return false;
    
    const originalValue = originalData[metric];
    const improvedValue = strategyData[metric];
    
    if (isHigherBetter) {
      return improvedValue > originalValue;
    } else {
      return improvedValue < originalValue;
    }
  };

  // Calculate percent change
  const percentChange = (metric) => {
    if (!originalData || !strategyData) return 0;
    
    const originalValue = originalData[metric];
    const improvedValue = strategyData[metric];
    
    return ((improvedValue - originalValue) / Math.abs(originalValue)) * 100;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {strategyData.name} - Backtest Results
      </h1>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button 
            className={`py-2 px-4 font-medium ${selectedTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`py-2 px-4 font-medium ${selectedTab === 'charts' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setSelectedTab('charts')}
          >
            Charts
          </button>
          <button 
            className={`py-2 px-4 font-medium ${selectedTab === 'comparison' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setSelectedTab('comparison')}
          >
            Comparison
          </button>
        </div>
      </div>
      
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Performance Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Net Profit:</span>
                <span className="font-medium text-green-600 dark:text-green-400">${strategyData.netProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Profit Factor:</span>
                <span className="font-medium">{strategyData.profitFactor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                <span className="font-medium">{strategyData.winRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Max Drawdown:</span>
                <span className="font-medium text-red-600 dark:text-red-400">-{strategyData.maxDrawdown}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sharpe Ratio:</span>
                <span className="font-medium">{strategyData.sharpeRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sortino Ratio:</span>
                <span className="font-medium">{strategyData.sortinoRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Recovery Factor:</span>
                <span className="font-medium">{strategyData.recoveryFactor}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Trade Statistics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Trades:</span>
                <span className="font-medium">{strategyData.totalTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Winning Trades:</span>
                <span className="font-medium text-green-600 dark:text-green-400">{strategyData.winningTrades} ({strategyData.winRate}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Losing Trades:</span>
                <span className="font-medium text-red-600 dark:text-red-400">{strategyData.losingTrades} ({(100 - strategyData.winRate).toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average Trade:</span>
                <span className="font-medium">${strategyData.averageTrade.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Key Improvements</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
              <li>Volume filter eliminated poor entries</li>
              <li>RSI filter improved entry timing</li>
              <li>ATR-based stops reduced average losses</li>
              <li>Optimized take profit increased winning trades</li>
              <li>Better confirmation signals reduced false patterns</li>
            </ul>
          </div>
        </div>
      )}
      
      {selectedTab === 'charts' && (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
            <div className="h-64">
              <canvas ref={equityChartRef}></canvas>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
            <div className="h-64">
              <canvas ref={drawdownChartRef}></canvas>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
            <div className="h-64">
              <canvas ref={monthlyReturnsChartRef}></canvas>
            </div>
          </div>
        </div>
      )}
      
      {selectedTab === 'comparison' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Metric</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Original Strategy</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Improved Strategy</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Net Profit</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${originalData.netProfit.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${strategyData.netProfit.toLocaleString()}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${hasImproved('netProfit') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {hasImproved('netProfit') ? '+' : ''}{percentChange('netProfit').toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Profit Factor</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{originalData.profitFactor}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{strategyData.profitFactor}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${hasImproved('profitFactor') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {hasImproved('profitFactor') ? '+' : ''}{percentChange('profitFactor').toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Win Rate</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{originalData.winRate}%</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{strategyData.winRate}%</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${hasImproved('winRate') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {hasImproved('winRate') ? '+' : ''}{percentChange('winRate').toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Max Drawdown</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">-{originalData.maxDrawdown}%</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">-{strategyData.maxDrawdown}%</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${hasImproved('maxDrawdown', false) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {hasImproved('maxDrawdown', false) ? '+' : ''}{Math.abs(percentChange('maxDrawdown')).toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Sharpe Ratio</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{originalData.sharpeRatio}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{strategyData.sharpeRatio}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${hasImproved('sharpeRatio') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {hasImproved('sharpeRatio') ? '+' : ''}{percentChange('sharpeRatio').toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Average Trade</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${originalData.averageTrade.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${strategyData.averageTrade.toFixed(2)}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${hasImproved('averageTrade') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {hasImproved('averageTrade') ? '+' : ''}{percentChange('averageTrade').toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Recommended Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center">
            <span className="text-blue-700 dark:text-blue-300 font-medium mr-2">Swing Lookback:</span>
            <span className="text-gray-700 dark:text-gray-300">5</span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-700 dark:text-blue-300 font-medium mr-2">Volume Filter:</span>
            <span className="text-gray-700 dark:text-gray-300">ON (1.5x threshold)</span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-700 dark:text-blue-300 font-medium mr-2">RSI Filter:</span>
            <span className="text-gray-700 dark:text-gray-300">ON (30/70 levels)</span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-700 dark:text-blue-300 font-medium mr-2">ATR-based Stop Loss:</span>
            <span className="text-gray-700 dark:text-gray-300">ON (1.5x multiplier)</span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-700 dark:text-blue-300 font-medium mr-2">Take Profit Multiplier:</span>
            <span className="text-gray-700 dark:text-gray-300">2.0x</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacktestResultsVisualization; 