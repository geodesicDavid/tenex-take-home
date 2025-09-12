import json
from typing import AsyncGenerator, Any, Dict
from fastapi.responses import StreamingResponse
from fastapi import HTTPException
import logging
import uuid

logger = logging.getLogger(__name__)


class StreamingUtils:
    """Utilities for handling streaming responses."""
    
    @staticmethod
    async def create_stream_generator(
        response_generator: AsyncGenerator[str, None],
        response_id: str,
        calendar_context_included: bool = False,
        event_count: int = 0
    ) -> AsyncGenerator[str, None]:
        """
        Create a streaming response generator with proper formatting.
        
        Args:
            response_generator: Generator yielding response chunks
            response_id: Unique ID for this response
            calendar_context_included: Whether calendar context was included
            event_count: Number of calendar events included
            
        Yields:
            Formatted SSE (Server-Sent Events) chunks
        """
        try:
            # Stream response chunks
            async for chunk in response_generator:
                if chunk:
                    chunk_data = {
                        "id": response_id,
                        "content": chunk,
                        "isComplete": False
                    }
                    yield f"data: {json.dumps(chunk_data)}\n\n"
            
            # Send completion signal
            completion_data = {
                "id": response_id,
                "content": "",
                "isComplete": True
            }
            yield f"data: {json.dumps(completion_data)}\n\n"
            
        except Exception as e:
            logger.error(f"Error in streaming response: {str(e)}")
            # Send error message
            error_data = {
                "id": response_id,
                "content": "",
                "isComplete": True,
                "error": str(e)
            }
            yield f"data: {json.dumps(error_data)}\n\n"
    
    @staticmethod
    def create_streaming_response(
        response_generator: AsyncGenerator[str, None],
        calendar_context_included: bool = False,
        event_count: int = 0
    ) -> StreamingResponse:
        """
        Create a FastAPI StreamingResponse with proper headers.
        
        Args:
            response_generator: Generator yielding response chunks
            calendar_context_included: Whether calendar context was included
            event_count: Number of calendar events included
            
        Returns:
            FastAPI StreamingResponse
        """
        response_id = str(uuid.uuid4())
        
        return StreamingResponse(
            StreamingUtils.create_stream_generator(
                response_generator,
                response_id,
                calendar_context_included,
                event_count
            ),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            }
        )
    
    @staticmethod
    async def parse_sse_stream(stream: AsyncGenerator[str, None]) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Parse SSE stream data on the client side.
        
        Args:
            stream: Async generator yielding SSE data chunks
            
        Yields:
            Parsed JSON data from SSE chunks
        """
        async for chunk in stream:
            if chunk.startswith("data: "):
                data_str = chunk[6:]  # Remove "data: " prefix
                if data_str.strip():
                    try:
                        data = json.loads(data_str)
                        yield data
                    except json.JSONDecodeError:
                        logger.warning(f"Failed to parse SSE data: {data_str}")
                        continue


class TimeoutHelper:
    """Helper for managing timeouts in async operations."""
    
    @staticmethod
    async def with_timeout(
        coro,
        timeout_seconds: float,
        timeout_message: str = "Operation timed out"
    ) -> Any:
        """
        Execute a coroutine with a timeout.
        
        Args:
            coro: Coroutine to execute
            timeout_seconds: Timeout in seconds
            timeout_message: Message to include in timeout exception
            
        Returns:
            Result of the coroutine
            
        Raises:
            asyncio.TimeoutError if operation times out
        """
        import asyncio
        try:
            return await asyncio.wait_for(coro, timeout=timeout_seconds)
        except asyncio.TimeoutError:
            logger.warning(f"Operation timed out after {timeout_seconds} seconds")
            raise HTTPException(
                status_code=504,
                detail=f"{timeout_message} (timeout: {timeout_seconds}s)"
            )


class RetryHelper:
    """Helper for implementing retry logic."""
    
    @staticmethod
    async def with_retry(
        operation,
        max_retries: int = 3,
        retry_delay: float = 1.0,
        backoff_factor: float = 2.0,
        retry_exceptions: tuple = (Exception,)
    ) -> Any:
        """
        Execute an operation with retry logic.
        
        Args:
            operation: Async function to execute
            max_retries: Maximum number of retry attempts
            retry_delay: Initial delay between retries
            backoff_factor: Factor for exponential backoff
            retry_exceptions: Tuple of exceptions that should trigger retry
            
        Returns:
            Result of the operation
            
        Raises:
            The last exception if all retries fail
        """
        import asyncio
        last_exception = None
        
        for attempt in range(max_retries + 1):
            try:
                return await operation()
            except retry_exceptions as e:
                last_exception = e
                if attempt < max_retries:
                    delay = retry_delay * (backoff_factor ** attempt)
                    logger.warning(f"Attempt {attempt + 1} failed, retrying in {delay}s: {str(e)}")
                    await asyncio.sleep(delay)
                else:
                    logger.error(f"All {max_retries} retry attempts failed")
                    break
        
        raise last_exception


# Global instances
streaming_utils = StreamingUtils()
timeout_helper = TimeoutHelper()
retry_helper = RetryHelper()