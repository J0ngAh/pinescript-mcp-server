#!/usr/bin/env python
"""
Test runner script for AI-powered UI testing.

This script runs automated tests using the OpenAI Assistants API and Playwright
to verify the functionality of the PineScript MCP UI.
"""

import os
import sys
import argparse
import asyncio
import json
from datetime import datetime
from pathlib import Path

from .assistant_test_agent import AssistantTestAgent

# Define the test scenarios
TEST_SCENARIOS = {
    "counter": "Test the counter functionality on the test page. "
              "Navigate to /test, verify the initial counter is 0, "
              "click the increment button, and verify the counter increases to 1.",
              
    "strategies-listing": "Test the strategies listing page. "
                         "Navigate to /strategies, verify that strategy cards are displayed, "
                         "and check that each card shows the strategy name, description, and performance metrics.",
                         
    "file-upload": "Test the file upload functionality on the analyze page. "
                  "Navigate to /analyze, upload the test file 'tests/data/trades.csv' to the trade results upload area, "
                  "and verify the file name is displayed.",
                  
    "analyze-code": "Test the strategy code input on the analyze page. "
                   "Navigate to /analyze, enter 'strategy(\"Test Strategy\")' in the strategy code textarea, "
                   "change the analysis type selection, and verify the entered code persists.",
                   
    "navigation": "Test the main navigation links. "
                 "Starting from the home page, click each navigation link (Strategies, Templates, Analyze) "
                 "and verify that the correct page loads for each."
}

async def run_single_test(test_name, base_url, api_key, output_dir):
    """Run a single test by name."""
    if test_name not in TEST_SCENARIOS:
        print(f"Error: Unknown test '{test_name}'. Available tests: {', '.join(TEST_SCENARIOS.keys())}")
        return False
        
    test_instruction = TEST_SCENARIOS[test_name]
    agent = AssistantTestAgent(api_key=api_key, base_url=base_url)
    
    try:
        await agent.setup()
        result = await agent.run_test(test_instruction)
        
        # Save test result to output directory
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            result_file = os.path.join(output_dir, f"{test_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
            with open(result_file, 'w') as f:
                json.dump(result, f, indent=2)
                
        return result["success"]
    finally:
        await agent.teardown()

async def run_all_tests(base_url, api_key, output_dir):
    """Run all defined tests."""
    agent = AssistantTestAgent(api_key=api_key, base_url=base_url)
    results = {}
    
    try:
        await agent.setup()
        
        for test_name, test_instruction in TEST_SCENARIOS.items():
            print(f"\n===== Running test: {test_name} =====")
            result = await agent.run_test(test_instruction)
            results[test_name] = result
            
        # Save all results to output directory
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            result_file = os.path.join(output_dir, f"all_tests_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
            with open(result_file, 'w') as f:
                json.dump(results, f, indent=2)
                
        # Print summary
        passed = sum(1 for r in results.values() if r["success"])
        failed = len(results) - passed
        print(f"\n===== Test Results: {passed} passed, {failed} failed =====")
        for test_name, result in results.items():
            status = "PASS" if result["success"] else "FAIL"
            print(f"{status}: {test_name}")
            
        return failed == 0
    finally:
        await agent.teardown()

def main():
    """Parse arguments and run tests."""
    parser = argparse.ArgumentParser(description="Run AI-powered UI tests")
    parser.add_argument("--test", help="Specific test to run (omit to run all tests)")
    parser.add_argument("--url", default="http://localhost:5001", help="Base URL of the application (default: http://localhost:5001)")
    parser.add_argument("--api-key", help="OpenAI API key (defaults to OPENAI_API_KEY environment variable)")
    parser.add_argument("--output-dir", default="test_results", help="Directory to save test results (default: test_results)")
    
    args = parser.parse_args()
    
    # Get API key from args or environment
    api_key = args.api_key or os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OpenAI API key must be provided via --api-key or OPENAI_API_KEY environment variable")
        sys.exit(1)
    
    if args.test:
        # Run a specific test
        success = asyncio.run(run_single_test(args.test, args.url, api_key, args.output_dir))
    else:
        # Run all tests
        success = asyncio.run(run_all_tests(args.url, api_key, args.output_dir))
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 