"""
OpenAI Assistants API Test Agent Module

This module provides a framework for AI-powered UI testing using OpenAI's Assistants API.
It integrates with Playwright for browser automation and enables natural language test definition.
"""

import os
import json
import time
from typing import Dict, List, Any, Optional
from datetime import datetime
import asyncio

from openai import OpenAI
from playwright.async_api import async_playwright, Page, Browser, BrowserContext

class AssistantTestAgent:
    """
    A test agent powered by OpenAI's Assistants API that can execute UI tests
    using Playwright for browser automation.
    """
    
    def __init__(
        self, 
        api_key: Optional[str] = None,
        model: str = "gpt-4o", 
        assistant_name: str = "UI Test Assistant",
        base_url: str = "http://localhost:5001"
    ):
        """
        Initialize the Assistant Test Agent.
        
        Args:
            api_key: OpenAI API key (defaults to OPENAI_API_KEY environment variable)
            model: Model to use for the assistant
            assistant_name: Name for the test assistant
            base_url: Base URL of the application to test
        """
        self.api_key = api_key or os.environ.get("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key must be provided or set as OPENAI_API_KEY environment variable")
        
        self.client = OpenAI(api_key=self.api_key)
        self.model = model
        self.assistant_name = assistant_name
        self.base_url = base_url
        self.assistant_id = None
        self.thread_id = None
        self.browser = None
        self.context = None
        self.page = None
        self.log_file = f"test_run_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
        
        self.test_results = {
            "passed": 0,
            "failed": 0,
            "total": 0,
            "details": []
        }
    
    async def setup(self):
        """Set up the test agent, creating the assistant and browser context."""
        await self._log("Setting up test agent...")
        
        # Create or retrieve the test assistant
        self.assistant_id = await self._create_assistant()
        await self._log(f"Using assistant with ID: {self.assistant_id}")
        
        # Create a thread for the conversation
        thread = self.client.beta.threads.create()
        self.thread_id = thread.id
        await self._log(f"Created thread with ID: {self.thread_id}")
        
        # Initialize Playwright
        playwright = await async_playwright().start()
        self.browser = await playwright.chromium.launch(headless=False)
        self.context = await self.browser.new_context()
        self.page = await self.context.new_page()
        await self._log("Browser initialized")
    
    async def teardown(self):
        """Clean up resources."""
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        await self._log("Test agent teardown complete")
        
        # Print test summary
        print(f"\nTest Results: {self.test_results['passed']} passed, {self.test_results['failed']} failed")
        
    async def run_test(self, test_instruction: str, wait_time: int = 120):
        """
        Run a test based on a natural language instruction.
        
        Args:
            test_instruction: Natural language description of the test to run
            wait_time: Maximum time to wait for test completion in seconds
        
        Returns:
            Dict containing test results
        """
        await self._log(f"Running test: {test_instruction}")
        
        # Add test request to thread
        self.client.beta.threads.messages.create(
            thread_id=self.thread_id,
            role="user",
            content=test_instruction
        )
        
        # Create and monitor run
        run = self.client.beta.threads.runs.create(
            thread_id=self.thread_id,
            assistant_id=self.assistant_id
        )
        
        # Poll for completions and required actions
        start_time = time.time()
        while time.time() - start_time < wait_time:
            run = self.client.beta.threads.runs.retrieve(
                thread_id=self.thread_id,
                run_id=run.id
            )
            
            if run.status == "completed":
                # Get the final response
                messages = self.client.beta.threads.messages.list(
                    thread_id=self.thread_id
                )
                for message in messages.data:
                    if message.role == "assistant":
                        latest_message = message.content[0].text.value
                        await self._log(f"Test completed: {latest_message}")
                        return self._process_test_result(latest_message, True)
                break
                
            elif run.status == "requires_action":
                # Process function calls
                await self._log("Processing function calls...")
                await self._handle_tool_calls(run)
                
            elif run.status in ["failed", "cancelled", "expired"]:
                await self._log(f"Run failed with status: {run.status}")
                return self._process_test_result(f"Test failed: {run.status}", False)
                
            await asyncio.sleep(1)
        
        await self._log("Test timed out")
        return self._process_test_result("Test timed out", False)
            
    async def _create_assistant(self) -> str:
        """
        Create or retrieve the UI test assistant with the necessary tools.
        
        Returns:
            The assistant ID
        """
        # Check for existing assistants with the same name
        assistants = self.client.beta.assistants.list()
        for assistant in assistants.data:
            if assistant.name == self.assistant_name:
                return assistant.id
                
        # Create a new assistant
        assistant = self.client.beta.assistants.create(
            name=self.assistant_name,
            instructions="""
            You are a specialized UI testing assistant for the PineScript MCP web application.
            Your purpose is to execute UI tests by controlling a web browser through Playwright.
            
            When given a test instruction, you should:
            1. Plan the test steps needed to verify the functionality
            2. Call the appropriate functions to execute these steps
            3. Validate the results and report success or failure
            4. Suggest improvements or additional tests if appropriate
            
            Be thorough but efficient in your testing approach. Focus on validating that
            the functionality works correctly from a user's perspective.
            """,
            model=self.model,
            tools=[
                {
                    "type": "function",
                    "function": {
                        "name": "navigate_to_url",
                        "description": "Navigate to a specific URL in the browser",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "url": {"type": "string", "description": "Full URL or path relative to base URL"}
                            },
                            "required": ["url"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "click_element",
                        "description": "Click on an element in the UI",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "selector": {"type": "string", "description": "CSS selector for the element to click"},
                                "timeout_ms": {"type": "integer", "description": "Timeout in milliseconds to wait for element"}
                            },
                            "required": ["selector"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "fill_input",
                        "description": "Fill text into an input field",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "selector": {"type": "string", "description": "CSS selector for the input field"},
                                "text": {"type": "string", "description": "Text to enter into the field"}
                            },
                            "required": ["selector", "text"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "select_option",
                        "description": "Select an option from a dropdown",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "selector": {"type": "string", "description": "CSS selector for the select element"},
                                "value": {"type": "string", "description": "Value of the option to select"}
                            },
                            "required": ["selector", "value"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "upload_file",
                        "description": "Upload a file to a file input",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "selector": {"type": "string", "description": "CSS selector for the file input"},
                                "file_path": {"type": "string", "description": "Path to the file to upload"}
                            },
                            "required": ["selector", "file_path"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "check_element_visible",
                        "description": "Check if an element is visible on the page",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "selector": {"type": "string", "description": "CSS selector for the element"},
                                "timeout_ms": {"type": "integer", "description": "Timeout in milliseconds to wait for element"}
                            },
                            "required": ["selector"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "check_element_contains_text",
                        "description": "Check if an element contains specific text",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "selector": {"type": "string", "description": "CSS selector for the element"},
                                "text": {"type": "string", "description": "Text to check for"}
                            },
                            "required": ["selector", "text"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "wait_for_navigation",
                        "description": "Wait for navigation to complete",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "timeout_ms": {"type": "integer", "description": "Timeout in milliseconds"}
                            }
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "take_screenshot",
                        "description": "Take a screenshot of the current page",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "filename": {"type": "string", "description": "Filename to save the screenshot"}
                            },
                            "required": ["filename"]
                        }
                    }
                }
            ]
        )
        
        return assistant.id
    
    async def _handle_tool_calls(self, run):
        """Handle function calls from the assistant."""
        tool_outputs = []
        
        for tool_call in run.required_action.submit_tool_outputs.tool_calls:
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)
            
            await self._log(f"Executing function: {function_name} with args: {function_args}")
            
            try:
                result = await self._execute_function(function_name, function_args)
                tool_outputs.append({
                    "tool_call_id": tool_call.id,
                    "output": json.dumps(result)
                })
                await self._log(f"Function result: {result}")
            except Exception as e:
                error_message = f"Error executing {function_name}: {str(e)}"
                await self._log(error_message)
                tool_outputs.append({
                    "tool_call_id": tool_call.id,
                    "output": json.dumps({"error": error_message})
                })
        
        # Submit the tool outputs back to the run
        self.client.beta.threads.runs.submit_tool_outputs(
            thread_id=self.thread_id,
            run_id=run.id,
            tool_outputs=tool_outputs
        )
    
    async def _execute_function(self, function_name: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a browser function based on name and arguments."""
        try:
            if function_name == "navigate_to_url":
                url = args["url"]
                # Handle relative URLs
                if not url.startswith("http"):
                    url = f"{self.base_url}/{url.lstrip('/')}"
                await self.page.goto(url)
                return {"success": True, "url": url}
                
            elif function_name == "click_element":
                selector = args["selector"]
                timeout_ms = args.get("timeout_ms", 5000)
                await self.page.click(selector, timeout=timeout_ms)
                return {"success": True, "selector": selector}
                
            elif function_name == "fill_input":
                selector = args["selector"]
                text = args["text"]
                await self.page.fill(selector, text)
                return {"success": True, "selector": selector, "text": text}
                
            elif function_name == "select_option":
                selector = args["selector"]
                value = args["value"]
                await self.page.select_option(selector, value)
                return {"success": True, "selector": selector, "value": value}
                
            elif function_name == "upload_file":
                selector = args["selector"]
                file_path = args["file_path"]
                await self.page.set_input_files(selector, file_path)
                return {"success": True, "selector": selector, "file_path": file_path}
                
            elif function_name == "check_element_visible":
                selector = args["selector"]
                timeout_ms = args.get("timeout_ms", 5000)
                element = await self.page.wait_for_selector(selector, timeout=timeout_ms, state="visible")
                is_visible = element is not None
                return {"success": True, "selector": selector, "visible": is_visible}
                
            elif function_name == "check_element_contains_text":
                selector = args["selector"]
                text = args["text"]
                element = await self.page.wait_for_selector(selector)
                element_text = await element.inner_text()
                contains_text = text in element_text
                return {
                    "success": True, 
                    "selector": selector, 
                    "contains_text": contains_text,
                    "actual_text": element_text
                }
                
            elif function_name == "wait_for_navigation":
                timeout_ms = args.get("timeout_ms", 30000)
                await self.page.wait_for_load_state("networkidle", timeout=timeout_ms)
                return {"success": True}
                
            elif function_name == "take_screenshot":
                filename = args["filename"]
                screenshot_path = f"screenshots/{filename}"
                os.makedirs("screenshots", exist_ok=True)
                await self.page.screenshot(path=screenshot_path)
                return {"success": True, "path": screenshot_path}
                
            else:
                return {"success": False, "error": f"Unknown function: {function_name}"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _process_test_result(self, message: str, success: bool) -> Dict[str, Any]:
        """Process and record the result of a test."""
        result = {
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        
        self.test_results["total"] += 1
        if success:
            self.test_results["passed"] += 1
        else:
            self.test_results["failed"] += 1
            
        self.test_results["details"].append(result)
        return result
    
    async def _log(self, message: str):
        """Log a message to console and log file."""
        timestamp = datetime.now().isoformat()
        log_entry = f"[{timestamp}] {message}"
        print(log_entry)
        
        os.makedirs("logs", exist_ok=True)
        with open(f"logs/{self.log_file}", "a") as f:
            f.write(log_entry + "\n")


async def main():
    """Example usage of the AssistantTestAgent."""
    agent = AssistantTestAgent(base_url="http://localhost:5001")
    
    try:
        await agent.setup()
        
        # Example test 1: Test the counter functionality
        await agent.run_test(
            "Test the counter functionality on the test page. "
            "Navigate to /test, verify the initial counter is 0, "
            "click the increment button, and verify the counter increases to 1."
        )
        
        # Example test 2: Test file upload
        await agent.run_test(
            "Test the file upload functionality on the analyze page. "
            "Navigate to /analyze, upload the test file 'tests/data/trades.csv' to the trade results upload area, "
            "and verify the file name is displayed."
        )
        
        # Add more tests as needed
        
    finally:
        await agent.teardown()

if __name__ == "__main__":
    asyncio.run(main()) 