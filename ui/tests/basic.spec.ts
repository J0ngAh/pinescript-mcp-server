import { test, expect } from '@playwright/test';

// Basic navigation tests
test.describe('Basic Navigation Tests', () => {
  test('NAV-001: Homepage loads correctly', async ({ page }) => {
    await page.goto('http://localhost:5001');
    
    // Check page title
    await expect(page).toHaveTitle(/MCP|PineScript/);
    
    // Check main content exists
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    
    // Check navigation exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
  
  test('NAV-002: Navigation links work correctly', async ({ page }) => {
    await page.goto('http://localhost:5001');
    
    // Click on Strategies link and verify navigation
    const strategiesLink = page.getByRole('link', { name: /strategies/i });
    if (await strategiesLink.isVisible()) {
      await strategiesLink.click();
      await expect(page).toHaveURL(/strategies/);
    }
    
    // Click on Templates link and verify navigation
    await page.goto('http://localhost:5001');
    const templatesLink = page.getByRole('link', { name: /templates/i });
    if (await templatesLink.isVisible()) {
      await templatesLink.click();
      await expect(page).toHaveURL(/templates/);
    }
    
    // Click on Analyze link and verify navigation
    await page.goto('http://localhost:5001');
    const analyzeLink = page.getByRole('link', { name: /analyze/i });
    if (await analyzeLink.isVisible()) {
      await analyzeLink.click();
      await expect(page).toHaveURL(/analyze/);
    }
  });
});

// Strategies page tests
test.describe('Strategies Page Tests', () => {
  test('STRAT-001: Strategies page displays list of strategies', async ({ page }) => {
    await page.goto('http://localhost:5001/strategies');
    
    // Check for strategy cards
    const strategyCards = page.locator('.card');
    
    // There should be at least one strategy card
    const count = await strategyCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Check that each card has necessary content
    const firstCard = strategyCards.first();
    await expect(firstCard.locator('h2')).toBeVisible(); // Title
    await expect(firstCard.locator('p')).toBeVisible(); // Description
  });
});

// Analysis page tests
test.describe('Analysis Page Tests', () => {
  test('ANALYZE-001: Strategy code can be entered and persists', async ({ page }) => {
    await page.goto('http://localhost:5001/analyze');
    
    // Enter strategy code
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    await textarea.fill('strategy("My Test Strategy") => { }');
    
    // Change another option to trigger state update
    const analysisType = page.locator('select').first();
    await analysisType.selectOption('backtest');
    
    // Verify text persists
    await expect(textarea).toHaveValue('strategy("My Test Strategy") => { }');
  });
  
  test('ANALYZE-005: Analysis options can be selected', async ({ page }) => {
    await page.goto('http://localhost:5001/analyze');
    
    // Select a different analysis type
    const analysisType = page.locator('select').filter({ hasText: 'Analysis Type' });
    await analysisType.selectOption('backtest');
    
    // Verify selection was made
    await expect(analysisType).toHaveValue('backtest');
  });
});

// Test page tests
test.describe('Test Page Tests', () => {
  test('TEST-001: Counter functionality works correctly', async ({ page }) => {
    await page.goto('http://localhost:5001/test');
    
    // Get initial counter value
    const counterText = page.locator('p', { hasText: 'Counter:' });
    await expect(counterText).toContainText('Counter: 0');
    
    // Click the button
    const button = page.locator('button', { hasText: 'Increment' });
    await button.click();
    
    // Verify counter increased
    await expect(counterText).toContainText('Counter: 1');
    
    // Click multiple times
    await button.click();
    await button.click();
    
    // Verify counter increased accordingly
    await expect(counterText).toContainText('Counter: 3');
  });
}); 