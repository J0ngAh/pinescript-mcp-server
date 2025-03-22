import React from 'react';
import { BacktestResultsVisualization } from '../components/backtesting';
import Layout from '../components/Layout';

const BacktestResultsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Strategy Backtest Results</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          This page displays the backtest results for the improved Gold Scalping BOS & CHoCH strategy, 
          showcasing performance metrics, equity curve, drawdowns, and monthly returns compared to the original strategy.
        </p>
        <BacktestResultsVisualization />
      </div>
    </Layout>
  );
};

export default BacktestResultsPage; 