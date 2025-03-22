import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function Analyze() {
  const [script, setScript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleAnalyze = () => {
    if (!script.trim()) return;
    
    setIsAnalyzing(true);
    
    // Mock analysis - in a real app, this would call an API
    setTimeout(() => {
      setAnalysisResults({
        score: 87,
        strengths: [
          'Proper risk management with dynamic stop loss',
          'Good use of volume confirmation',
          'Clear entry and exit conditions',
          'Appropriate use of indicators without over-optimization'
        ],
        weaknesses: [
          'Could benefit from additional market regime filter',
          'Consider adding time-based exits for trades that don\'t reach targets',
          'Entry signal could be refined for higher precision'
        ],
        recommendations: [
          'Add RSI filter to avoid trading in extreme market conditions',
          'Implement adaptive take-profit based on volatility',
          'Consider adding a trailing stop for capturing extended moves'
        ],
        performance: {
          estimatedWinRate: '64-72%',
          estimatedProfitFactor: '1.8-2.2',
          estimatedDrawdown: '8-12%'
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Analyze PineScript Strategy</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <label htmlFor="script" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Paste your PineScript strategy
              </label>
              <textarea
                id="script"
                rows={15}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="// Paste your PineScript strategy here...
// Example:
strategy('My Strategy', overlay=true)
longCondition = crossover(sma(close, 14), sma(close, 28))
if (longCondition)
    strategy.entry('Long', strategy.long)"
                value={script}
                onChange={(e) => setScript(e.target.value)}
              ></textarea>
            </div>
            
            <div className="mb-6">
              <button
                type="button"
                className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isAnalyzing ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={isAnalyzing || !script.trim()}
                onClick={handleAnalyze}
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Strategy...
                  </>
                ) : 'Analyze Strategy'}
              </button>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Need inspiration?</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Try our improved Gold Scalping strategy as a starting point for your own development.
              </p>
              <button 
                type="button"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
                onClick={() => {
                  setScript(`// Improved Gold Scalping BOS & CHoCH Strategy
strategy("Improved Gold Scalping BOS & CHoCH", overlay=true)

// Input parameters
supResLookback = input(10, "Support/Resistance Lookback")
swingLookback = input(5, "Swing High/Low Lookback")
useVolumeFilter = input(true, "Use Volume Filter")
volumeThreshold = input(1.5, "Volume Threshold", minval=1.0, step=0.1)
useRsiFilter = input(true, "Use RSI Filter")
rsiLength = input(14, "RSI Length")
rsiOverbought = input(70, "RSI Overbought Level")
rsiOversold = input(30, "RSI Oversold Level")
useAtrStops = input(true, "Use ATR for Stop Loss")
atrLength = input(14, "ATR Length")
atrMultiplier = input(1.5, "ATR Multiplier")
tpMultiplier = input(2.0, "Take Profit Multiplier")

// Indicators
rsi = rsi(close, rsiLength)
atr = atr(atrLength)
highVolume = volume > sma(volume, 20) * volumeThreshold

// Determine recent swings
swingHigh = highest(high, swingLookback)
swingLow = lowest(low, swingLookback)

// BOS and CHoCH conditions
bullishBOS = close > swingHigh[1] and close[1] <= swingHigh[1]
bearishBOS = close < swingLow[1] and close[1] >= swingLow[1]

bullishCHoCH = low > swingLow[1] and swingLow[1] < swingLow[2]
bearishCHoCH = high < swingHigh[1] and swingHigh[1] > swingHigh[2]

// Entry conditions with additional confirmations
longCondition = bullishBOS and bullishCHoCH and 
                (!useVolumeFilter or highVolume) and 
                (!useRsiFilter or rsi > rsiOversold)
                
shortCondition = bearishBOS and bearishCHoCH and 
                 (!useVolumeFilter or highVolume) and 
                 (!useRsiFilter or rsi < rsiOverbought)

// Risk management - dynamic stop loss
longSL = useAtrStops ? low - atr * atrMultiplier : swingLow
shortSL = useAtrStops ? high + atr * atrMultiplier : swingHigh

// Take profit calculations
longTP = close + (close - longSL) * tpMultiplier
shortTP = close - (shortSL - close) * tpMultiplier

// Strategy execution
if (longCondition)
    strategy.entry("Long", strategy.long)
    strategy.exit("Long Exit", "Long", stop=longSL, limit=longTP)

if (shortCondition)
    strategy.entry("Short", strategy.short)
    strategy.exit("Short Exit", "Short", stop=shortSL, limit=shortTP)

// Plotting
plotshape(longCondition, title="Buy Signal", location=location.belowbar, color=color.green, style=shape.triangleup, size=size.small)
plotshape(shortCondition, title="Sell Signal", location=location.abovebar, color=color.red, style=shape.triangledown, size=size.small)

// Show strategy status
if (barstate.islastconfirmedhistory)
    table.new(position=position.bottom_right, columns=2, rows=5, bgcolor=color.new(color.blue, 90), border_width=1)
    table.cell(table_id=t, column=0, row=0, text="GOLD SCALPING STRATEGY", bgcolor=color.new(color.blue, 80))
    table.cell(table_id=t, column=0, row=1, text="Last Signal")
    table.cell(table_id=t, column=1, row=1, text=longCondition ? "BUY" : shortCondition ? "SELL" : "NEUTRAL", 
               text_color=longCondition ? color.green : shortCondition ? color.red : color.white)
`);
                }}
              >
                Load Example Strategy
              </button>
            </div>
          </div>
          
          <div>
            {analysisResults ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Analysis Results</h2>
                  <div className="flex items-center">
                    <div className="text-lg font-bold mr-2">Score:</div>
                    <div className={`text-lg font-bold ${
                      analysisResults.score >= 80 ? 'text-green-600 dark:text-green-400' :
                      analysisResults.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {analysisResults.score}/100
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">Strengths</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysisResults.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Areas for Improvement</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysisResults.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{weakness}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysisResults.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{recommendation}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Estimated Performance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-gray-500 dark:text-gray-400 text-sm">Win Rate</div>
                      <div className="font-medium">{analysisResults.performance.estimatedWinRate}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-gray-500 dark:text-gray-400 text-sm">Profit Factor</div>
                      <div className="font-medium">{analysisResults.performance.estimatedProfitFactor}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-gray-500 dark:text-gray-400 text-sm">Max Drawdown</div>
                      <div className="font-medium">{analysisResults.performance.estimatedDrawdown}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full flex flex-col justify-center items-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Analysis Results Yet</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Paste your PineScript strategy in the editor and click "Analyze Strategy" to get insights
                  on performance, strengths, and areas for improvement.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 