# AI-Powered UI Testing

This module provides a framework for automated UI testing of the PineScript MCP application using OpenAI's Assistants API and Playwright for browser automation.

## Overview

The AI-Powered UI Testing framework allows you to:

- Define tests in natural language
- Automatically interact with UI elements
- Run test scenarios without writing explicit test code
- Generate detailed test reports
- Adapt to UI changes with minimal test maintenance

## Components

- `assistant_test_agent.py`: Core agent that integrates with OpenAI and Playwright
- `run_tests.py`: CLI script for running predefined test scenarios
- `__init__.py`: Package exports and documentation

## Getting Started

### Prerequisites

- Python 3.8+
- OpenAI API key with access to Assistants API
- Playwright installed and browsers installed

### Installation

1. Install Python dependencies:
   ```
   pip install openai playwright
   ```

2. Install Playwright browsers:
   ```
   playwright install
   ```

### Running Tests

Basic usage:

```sh
# Run all tests
python -m ui.tests.ai_testing.run_tests --url http://localhost:5001 --api-key YOUR_OPENAI_API_KEY

# Run a specific test
python -m ui.tests.ai_testing.run_tests --test counter --url http://localhost:5001 --api-key YOUR_OPENAI_API_KEY

# Use environment variable for API key
export OPENAI_API_KEY=YOUR_OPENAI_API_KEY
python -m ui.tests.ai_testing.run_tests
```

### Test Scenarios

The following test scenarios are predefined:

- `counter`: Tests the counter functionality on the test page
- `strategies-listing`: Tests the strategies listing page
- `file-upload`: Tests the file upload functionality
- `analyze-code`: Tests the strategy code input
- `navigation`: Tests the main navigation links

### Customizing Tests

To add new test scenarios, edit the `TEST_SCENARIOS` dictionary in `run_tests.py`.

## How It Works

1. The assistant is initialized with UI testing capabilities
2. Natural language test instructions are sent to the assistant
3. The assistant breaks down the test into a sequence of browser operations
4. Playwright executes these operations and returns results
5. The assistant evaluates success criteria and reports results

## Example Test

Example of a natural language test instruction:

```
Test the counter functionality on the test page. Navigate to /test, 
verify the initial counter is 0, click the increment button, and 
verify the counter increases to 1.
```

This will be automatically translated to UI operations without manual coding. 