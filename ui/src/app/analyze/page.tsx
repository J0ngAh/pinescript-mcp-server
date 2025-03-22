'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
// Temporarily comment out the Supabase import
// import { logFileUpload } from '@/lib/supabaseClient';

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

  // Simplified version that doesn't use Supabase
  const handleTradeResultsUpload = async (file: File) => {
    try {
      setTradeResultsFile(file);
      console.log('Trade results file uploaded:', file.name);
    } catch (error) {
      console.error('Error processing trade results file:', error);
      setUploadErrors(prev => ({
        ...prev, 
        trades: 'Error processing file. Please check the format and try again.'
      }));
    }
  };

  const handleHistoricalDataUpload = async (file: File) => {
    try {
      setHistoricalDataFile(file);
      console.log('Historical data file uploaded:', file.name);
    } catch (error) {
      console.error('Error processing historical data file:', error);
      setUploadErrors(prev => ({
        ...prev, 
        historical: 'Error processing file. Please check the format and try again.'
      }));
    }
  };

  // Handle click on trade results upload area
  const handleTradeResultsClick = () => {
    tradeResultsInputRef.current?.click();
  };

  // Handle click on historical data upload area
  const handleHistoricalDataClick = () => {
    historicalDataInputRef.current?.click();
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

  // Simplified version for drag events
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
      handleTradeResultsUpload(e.dataTransfer.files[0]);
    }
  };

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
      handleHistoricalDataUpload(e.dataTransfer.files[0]);
    }
  };

  // Simple cleanup functions
  const handleRemoveTradeResults = () => {
    setTradeResultsFile(null);
    setTradeResultsPreview([]);
    setUploadErrors(prev => ({...prev, trades: undefined}));
  };

  const handleRemoveHistoricalData = () => {
    setHistoricalDataFile(null);
    setHistoricalDataPreview([]);
    setUploadErrors(prev => ({...prev, historical: undefined}));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Strategy Analysis</h1>
      <p className="mb-6">This is a simplified version of the analyze page for testing.</p>
      
      <div className="card p-6 border rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Strategy Code</h2>
        <textarea 
          className="w-full h-40 p-4 border rounded-md font-mono" 
          placeholder="Enter your PineScript strategy here..."
          value={strategyCode}
          onChange={handleStrategyCodeChange}
        ></textarea>
      </div>
      
      <div className="card p-6 border rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
        
        <div className="mb-4">
          <label className="block font-medium mb-2">Trade Results:</label>
          <div 
            className={`border ${isDraggingTrades ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300'} rounded-md p-8 text-center cursor-pointer`}
            onClick={handleTradeResultsClick}
            onDragOver={handleTradeResultsDragOver}
            onDragLeave={handleTradeResultsDragLeave}
            onDrop={handleTradeResultsDrop}
          >
            {tradeResultsFile ? (
              <p>Uploaded: {tradeResultsFile.name}</p>
            ) : (
              <p>Drop trade results file here, or click to browse</p>
            )}
            <input
              type="file"
              ref={tradeResultsInputRef}
              onChange={handleTradeResultsFileChange}
              className="hidden"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block font-medium mb-2">Historical Data:</label>
          <div 
            className={`border ${isDraggingHistorical ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300'} rounded-md p-8 text-center cursor-pointer`}
            onClick={handleHistoricalDataClick}
            onDragOver={handleHistoricalDataDragOver}
            onDragLeave={handleHistoricalDataDragLeave}
            onDrop={handleHistoricalDataDrop}
          >
            {historicalDataFile ? (
              <p>Uploaded: {historicalDataFile.name}</p>
            ) : (
              <p>Drop historical data file here, or click to browse</p>
            )}
            <input
              type="file"
              ref={historicalDataInputRef}
              onChange={handleHistoricalDataFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>
      
      <div className="card p-6 border rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Analysis Options</h2>
        
        <div className="mb-4">
          <label className="block font-medium mb-2">Analysis Type:</label>
          <select 
            className="w-full p-2 border rounded-md"
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
          >
            <option value="strategy">Strategy Analysis</option>
            <option value="backtest">Backtest Analysis</option>
            <option value="optimization">Strategy Optimization</option>
            <option value="enhancement">Strategy Enhancement</option>
          </select>
        </div>
        
        <button className="w-full py-2 bg-blue-500 text-white rounded-md">
          Start Analysis
        </button>
      </div>
      
      <p className="text-sm text-gray-500">
        If you're seeing this page, basic Next.js rendering for the analyze page is working correctly.
      </p>
    </div>
  );
} 