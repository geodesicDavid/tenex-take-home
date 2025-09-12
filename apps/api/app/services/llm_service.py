import google.generativeai as genai
from typing import Optional, AsyncGenerator, Dict, Any
import os
from dotenv import load_dotenv
import logging
import asyncio

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)


class LLMService:
    """Service for interacting with Google Gemini LLM."""
    
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_GEMINI_API_KEY')
        self.model = None
        self.max_retries = 3
        self.timeout = 30.0  # seconds
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize the Gemini client with proper configuration."""
        try:
            if not self.api_key:
                raise ValueError("GOOGLE_GEMINI_API_KEY not configured")
            
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash-lite')
            logger.info("Gemini client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini client: {str(e)}")
            raise
    
    async def generate_response(
        self,
        prompt: str,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        stream: bool = True
    ) -> AsyncGenerator[str, None]:
        """
        Generate a response from the LLM.
        
        Args:
            prompt: The input prompt
            temperature: Controls randomness (0.0 to 1.0)
            max_tokens: Maximum tokens to generate
            stream: Whether to stream the response
            
        Returns:
            AsyncGenerator yielding response chunks if streaming, otherwise full response
        """
        if not self.model:
            raise RuntimeError("LLM service not initialized")
        
        generation_config = {
            "temperature": temperature,
            "top_p": 0.9,
            "top_k": 40,
        }
        
        if max_tokens:
            generation_config["max_output_tokens"] = max_tokens
        
        for attempt in range(self.max_retries):
            try:
                if stream:
                    async for chunk in self._stream_response(prompt, generation_config):
                        yield chunk
                else:
                    response = await asyncio.wait_for(
                        asyncio.get_event_loop().run_in_executor(
                            None,
                            lambda: self.model.generate_content(prompt, generation_config=generation_config)
                        ),
                        timeout=self.timeout
                    )
                    yield response.text
                
                return
                
            except asyncio.TimeoutError:
                logger.warning(f"Timeout on attempt {attempt + 1}/{self.max_retries}")
                if attempt == self.max_retries - 1:
                    yield "I'm sorry, but I'm experiencing a delay in my response. Please try again."
                await asyncio.sleep(1 * (attempt + 1))  # Exponential backoff
                
            except Exception as e:
                logger.error(f"Error generating response (attempt {attempt + 1}/{self.max_retries}): {str(e)}")
                if attempt == self.max_retries - 1:
                    yield "I'm sorry, but I'm having trouble generating a response right now. Please try again later."
                await asyncio.sleep(1 * (attempt + 1))
    
    async def _stream_response(self, prompt: str, generation_config: Dict[str, Any]) -> AsyncGenerator[str, None]:
        """Stream response from Gemini model."""
        try:
            # Create the streaming response
            response = self.model.generate_content(prompt, generation_config=generation_config, stream=True)
            
            # Process the streaming response and yield chunks as they arrive
            for chunk in response:
                if hasattr(chunk, 'text') and chunk.text:
                    yield chunk.text
                elif hasattr(chunk, 'parts'):
                    for part in chunk.parts:
                        if hasattr(part, 'text') and part.text:
                            yield part.text
                            
        except asyncio.TimeoutError:
            raise
        except Exception as e:
            logger.error(f"Error in streaming response: {str(e)}")
            raise
    
    def validate_api_key(self) -> bool:
        """Validate that the API key is properly configured."""
        try:
            if not self.api_key:
                return False
            
            # Try a simple test call
            self.model.generate_content("test", generation_config={"max_output_tokens": 1})
            return True
        except Exception as e:
            logger.error(f"API key validation failed: {str(e)}")
            return False
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the configured model."""
        return {
            "model_name": "gemini-2.0-flash-lite",
            "api_key_configured": bool(self.api_key),
            "max_retries": self.max_retries,
            "timeout": self.timeout
        }