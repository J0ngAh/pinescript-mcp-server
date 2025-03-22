"""
PyTest integration for OpenAI Assistants API UI testing.

This module provides PyTest fixtures and utilities to integrate
the AI-powered UI testing framework with PyTest.
"""

import os
import json
import asyncio
import pytest
from pathlib import Path
from typing import Dict, List, Any, Optional

from .assistant_test_agent import AssistantTestAgent
from .sample_test_data import DETAILED_TEST_SCENARIOS

# Default test output directory
DEFAULT_OUTPUT_DIR = Path(__file__).parent / "test_results"

# Fixture for the AssistantTestAgent
@pytest.fixture
async def ai_test_agent():
    """Provide an AssistantTestAgent instance for testing."""
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        pytest.skip("OPENAI_API_KEY environment variable not set")
        
    base_url = os.environ.get("TEST_BASE_URL", "http://localhost:5001")
    agent = AssistantTestAgent(api_key=api_key, base_url=base_url)
    
    # Set up the agent
    await agent.setup()
    
    yield agent
    
    # Clean up resources
    await agent.teardown()

# Pytest wrapper for AI test cases
def ai_test_case(scenario_name: str, description: Optional[str] = None):
    """
    Decorator for creating AI-powered test cases.
    
    Args:
        scenario_name: Name of the test scenario or custom instructions
        description: Optional description for the test report
    """
    def decorator(func):
        # Get the test instructions from predefined scenarios or use custom
        test_instructions = DETAILED_TEST_SCENARIOS.get(scenario_name, scenario_name)
        
        # Mark as asyncio test
        @pytest.mark.asyncio
        async def wrapper(ai_test_agent):
            # Store test metadata
            metadata = {
                "name": func.__name__,
                "description": description or func.__doc__ or "",
                "scenario": scenario_name,
                "instructions": test_instructions
            }
            
            # Run the test with AI agent
            result = await ai_test_agent.run_test(test_instructions)
            
            # Save test results
            os.makedirs(DEFAULT_OUTPUT_DIR, exist_ok=True)
            with open(DEFAULT_OUTPUT_DIR / f"{func.__name__}.json", "w") as f:
                json.dump({**metadata, **result}, f, indent=2)
            
            # Additional custom verification logic from the test function
            custom_result = await func(ai_test_agent, result)
            
            # Assert test success
            assert result["success"], f"AI test failed: {result.get('message', 'Unknown error')}"
            
            if custom_result is not None:
                assert custom_result, "Custom assertions failed"
                
            return result
            
        return wrapper
    return decorator

# Helper to parameterize AI tests with different scenarios
def parameterized_ai_tests(test_scenarios: Dict[str, str]):
    """
    Create parameterized tests from multiple test scenarios.
    
    Args:
        test_scenarios: Dictionary mapping scenario names to test instructions
    """
    def decorator(func):
        scenarios = [(name, desc) for name, desc in test_scenarios.items()]
        
        @pytest.mark.asyncio
        @pytest.mark.parametrize("scenario_name,instructions", scenarios)
        async def wrapper(ai_test_agent, scenario_name, instructions):
            result = await ai_test_agent.run_test(instructions)
            
            # Save test results
            os.makedirs(DEFAULT_OUTPUT_DIR, exist_ok=True)
            with open(DEFAULT_OUTPUT_DIR / f"{func.__name__}_{scenario_name}.json", "w") as f:
                json.dump({
                    "name": f"{func.__name__}_{scenario_name}",
                    "scenario": scenario_name,
                    "instructions": instructions,
                    **result
                }, f, indent=2)
            
            # Run custom verification if provided
            custom_result = await func(ai_test_agent, result, scenario_name)
            
            # Assert test success
            assert result["success"], f"AI test failed: {result.get('message', 'Unknown error')}"
            
            if custom_result is not None:
                assert custom_result, "Custom assertions failed"
                
            return result
            
        return wrapper
    return decorator

# Example usage:
"""
@ai_test_case("counter")
async def test_counter_functionality(agent, result):
    # Optional custom verification logic
    assert "counter increases to 1" in result["message"]
    return True

@parameterized_ai_tests({
    "navigation_home": "Test navigation to the home page",
    "navigation_strategies": "Test navigation to the strategies page"
})
async def test_navigation(agent, result, scenario_name):
    # Can perform additional verification based on scenario_name
    return True
""" 