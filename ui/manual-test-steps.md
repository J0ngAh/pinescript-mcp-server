# Manual Test Execution Steps

This document provides step-by-step instructions for manually testing the PineScript MCP UI.

## Setup Instructions

1. Start the development server:
   ```
   cd ui
   npm install (if not already done)
   npm run dev
   ```

2. Open your browser and navigate to http://localhost:5001

## Test Execution Steps

### 1. Basic Navigation & Rendering Tests

#### 1.1 Homepage (NAV-001)
1. Navigate to http://localhost:5001
2. Verify the page loads with a title and main content area
3. Check that navigation links are visible
4. Record results in the test execution record

#### 1.2 Navigation Links (NAV-002)
1. Click on the "Strategies" link in the navigation
2. Verify you're taken to the strategies page
3. Return to the homepage
4. Click on the "Templates" link
5. Verify you're taken to the templates page
6. Return to the homepage
7. Click on the "Analyze" link
8. Verify you're taken to the analyze page
9. Record results in the test execution record

#### 1.3 Responsive Layout (NAV-003)
1. Resize your browser window to different sizes:
   - Desktop (1200px+)
   - Tablet (768px - 1199px)
   - Mobile (< 768px)
2. Verify the layout adjusts appropriately at each size
3. Check that navigation remains accessible (might become a hamburger menu)
4. Record results in the test execution record

### 2. Strategies Page Tests

#### 2.1 Strategies Listing (STRAT-001)
1. Navigate to /strategies
2. Verify that strategy cards are displayed
3. Check that each card shows:
   - Strategy name
   - Description
   - Performance metrics (win rate, profit factor, drawdown)
   - Tags
   - Last modified date
4. Record results in the test execution record

#### 2.2 Strategy Filtering (STRAT-002)
1. Navigate to /strategies
2. Enter a search term in the search input (e.g., "Moving Average")
3. Verify filtering works as expected
4. Clear the search
5. Use the tag dropdown to filter by a specific tag
6. Verify filtering works as expected
7. Use the sort dropdown to change sort order
8. Verify sorting works as expected
9. Record results in the test execution record

#### 2.3 Strategy Links (STRAT-003)
1. Navigate to /strategies
2. Click the "Analyze" icon on a strategy card
3. Verify you're taken to the analysis page
4. Return to the strategies page
5. Click the "Edit" icon on a strategy card
6. Verify you're taken to the edit page
7. Record results in the test execution record

### 3. Analysis Page Tests

#### 3.1 Strategy Code Input (ANALYZE-001)
1. Navigate to /analyze
2. Enter some code in the strategy code textarea
3. Change other options (e.g., analysis type)
4. Verify the code persists in the textarea
5. Record results in the test execution record

#### 3.2 File Upload - Trade Results (ANALYZE-002)
1. Navigate to /analyze
2. Create a simple CSV file with trade data (sample below)
3. Click on the trade results upload area
4. Select your CSV file from the file browser
5. Verify the file name appears in the upload area
6. Record results in the test execution record

Sample CSV:
```
date,symbol,type,price,size,profit
2023-01-01,BTC/USD,buy,40000,1,0
2023-01-02,BTC/USD,sell,42000,1,2000
```

#### 3.3 File Upload - Historical Data (ANALYZE-003)
1. Navigate to /analyze
2. Create a simple CSV file with historical price data (sample below)
3. Click on the historical data upload area
4. Select your CSV file from the file browser
5. Verify the file name appears in the upload area
6. Record results in the test execution record

Sample CSV:
```
date,open,high,low,close,volume
2023-01-01,40000,41000,39500,40500,1000
2023-01-02,40500,43000,40400,42000,1500
```

#### 3.4 Drag and Drop File Upload (ANALYZE-004)
1. Navigate to /analyze
2. Drag your trade results CSV file onto the trade results upload area
3. Verify the file name appears in the upload area
4. Drag your historical data CSV file onto the historical data upload area
5. Verify the file name appears in the upload area
6. Record results in the test execution record

#### 3.5 Analysis Options (ANALYZE-005)
1. Navigate to /analyze
2. Select different analysis types from the dropdown (Strategy Analysis, Backtest Analysis, etc.)
3. Verify the selection persists
4. Record results in the test execution record

#### 3.6 Start Analysis Button (ANALYZE-006)
1. Navigate to /analyze
2. Enter strategy code in the textarea
3. Verify the Start Analysis button is enabled
4. Clear the strategy code
5. Upload a trade results file
6. Verify the Start Analysis button is still enabled
7. Record results in the test execution record

### 4. Templates Page Tests

#### 4.1 Templates Listing (TEMPL-001)
1. Navigate to /templates
2. Verify that template cards/listings are displayed
3. Check that template information is visible
4. Record results in the test execution record

### 5. Test Page Tests

#### 5.1 Counter Functionality (TEST-001)
1. Navigate to /test
2. Note the initial counter value (should be 0)
3. Click the Increment button
4. Verify the counter increases to 1
5. Click the Increment button multiple times
6. Verify the counter increases accordingly
7. Record results in the test execution record

## Results Recording

After executing all tests, update the test execution record in the `functional-tests.md` file with:
- Execution date
- Your name as the tester
- Test result (Pass/Fail)
- Any notes or observations

## Sample CSV Files

For your convenience, here are sample CSV files you can use for testing:

### Trade Results (trades.csv)
```
date,symbol,type,price,size,profit
2023-01-01,BTC/USD,buy,40000,1,0
2023-01-02,BTC/USD,sell,42000,1,2000
2023-01-03,ETH/USD,buy,2000,5,0
2023-01-04,ETH/USD,sell,2200,5,1000
2023-01-05,BTC/USD,buy,41000,1.5,0
2023-01-06,BTC/USD,sell,39000,1.5,-3000
```

### Historical Data (history.csv)
```
date,open,high,low,close,volume
2023-01-01,40000,41000,39500,40500,1000
2023-01-02,40500,43000,40400,42000,1500
2023-01-03,42000,42500,41800,42200,1200
2023-01-04,42200,42300,41500,41700,900
2023-01-05,41700,42000,41000,41200,1100
2023-01-06,41200,41500,38500,39000,2000
``` 