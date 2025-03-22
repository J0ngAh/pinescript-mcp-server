"""
Example test cases using the AI-powered UI testing framework.

This module demonstrates how to use the AI testing framework
with both pytest integration and standalone scripts.
"""

import os
import asyncio
import pytest

from .assistant_test_agent import AssistantTestAgent
from .pytest_integration import ai_test_case, parameterized_ai_tests

# Basic counter test using the AI testing framework with pytest
@ai_test_case("counter")
async def test_counter_functionality(agent, result):
    """Test the basic counter functionality using AI assistant."""
    # We can add additional verification if needed
    assert "counter increases" in result["message"].lower()
    return True

# Test navigation using parameterized tests
@parameterized_ai_tests({
    "navigation_home": "Test navigation to the home page. Verify the page title contains 'PineScript MCP'.",
    "navigation_strategies": "Test navigation to the strategies page. Verify strategy cards are displayed."
})
async def test_navigation(agent, result, scenario_name):
    """Test navigation between different pages."""
    # Custom verification based on the scenario
    if scenario_name == "navigation_home":
        assert "page title" in result["message"].lower()
    elif scenario_name == "navigation_strategies":
        assert "strategy cards" in result["message"].lower()
    return True

# File upload test using custom instructions
@ai_test_case("Test the file upload functionality on the analyze page. Navigate to /analyze, upload the test file 'tests/data/trades.csv', and verify the file name appears.")
async def test_file_upload(agent, result):
    """Test the file upload functionality on the analyze page."""
    assert "file" in result["message"].lower() and "upload" in result["message"].lower()
    return True

# Custom test with specific verification
@pytest.mark.asyncio
async def test_custom_workflow(ai_test_agent):
    """Test a custom workflow with specific verification steps."""
    instructions = """
    Test the analyze page functionality:
    1. Navigate to /analyze
    2. Enter 'strategy(\"My Test Strategy\")' in the code editor
    3. Click the 'Analyze' button
    4. Verify that results are displayed
    """
    
    result = await ai_test_agent.run_test(instructions)
    
    # Custom verification
    assert result["success"], f"Test failed: {result.get('message')}"
    assert "analyze" in result["message"].lower()
    assert "results" in result["message"].lower()
    
    # Return additional test information
    return {
        "test_name": "custom_workflow",
        "success": result["success"],
        "details": result["message"]
    }

# Example of a standalone test script (can be run directly)
async def run_standalone_tests():
    """Run standalone tests without pytest."""
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable not set")
        return False
        
    base_url = os.environ.get("TEST_BASE_URL", "http://localhost:5001")
    agent = AssistantTestAgent(api_key=api_key, base_url=base_url)
    
    try:
        await agent.setup()
        
        # Test counter functionality
        counter_result = await agent.run_test(
            "Test the counter functionality on the test page. "
            "Navigate to /test, verify the initial counter is 0, "
            "click the increment button, and verify the counter increases to 1."
        )
        print(f"Counter test result: {'SUCCESS' if counter_result['success'] else 'FAILURE'}")
        print(f"Message: {counter_result['message']}")
        
        # Test strategies page
        strategies_result = await agent.run_test(
            "Test the strategies listing page. Navigate to /strategies and "
            "verify that strategy cards are displayed with names and descriptions."
        )
        print(f"\nStrategies test result: {'SUCCESS' if strategies_result['success'] else 'FAILURE'}")
        print(f"Message: {strategies_result['message']}")
        
        return counter_result["success"] and strategies_result["success"]
    finally:
        await agent.teardown()

if __name__ == "__main__":
    # Run the standalone tests when executed directly
    asyncio.run(run_standalone_tests()) 