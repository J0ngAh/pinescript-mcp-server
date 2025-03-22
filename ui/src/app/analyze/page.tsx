'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { logFileUpload } from '@/lib/supabaseClient';

export default function AnalyzePage() {
  // State for file uploads
  const [tradeResultsFile, setTradeResultsFile] = useState<File | null>(null);
  const [historicalDataFile, setHistoricalDataFile] = useState<File | null>(null);
  const [tradeResultsPreview, setTradeResultsPreview] = useState<string[][]>([]);
  const [historicalDataPreview, setHistoricalDataPreview] = useState<string[][]>([]);
  const [isDraggingTrades, setIsDraggingTrades] = useState(false);
  const [isDraggingHistorical, setIsDraggingHistorical] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<{trades?: string, historical?: string}>({});
  
  // Refs for file inputs
  const tradeResultsInputRef = useRef<HTMLInputElement>(null);
  const historicalDataInputRef = useRef<HTMLInputElement>(null);
  
  // Strategy code state
  const [strategyCode, setStrategyCode] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('');
  
  // Analysis options state
  const [analysisType, setAnalysisType] = useState('strategy');
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [selectedProvider, setSelectedProvider] = useState('openai');

  // Handle strategy code input
  const handleStrategyCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStrategyCode(e.target.value);
  };

  // Handle strategy selection
  const handleStrategySelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStrategy(e.target.value);
  };

  // Handle CSV file parsing and preview
  const parseCSV = (file: File): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (!event.target?.result) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        const csv = event.target.result as string;
        const lines = csv.split('\n');
        const result: string[][] = [];
        
        // Parse each line
        lines.forEach(line => {
          // Handle both comma and semicolon delimiters
          const delimiter = line.includes(';') ? ';' : ',';
          // Split line by delimiter and handle quoted values
          const values = line.split(delimiter).map(value => 
            value.trim().replace(/^["'](.*)["']$/, '$1')
          );
          if (values.length > 0 && values.some(v => v.trim() !== '')) {
            result.push(values);
          }
        });
        
        resolve(result);
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  };

  // Validate CSV file format for trade results
  const validateTradeResultsCSV = (data: string[][]): boolean => {
    if (data.length < 2) return false; // Need at least headers and one row
    
    // Check for required headers (this is flexible based on TradingView export format)
    const headers = data[0].map(h => h.toLowerCase());
    const requiredFields = ['date', 'price', 'action', 'profit'];
    
    return requiredFields.some(field => 
      headers.some(header => header.includes(field))
    );
  };

  // Validate CSV file format for historical data
  const validateHistoricalDataCSV = (data: string[][]): boolean => {
    if (data.length < 2) return false; // Need at least headers and one row
    
    // Check for required headers
    const headers = data[0].map(h => h.toLowerCase());
    const requiredFields = ['date', 'open', 'high', 'low', 'close'];
    
    // Check if at least 3 of the required fields are present
    const foundFields = requiredFields.filter(field => 
      headers.some(header => header.includes(field))
    );
    
    return foundFields.length >= 3;
  };

  // Handle trade results file upload
  const handleTradeResultsUpload = async (file: File) => {
    try {
      setTradeResultsFile(file);
      const data = await parseCSV(file);
      
      if (validateTradeResultsCSV(data)) {
        setTradeResultsPreview(data.slice(0, 5)); // Preview first 5 rows
        setUploadErrors(prev => ({...prev, trades: undefined}));
        
        // Log the upload to Supabase
        try {
          const uploadResult = await logFileUpload(
            file.name,
            file.size,
            'trade_results',
            file.type || 'text/csv',
            {
              rowCount: data.length,
              columnCount: data[0].length,
              timestamp: new Date().toISOString(),
            }
          );
          console.log('Upload logged successfully:', uploadResult);
        } catch (error) {
          console.error('Failed to log upload to Supabase:', error);
          // Don't block the UI flow if logging fails
        }
      } else {
        setUploadErrors(prev => ({
          ...prev, 
          trades: 'Invalid trade results format. File should contain trade data from TradingView.'
        }));
        setTradeResultsPreview([]);
      }
    } catch (error) {
      console.error('Error processing trade results file:', error);
      setUploadErrors(prev => ({
        ...prev, 
        trades: 'Error processing file. Please check the format and try again.'
      }));
    }
  };

  // Handle historical data file upload
  const handleHistoricalDataUpload = async (file: File) => {
    try {
      setHistoricalDataFile(file);
      const data = await parseCSV(file);
      
      if (validateHistoricalDataCSV(data)) {
        setHistoricalDataPreview(data.slice(0, 5)); // Preview first 5 rows
        setUploadErrors(prev => ({...prev, historical: undefined}));
        
        // Log the upload to Supabase
        try {
          const uploadResult = await logFileUpload(
            file.name,
            file.size,
            'historical_data',
            file.type || 'text/csv',
            {
              rowCount: data.length,
              columnCount: data[0].length,
              timeframe: detectTimeframe(data), // Helper function to detect timeframe
              symbol: detectSymbol(data), // Helper function to detect symbol
              timestamp: new Date().toISOString(),
            }
          );
          console.log('Upload logged successfully:', uploadResult);
        } catch (error) {
          console.error('Failed to log upload to Supabase:', error);
          // Don't block the UI flow if logging fails
        }
      } else {
        setUploadErrors(prev => ({
          ...prev, 
          historical: 'Invalid historical data format. File should contain OHLC price data.'
        }));
        setHistoricalDataPreview([]);
      }
    } catch (error) {
      console.error('Error processing historical data file:', error);
      setUploadErrors(prev => ({
        ...prev, 
        historical: 'Error processing file. Please check the format and try again.'
      }));
    }
  };

  // Helper function to attempt to detect timeframe from data
  const detectTimeframe = (data: string[][]): string => {
    try {
      // If we have at least 3 rows (header + 2 data rows)
      if (data.length >= 3) {
        // Find the date/time column index
        const headers = data[0].map(h => h.toLowerCase());
        const dateColIndex = headers.findIndex(h => 
          h.includes('date') || h.includes('time')
        );
        
        if (dateColIndex >= 0 && data[1][dateColIndex] && data[2][dateColIndex]) {
          // Try to parse dates from consecutive rows
          const date1 = new Date(data[1][dateColIndex]);
          const date2 = new Date(data[2][dateColIndex]);
          
          if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
            const diffMs = Math.abs(date2.getTime() - date1.getTime());
            const diffMins = Math.round(diffMs / 60000);
            
            // Map time difference to common timeframes
            if (diffMins <= 1) return '1m';
            if (diffMins <= 5) return '5m';
            if (diffMins <= 15) return '15m';
            if (diffMins <= 30) return '30m';
            if (diffMins <= 60) return '1h';
            if (diffMins <= 240) return '4h';
            if (diffMins <= 1440) return '1D';
            if (diffMins <= 10080) return '1W';
            return 'Unknown';
          }
        }
      }
    } catch (error) {
      console.error('Error detecting timeframe:', error);
    }
    
    return 'Unknown';
  };

  // Helper function to attempt to detect symbol from data or filename
  const detectSymbol = (data: string[][]): string => {
    try {
      // Try to extract from headers if they contain a symbol field
      const headers = data[0].map(h => h.toLowerCase());
      const symbolColIndex = headers.findIndex(h => 
        h.includes('symbol') || h.includes('ticker') || h.includes('instrument')
      );
      
      if (symbolColIndex >= 0 && data[1] && data[1][symbolColIndex]) {
        return data[1][symbolColIndex];
      }
      
      // If we have a historical data file, try to extract from filename
      if (historicalDataFile) {
        const filename = historicalDataFile.name.toLowerCase();
        
        // Common patterns like BTCUSD, BTC-USD, BTC_USD
        const symbolRegex = /([a-z0-9]+)[_\-]?([a-z0-9]+)/i;
        const match = filename.match(symbolRegex);
        
        if (match && match[0]) {
          return match[0].toUpperCase();
        }
      }
    } catch (error) {
      console.error('Error detecting symbol:', error);
    }
    
    return 'Unknown';
  };

  // Handle click on trade results upload area
  const handleTradeResultsClick = () => {
    tradeResultsInputRef.current?.click();
  };

  // Handle click on historical data upload area
  const handleHistoricalDataClick = () => {
    historicalDataInputRef.current?.click();
  };

  // Handle drag events for trade results
  const handleTradeResultsDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingTrades(true);
  };

  const handleTradeResultsDragLeave = () => {
    setIsDraggingTrades(false);
  };

  const handleTradeResultsDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingTrades(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        handleTradeResultsUpload(file);
      } else {
        setUploadErrors(prev => ({
          ...prev, 
          trades: 'Please upload a CSV file.'
        }));
      }
    }
  };

  // Handle drag events for historical data
  const handleHistoricalDataDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingHistorical(true);
  };

  const handleHistoricalDataDragLeave = () => {
    setIsDraggingHistorical(false);
  };

  const handleHistoricalDataDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingHistorical(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        handleHistoricalDataUpload(file);
      } else {
        setUploadErrors(prev => ({
          ...prev, 
          historical: 'Please upload a CSV file.'
        }));
      }
    }
  };

  // Handle file input change for trade results
  const handleTradeResultsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleTradeResultsUpload(e.target.files[0]);
    }
  };

  // Handle file input change for historical data
  const handleHistoricalDataFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleHistoricalDataUpload(e.target.files[0]);
    }
  };

  // Handle paste for trade results
  const handleTradeResultsPaste = () => {
    navigator.clipboard.readText().then(text => {
      if (text) {
        // Create a file from the clipboard text
        const file = new File([text], "clipboard-trades.csv", { type: "text/csv" });
        handleTradeResultsUpload(file);
      }
    }).catch(err => {
      console.error('Failed to read clipboard contents: ', err);
      setUploadErrors(prev => ({
        ...prev, 
        trades: 'Failed to read clipboard contents. Please try uploading a file instead.'
      }));
    });
  };

  // Handle paste for historical data
  const handleHistoricalDataPaste = () => {
    navigator.clipboard.readText().then(text => {
      if (text) {
        // Create a file from the clipboard text
        const file = new File([text], "clipboard-historical.csv", { type: "text/csv" });
        handleHistoricalDataUpload(file);
      }
    }).catch(err => {
      console.error('Failed to read clipboard contents: ', err);
      setUploadErrors(prev => ({
        ...prev, 
        historical: 'Failed to read clipboard contents. Please try uploading a file instead.'
      }));
    });
  };

  // Handle remove file for trade results
  const handleRemoveTradeResults = () => {
    setTradeResultsFile(null);
    setTradeResultsPreview([]);
    setUploadErrors(prev => ({...prev, trades: undefined}));
  };

  // Handle remove file for historical data
  const handleRemoveHistoricalData = () => {
    setHistoricalDataFile(null);
    setHistoricalDataPreview([]);
    setUploadErrors(prev => ({...prev, historical: undefined}));
  };

  return (
    <div className="space-y-6">
      <div className="flex-between">
        <h1 className="text-3xl font-bold">Strategy Analysis</h1>
        <div className="flex space-x-3">
          <Link href="/analyze/history" className="btn btn-secondary">
            Analysis History
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Strategy Code</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Enter your PineScript strategy:
              </label>
              <div className="border border-secondary-300 rounded-md overflow-hidden">
                <div className="bg-secondary-100 px-4 py-2 flex justify-between items-center">
                  <span className="text-sm font-medium">Pine Script</span>
                  <div className="flex space-x-2">
                    <button 
                      className="text-secondary-600 hover:text-secondary-900"
                      onClick={() => navigator.clipboard.readText().then(text => setStrategyCode(text))}
                      title="Paste from clipboard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                        <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                      </svg>
                    </button>
                    <button 
                      className="text-secondary-600 hover:text-secondary-900"
                      onClick={() => setStrategyCode('')}
                      title="Clear"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011-1h10a1 1 0 011 1v1H4V2zm1 4a1 1 0 00-1 1v10a2 2 0 002 2h8a2 2 0 002-2V7a1 1 0 00-1-1H5zm9 3a1 1 0 00-1-1H7a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <textarea 
                  className="w-full h-64 p-4 font-mono text-sm focus:outline-none" 
                  placeholder="// Paste your PineScript strategy here
// Example:
strategy('Simple MA Crossover', overlay=true)
fastLength = input(10, 'Fast MA Length')
slowLength = input(30, 'Slow MA Length')
fastMA = ta.sma(close, fastLength)
slowMA = ta.sma(close, slowLength)

longCondition = ta.crossover(fastMA, slowMA)
shortCondition = ta.crossunder(fastMA, slowMA)

if (longCondition)
    strategy.entry('Long', strategy.long)
if (shortCondition)
    strategy.entry('Short', strategy.short)"
                  value={strategyCode}
                  onChange={handleStrategyCodeChange}
                ></textarea>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Or select an existing strategy:
              </label>
              <select 
                className="select"
                value={selectedStrategy}
                onChange={handleStrategySelection}
              >
                <option value="">Select a strategy</option>
                <option value="1">Simple Moving Average Crossover</option>
                <option value="2">RSI Divergence</option>
                <option value="3">MACD Histogram Strategy</option>
                <option value="4">Bollinger Bands Squeeze</option>
              </select>
            </div>
          </div>

          {/* Trade Results Upload Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-2">Trade Results</h2>
            <p className="text-secondary-600 mb-4">
              Upload the CSV export of your TradingView backtest results to analyze performance.
            </p>
            
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-4">
                <button 
                  onClick={handleTradeResultsClick} 
                  className="btn btn-secondary text-sm"
                >
                  Upload CSV
                </button>
                <input
                  type="file"
                  ref={tradeResultsInputRef}
                  onChange={handleTradeResultsFileChange}
                  accept=".csv"
                  className="hidden"
                />
                <span className="text-sm text-secondary-500">or</span>
                <button 
                  onClick={handleTradeResultsPaste}
                  className="btn btn-secondary text-sm"
                >
                  Paste Results
                </button>
                {tradeResultsFile && (
                  <>
                    <span className="text-sm text-secondary-500">|</span>
                    <button 
                      onClick={handleRemoveTradeResults}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove File
                    </button>
                  </>
                )}
              </div>
              
              {!tradeResultsFile ? (
                <div 
                  className={`border ${isDraggingTrades ? 'border-primary-400 bg-primary-50' : 'border-dashed border-secondary-300'} rounded-md p-8 text-center cursor-pointer transition-colors`}
                  onClick={handleTradeResultsClick}
                  onDragOver={handleTradeResultsDragOver}
                  onDragLeave={handleTradeResultsDragLeave}
                  onDrop={handleTradeResultsDrop}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-secondary-600">
                    Drop your TradingView trade results file here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-secondary-500">
                    Export your backtest trades as CSV from TradingView Strategy Tester
                  </p>
                </div>
              ) : (
                <div className="border border-secondary-200 rounded-md p-4">
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{tradeResultsFile.name}</span>
                    <span className="ml-2 text-xs text-secondary-500">
                      ({Math.round(tradeResultsFile.size / 1024)} KB)
                    </span>
                  </div>
                  
                  {tradeResultsPreview.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs">
                        <thead className="bg-secondary-50">
                          <tr>
                            {tradeResultsPreview[0].map((header, i) => (
                              <th key={i} className="px-2 py-1 text-left">{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tradeResultsPreview.slice(1).map((row, i) => (
                            <tr key={i} className="border-t">
                              {row.map((cell, j) => (
                                <td key={j} className="px-2 py-1">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-xs text-secondary-500 mt-2 italic">
                        Showing preview of first {tradeResultsPreview.length - 1} rows
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {uploadErrors.trades && (
                <p className="text-sm text-red-600 mt-2">{uploadErrors.trades}</p>
              )}
            </div>
          </div>
          
          {/* Historical Data Upload Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-2">Historical Price Data</h2>
            <p className="text-secondary-600 mb-4">
              Upload historical OHLC data for comprehensive optimization analysis.
            </p>
            
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-4">
                <button 
                  onClick={handleHistoricalDataClick} 
                  className="btn btn-secondary text-sm"
                >
                  Upload CSV
                </button>
                <input
                  type="file"
                  ref={historicalDataInputRef}
                  onChange={handleHistoricalDataFileChange}
                  accept=".csv"
                  className="hidden"
                />
                <span className="text-sm text-secondary-500">or</span>
                <button 
                  onClick={handleHistoricalDataPaste}
                  className="btn btn-secondary text-sm"
                >
                  Paste Data
                </button>
                {historicalDataFile && (
                  <>
                    <span className="text-sm text-secondary-500">|</span>
                    <button 
                      onClick={handleRemoveHistoricalData}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove File
                    </button>
                  </>
                )}
              </div>
              
              {!historicalDataFile ? (
                <div 
                  className={`border ${isDraggingHistorical ? 'border-primary-400 bg-primary-50' : 'border-dashed border-secondary-300'} rounded-md p-8 text-center cursor-pointer transition-colors`}
                  onClick={handleHistoricalDataClick}
                  onDragOver={handleHistoricalDataDragOver}
                  onDragLeave={handleHistoricalDataDragLeave}
                  onDrop={handleHistoricalDataDrop}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-secondary-600">
                    Drop your historical price data file here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-secondary-500">
                    Export OHLC data as CSV from TradingView or your data provider
                  </p>
                </div>
              ) : (
                <div className="border border-secondary-200 rounded-md p-4">
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{historicalDataFile.name}</span>
                    <span className="ml-2 text-xs text-secondary-500">
                      ({Math.round(historicalDataFile.size / 1024)} KB)
                    </span>
                  </div>
                  
                  {historicalDataPreview.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs">
                        <thead className="bg-secondary-50">
                          <tr>
                            {historicalDataPreview[0].map((header, i) => (
                              <th key={i} className="px-2 py-1 text-left">{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {historicalDataPreview.slice(1).map((row, i) => (
                            <tr key={i} className="border-t">
                              {row.map((cell, j) => (
                                <td key={j} className="px-2 py-1">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-xs text-secondary-500 mt-2 italic">
                        Showing preview of first {historicalDataPreview.length - 1} rows
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {uploadErrors.historical && (
                <p className="text-sm text-red-600 mt-2">{uploadErrors.historical}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Analysis Options</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Analysis Type
              </label>
              <div className="space-y-2">
                <label className="flex items-start p-3 border border-secondary-200 rounded-md hover:bg-secondary-50">
                  <input 
                    type="radio" 
                    name="analysisType" 
                    value="strategy"
                    checked={analysisType === 'strategy'}
                    onChange={() => setAnalysisType('strategy')}
                    className="mt-1" 
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium">Strategy Analysis</span>
                    <span className="block text-xs text-secondary-500">Evaluate code structure, logic, and risk management</span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-secondary-200 rounded-md hover:bg-secondary-50">
                  <input 
                    type="radio" 
                    name="analysisType" 
                    value="backtest"
                    checked={analysisType === 'backtest'}
                    onChange={() => setAnalysisType('backtest')}
                    className="mt-1" 
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium">Backtest Analysis</span>
                    <span className="block text-xs text-secondary-500">Evaluate performance metrics and results</span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-secondary-200 rounded-md hover:bg-secondary-50">
                  <input 
                    type="radio" 
                    name="analysisType" 
                    value="optimization"
                    checked={analysisType === 'optimization'}
                    onChange={() => setAnalysisType('optimization')}
                    className="mt-1" 
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium">Strategy Optimization</span>
                    <span className="block text-xs text-secondary-500">Suggest parameter improvements based on backtest</span>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-secondary-200 rounded-md hover:bg-secondary-50">
                  <input 
                    type="radio" 
                    name="analysisType" 
                    value="enhancement"
                    checked={analysisType === 'enhancement'}
                    onChange={() => setAnalysisType('enhancement')}
                    className="mt-1" 
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium">Strategy Enhancement</span>
                    <span className="block text-xs text-secondary-500">Generate improved version with better risk management</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Template
              </label>
              <select 
                className="select"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="default">Default Strategy Analysis</option>
                <option value="detailed">Detailed Analysis with Code Review</option>
                <option value="beginner">Beginner-Friendly Explanation</option>
                <option value="advanced">Advanced Performance Analysis</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                LLM Provider
              </label>
              <select 
                className="select"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
              >
                <option value="openai">OpenAI (Default)</option>
                <option value="anthropic">Anthropic Claude</option>
                <option value="mock">Mock Provider (Testing)</option>
              </select>
            </div>
          </div>

          <div className="card bg-primary-50 border border-primary-200">
            <h2 className="text-xl font-semibold text-primary-800 mb-4">Analysis Summary</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex-between">
                <span className="text-secondary-600">Analysis Type:</span>
                <span className="font-medium">
                  {analysisType === 'strategy' && 'Strategy Analysis'}
                  {analysisType === 'backtest' && 'Backtest Analysis'}
                  {analysisType === 'optimization' && 'Strategy Optimization'}
                  {analysisType === 'enhancement' && 'Strategy Enhancement'}
                </span>
              </li>
              <li className="flex-between">
                <span className="text-secondary-600">Template:</span>
                <span className="font-medium">{selectedTemplate}</span>
              </li>
              <li className="flex-between">
                <span className="text-secondary-600">Provider:</span>
                <span className="font-medium">
                  {selectedProvider === 'openai' && 'OpenAI'}
                  {selectedProvider === 'anthropic' && 'Anthropic Claude'}
                  {selectedProvider === 'mock' && 'Mock Provider'}
                </span>
              </li>
              <li className="flex-between">
                <span className="text-secondary-600">Strategy Code:</span>
                <span className="font-medium">
                  {strategyCode ? '✅ Provided' : selectedStrategy ? '✅ Selected' : '❌ Missing'}
                </span>
              </li>
              <li className="flex-between">
                <span className="text-secondary-600">Trade Results:</span>
                <span className="font-medium">
                  {tradeResultsFile ? '✅ Uploaded' : '❌ Not included'}
                </span>
              </li>
              <li className="flex-between">
                <span className="text-secondary-600">Historical Data:</span>
                <span className="font-medium">
                  {historicalDataFile ? '✅ Uploaded' : '❌ Not included'}
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <button 
                className="btn btn-primary w-full"
                disabled={!strategyCode && !selectedStrategy}
              >
                Start Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 