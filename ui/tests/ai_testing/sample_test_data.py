"""
Sample test data and examples for the AI-powered UI testing module.

This file provides test data and examples that can be used for UI testing,
including test scenarios, element selectors, and sample verification criteria.
"""

# Test scenario descriptions with detailed instructions
DETAILED_TEST_SCENARIOS = {
    "login_workflow": """
    Test the user login workflow:
    1. Navigate to the login page
    2. Enter 'testuser@example.com' in the email field
    3. Enter 'password123' in the password field
    4. Click the login button
    5. Verify that the user is redirected to the dashboard page
    6. Verify that the user's name appears in the header
    """,
    
    "strategy_creation": """
    Test the strategy creation workflow:
    1. Navigate to the '/strategies/new' page
    2. Enter 'Test Strategy' in the strategy name field
    3. Enter 'This is a test strategy' in the description field
    4. Enter the following code in the strategy code editor:
       ```
       strategy("Test Strategy")
       longCondition = close > open
       if (longCondition)
           strategy.entry("Long", strategy.long)
       ```
    5. Click the 'Save Strategy' button
    6. Verify that a success message is displayed
    7. Verify that the strategy appears in the strategies list
    """,
    
    "dark_mode_toggle": """
    Test the dark mode toggle functionality:
    1. Navigate to the home page
    2. Verify the initial theme (check background color)
    3. Click the theme toggle button in the header
    4. Verify that the theme has changed (check the background color again)
    5. Click the theme toggle button again
    6. Verify that the theme has changed back to the original
    """
}

# Common CSS selectors used in the UI
COMMON_SELECTORS = {
    "navigation": {
        "home_link": "nav a[href='/']",
        "strategies_link": "nav a[href='/strategies']",
        "templates_link": "nav a[href='/templates']",
        "analyze_link": "nav a[href='/analyze']"
    },
    "buttons": {
        "primary_button": "button.bg-blue-600",
        "secondary_button": "button.bg-gray-200",
        "danger_button": "button.bg-red-600"
    },
    "forms": {
        "text_input": "input[type='text']",
        "textarea": "textarea",
        "checkbox": "input[type='checkbox']",
        "select": "select",
        "submit_button": "button[type='submit']"
    },
    "common": {
        "loading_spinner": ".spinner",
        "error_message": ".error-message",
        "success_message": ".success-message",
        "modal_dialog": ".modal-dialog",
        "modal_close": ".modal-dialog .close-button"
    }
}

# Sample test data for form inputs
SAMPLE_TEST_DATA = {
    "users": [
        {"email": "testuser@example.com", "password": "password123", "name": "Test User"},
        {"email": "admin@example.com", "password": "admin123", "name": "Admin User"}
    ],
    "strategies": [
        {
            "name": "Simple Moving Average Crossover",
            "description": "A basic moving average crossover strategy",
            "code": """
            strategy("SMA Crossover")
            fastMA = ta.sma(close, 10)
            slowMA = ta.sma(close, 20)
            if (ta.crossover(fastMA, slowMA))
                strategy.entry("Long", strategy.long)
            if (ta.crossunder(fastMA, slowMA))
                strategy.close("Long")
            """
        },
        {
            "name": "RSI Pullback",
            "description": "RSI pullback strategy for trending markets",
            "code": """
            strategy("RSI Pullback")
            rsiValue = ta.rsi(close, 14)
            if (rsiValue < 30)
                strategy.entry("Long", strategy.long)
            if (rsiValue > 70)
                strategy.close("Long")
            """
        }
    ],
    "filepath_samples": {
        "csv": "tests/data/sample_trades.csv",
        "json": "tests/data/sample_results.json"
    }
}

# Example verification criteria
VERIFICATION_CRITERIA = {
    "counter_test": [
        {"type": "element_text", "selector": "#counter-value", "expected": "0", "description": "Initial counter value should be 0"},
        {"type": "element_text", "selector": "#counter-value", "expected": "1", "description": "Counter value after increment should be 1"},
    ],
    "strategies_page": [
        {"type": "element_exists", "selector": ".strategy-card", "description": "Strategy cards should be displayed"},
        {"type": "element_count", "selector": ".strategy-card", "minimum": 1, "description": "At least one strategy card should be present"},
        {"type": "element_text", "selector": ".strategy-card h3", "contains": True, "description": "Strategy cards should contain strategy names"}
    ]
}

# Example full test sequence
EXAMPLE_TEST_SEQUENCE = [
    {"action": "navigate", "url": "/test"},
    {"action": "wait_for_selector", "selector": "#counter-value"},
    {"action": "get_text", "selector": "#counter-value", "store_as": "initial_value"},
    {"action": "verify", "stored_value": "initial_value", "expected": "0"},
    {"action": "click", "selector": "#increment-button"},
    {"action": "wait_for_selector", "selector": "#counter-value"},
    {"action": "get_text", "selector": "#counter-value", "store_as": "new_value"},
    {"action": "verify", "stored_value": "new_value", "expected": "1"}
]

# Helper for generating test data
def generate_test_data(scenario_name=None):
    """Generate sample test data for a specific scenario or return all data."""
    if scenario_name:
        if scenario_name in DETAILED_TEST_SCENARIOS:
            return {
                "description": DETAILED_TEST_SCENARIOS[scenario_name],
                "selectors": COMMON_SELECTORS,
                "test_data": SAMPLE_TEST_DATA
            }
        return None
    
    return {
        "scenarios": DETAILED_TEST_SCENARIOS,
        "selectors": COMMON_SELECTORS,
        "test_data": SAMPLE_TEST_DATA,
        "verification": VERIFICATION_CRITERIA,
        "example_sequence": EXAMPLE_TEST_SEQUENCE
    } 