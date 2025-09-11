import asyncio
import os
import sys
from dotenv import load_dotenv

# Add the API app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'apps', 'api', 'app'))

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), 'apps', 'api', '.env'))

from app.services.llm_service import LLMService

async def test_streaming():
    print("Testing streaming...")
    llm_service = LLMService()
    
    prompt = "Hello, how are you?"
    print(f"Sending prompt: {prompt}")
    
    async for chunk in llm_service.generate_response(prompt, stream=True):
        print(f"Received chunk: {repr(chunk)}")
        sys.stdout.flush()
    
    print("Streaming test complete.")

if __name__ == "__main__":
    asyncio.run(test_streaming())