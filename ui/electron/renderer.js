// Renderer process - UI logic for the Electron app

// Set current year in the footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Navigation handlers
document.getElementById('nav-home').addEventListener('click', (e) => {
  e.preventDefault();
  showView('home-view');
});

document.getElementById('nav-strategies').addEventListener('click', (e) => {
  e.preventDefault();
  showView('strategies-view');
  loadStrategies();
});

document.getElementById('nav-backtest').addEventListener('click', (e) => {
  e.preventDefault();
  showView('backtest-view');
});

document.getElementById('nav-analyze').addEventListener('click', (e) => {
  e.preventDefault();
  showView('analyze-view');
});

// Button handlers
document.getElementById('browse-strategies-btn').addEventListener('click', () => {
  showView('strategies-view');
  loadStrategies();
});

document.getElementById('view-backtest-btn').addEventListener('click', () => {
  showView('backtest-view');
});

document.getElementById('run-analysis-btn').addEventListener('click', () => {
  runAnalysis();
});

// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Helper functions
function showView(viewId) {
  // Hide all views
  const views = ['home-view', 'strategies-view', 'backtest-view', 'analyze-view'];
  views.forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  
  // Show the selected view
  document.getElementById(viewId).classList.remove('hidden');
  
  // Update active nav item
  const navItems = {
    'home-view': 'nav-home',
    'strategies-view': 'nav-strategies',
    'backtest-view': 'nav-backtest',
    'analyze-view': 'nav-analyze'
  };
  
  Object.keys(navItems).forEach(view => {
    const navItem = document.getElementById(navItems[view]);
    if (view === viewId) {
      navItem.classList.add('border-blue-500', 'text-gray-900');
      navItem.classList.remove('border-transparent', 'text-gray-500');
    } else {
      navItem.classList.remove('border-blue-500', 'text-gray-900');
      navItem.classList.add('border-transparent', 'text-gray-500');
    }
  });
}

// Load strategies from the main process
async function loadStrategies() {
  const strategiesList = document.getElementById('strategies-list');
  strategiesList.innerHTML = '<div class="bg-white p-4 rounded shadow"><h3 class="font-bold">Loading strategies...</h3></div>';
  
  try {
    const strategies = await window.electron.getStrategies() || [];
    
    if (strategies.length === 0) {
      // Sample strategies if none are found
      const sampleStrategies = [
        {
          id: 1,
          name: 'Improved Gold Scalping',
          description: 'Enhanced scalping strategy for gold with BOS/CHoCH detection and dynamic risk management.',
          winRate: '68.5%',
          profit: '+24.7%'
        },
        {
          id: 2,
          name: 'MACD Crossover',
          description: 'Traditional MACD crossover strategy with optimized parameters for crypto markets.',
          winRate: '62.1%',
          profit: '+18.3%'
        },
        {
          id: 3,
          name: 'RSI Reversal',
          description: 'RSI-based mean reversion strategy with adaptive thresholds.',
          winRate: '57.9%',
          profit: '+12.5%'
        }
      ];
      
      renderStrategies(sampleStrategies);
    } else {
      renderStrategies(strategies);
    }
  } catch (error) {
    console.error('Error loading strategies:', error);
    strategiesList.innerHTML = `
      <div class="bg-white p-4 rounded shadow col-span-full">
        <h3 class="font-bold text-red-600">Error loading strategies</h3>
        <p class="text-gray-700 mt-2">Unable to load strategies. Please try again later.</p>
      </div>
    `;
  }
}

function renderStrategies(strategies) {
  const strategiesList = document.getElementById('strategies-list');
  
  if (strategies.length === 0) {
    strategiesList.innerHTML = `
      <div class="bg-white p-4 rounded shadow col-span-full">
        <h3 class="font-bold">No strategies found</h3>
        <p class="text-gray-700 mt-2">No strategies are available yet.</p>
      </div>
    `;
    return;
  }
  
  strategiesList.innerHTML = strategies.map(strategy => `
    <div class="bg-white p-5 rounded-lg shadow-md">
      <h3 class="text-xl font-bold text-gray-900 mb-2">${strategy.name}</h3>
      <p class="text-gray-600 mb-4">${strategy.description}</p>
      <div class="flex justify-between items-center">
        <div>
          <span class="text-sm text-gray-500">Win Rate</span>
          <p class="font-semibold text-blue-600">${strategy.winRate}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Profit</span>
          <p class="font-semibold text-green-600">${strategy.profit}</p>
        </div>
      </div>
      <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <button class="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition duration-150 ease-in-out text-sm" 
                onclick="viewStrategy(${strategy.id})">
          View Details
        </button>
        <button class="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition duration-150 ease-in-out text-sm"
                onclick="analyzeStrategy(${strategy.id})">
          Analyze
        </button>
      </div>
    </div>
  `).join('');
}

// Make these functions available to the HTML
window.viewStrategy = function(id) {
  console.log(`Viewing strategy ${id}`);
  // Implementation would go here
  alert(`Viewing details for strategy ${id}`);
};

window.analyzeStrategy = function(id) {
  console.log(`Analyzing strategy ${id}`);
  showView('analyze-view');
  document.getElementById('strategy-select').value = id;
};

// Run strategy analysis
function runAnalysis() {
  const strategyId = document.getElementById('strategy-select').value;
  const timeframe = document.getElementById('timeframe-select').value;
  
  if (!strategyId) {
    alert('Please select a strategy to analyze.');
    return;
  }
  
  console.log(`Running analysis for strategy ${strategyId} on ${timeframe} timeframe`);
  
  // This would normally fetch actual data from the backend
  setTimeout(() => {
    const resultsContainer = document.querySelector('#analyze-view .bg-gray-100');
    resultsContainer.innerHTML = `
      <div class="p-4">
        <h4 class="font-bold text-lg mb-3">Analysis Results</h4>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Expectancy:</span>
            <span class="font-medium text-green-600">2.38R</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Profit Factor:</span>
            <span class="font-medium">1.87</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Max Drawdown:</span>
            <span class="font-medium text-red-600">-12.7%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Most Profitable Setup:</span>
            <span class="font-medium text-green-600">BOS + Confluence</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Best Timeframe:</span>
            <span class="font-medium">4H</span>
          </div>
        </div>
        <div class="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
          <p class="text-sm">Recommendation: Consider increasing position size during high-volume periods and reducing during consolidation.</p>
        </div>
      </div>
    `;
  }, 1500);
} 