import pytest
from unittest.mock import Mock, patch, AsyncMock
from fastapi import HTTPException
from app.utils.streaming import StreamingUtils, TimeoutHelper, RetryHelper
import json
import asyncio


class TestStreamingUtils:
    """Test cases for StreamingUtils."""
    
    @pytest.mark.asyncio
    async def test_create_stream_generator(self):
        """Test creating streaming response generator."""
        # Mock response generator
        async def mock_response_generator():
            yield "Hello"
            yield " world!"
            yield " How are you?"
        
        # Test streaming generator
        response_id = "test-id"
        generator = StreamingUtils.create_stream_generator(
            mock_response_generator(),
            response_id,
            calendar_context_included=True,
            event_count=2
        )
        
        # Collect all chunks
        chunks = []
        async for chunk in generator:
            chunks.append(chunk)
        
        # Verify structure
        assert len(chunks) == 4  # 3 content chunks + completion
        
        # Check content chunks
        for i in range(0, 3):
            chunk = chunks[i]
            assert chunk.startswith("data: ")
            data = json.loads(chunk[6:])
            assert data["id"] == response_id
            assert data["isComplete"] is False
            assert data["content"] in ["Hello", " world!", " How are you?"]
        
        # Check completion chunk
        completion_chunk = chunks[3]
        assert completion_chunk.startswith("data: ")
        completion_data = json.loads(completion_chunk[6:])
        assert completion_data["id"] == response_id
        assert completion_data["isComplete"] is True
        assert completion_data["content"] == ""
    
    @pytest.mark.asyncio
    async def test_create_stream_generator_with_error(self):
        """Test streaming generator error handling."""
        # Mock response generator that raises an error
        async def mock_response_generator():
            yield "Hello"
            raise Exception("Test error")
        
        # Test streaming generator
        response_id = "test-id"
        generator = StreamingUtils.create_stream_generator(
            mock_response_generator(),
            response_id
        )
        
        # Collect all chunks
        chunks = []
        async for chunk in generator:
            chunks.append(chunk)
        
        # Should have one content chunk and error completion
        assert len(chunks) == 2
        
        # Check content chunk
        content_chunk = chunks[0]
        assert content_chunk.startswith("data: ")
        content_data = json.loads(content_chunk[6:])
        assert content_data["id"] == response_id
        assert content_data["content"] == "Hello"
        assert content_data["isComplete"] is False
        
        # Check error chunk
        error_chunk = chunks[1]
        assert error_chunk.startswith("data: ")
        error_data = json.loads(error_chunk[6:])
        assert error_data["id"] == response_id
        assert error_data["isComplete"] is True
        assert "Test error" in error_data["error"]
    
    def test_create_streaming_response(self):
        """Test creating FastAPI StreamingResponse."""
        from fastapi.responses import StreamingResponse
        
        async def mock_response_generator():
            yield "Hello"
            yield " world!"
        
        response = StreamingUtils.create_streaming_response(
            mock_response_generator(),
            calendar_context_included=True,
            event_count=2
        )
        
        assert isinstance(response, StreamingResponse)
        assert response.media_type == "text/event-stream"
        assert "Cache-Control" in response.headers
        assert "Connection" in response.headers
        assert "Access-Control-Allow-Origin" in response.headers
    
    @pytest.mark.asyncio
    async def test_parse_sse_stream(self):
        """Test parsing SSE stream data."""
        # Mock SSE stream
        async def mock_sse_stream():
            yield "data: {\"type\": \"metadata\", \"id\": \"test\"}\n\n"
            yield "data: {\"type\": \"chunk\", \"content\": \"Hello\"}\n\n"
            yield "invalid data\n\n"  # Should be skipped
            yield "data: {\"type\": \"complete\"}\n\n"
        
        # Parse SSE stream
        parsed_data = []
        async for data in StreamingUtils.parse_sse_stream(mock_sse_stream()):
            parsed_data.append(data)
        
        # Should parse 3 valid chunks
        assert len(parsed_data) == 3
        assert parsed_data[0]["type"] == "metadata"
        assert parsed_data[1]["type"] == "chunk"
        assert parsed_data[2]["type"] == "complete"


class TestTimeoutHelper:
    """Test cases for TimeoutHelper."""
    
    @pytest.mark.asyncio
    async def test_with_timeout_success(self):
        """Test successful operation with timeout."""
        async def mock_operation():
            await asyncio.sleep(0.1)
            return "success"
        
        result = await TimeoutHelper.with_timeout(
            mock_operation,
            timeout_seconds=1.0
        )
        
        assert result == "success"
    
    @pytest.mark.asyncio
    async def test_with_timeout_failure(self):
        """Test operation timeout."""
        async def mock_operation():
            await asyncio.sleep(0.5)
            return "success"
        
        with pytest.raises(HTTPException) as exc_info:
            await TimeoutHelper.with_timeout(
                mock_operation,
                timeout_seconds=0.1
            )
        
        assert exc_info.value.status_code == 504
        assert "timed out" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_with_timeout_custom_message(self):
        """Test timeout with custom message."""
        async def mock_operation():
            await asyncio.sleep(0.5)
            return "success"
        
        with pytest.raises(HTTPException) as exc_info:
            await TimeoutHelper.with_timeout(
                mock_operation,
                timeout_seconds=0.1,
                timeout_message="Custom timeout message"
            )
        
        assert exc_info.value.status_code == 504
        assert "Custom timeout message" in exc_info.value.detail


class TestRetryHelper:
    """Test cases for RetryHelper."""
    
    @pytest.mark.asyncio
    async def test_with_retry_success(self):
        """Test successful operation with retry."""
        async def mock_operation():
            return "success"
        
        result = await RetryHelper.with_retry(
            mock_operation,
            max_retries=3,
            retry_delay=0.1
        )
        
        assert result == "success"
    
    @pytest.mark.asyncio
    async def test_with_retry_eventual_success(self):
        """Test operation that succeeds after retries."""
        call_count = 0
        
        async def mock_operation():
            nonlocal call_count
            call_count += 1
            if call_count < 3:
                raise Exception("Temporary failure")
            return "success"
        
        result = await RetryHelper.with_retry(
            mock_operation,
            max_retries=3,
            retry_delay=0.1
        )
        
        assert result == "success"
        assert call_count == 3
    
    @pytest.mark.asyncio
    async def test_with_retry_all_failures(self):
        """Test operation that fails all retries."""
        async def mock_operation():
            raise Exception("Persistent failure")
        
        with pytest.raises(Exception) as exc_info:
            await RetryHelper.with_retry(
                mock_operation,
                max_retries=3,
                retry_delay=0.1
            )
        
        assert "Persistent failure" in str(exc_info.value)
    
    @pytest.mark.asyncio
    async def test_with_retry_specific_exceptions(self):
        """Test retry only for specific exceptions."""
        async def mock_operation_valueerror():
            raise ValueError("Specific error")
        
        async def mock_operation_typeerror():
            raise TypeError("Type error")
        
        # Should retry for ValueError
        with pytest.raises(ValueError):
            await RetryHelper.with_retry(
                mock_operation_valueerror,
                max_retries=3,
                retry_delay=0.1,
                retry_exceptions=(ValueError,)
            )
        
        # Should not retry for ValueError when retry_exceptions is TypeError only
        with pytest.raises(ValueError):
            await RetryHelper.with_retry(
                mock_operation_valueerror,
                max_retries=3,
                retry_delay=0.1,
                retry_exceptions=(TypeError,)
            )
        
        # Should retry for TypeError
        with pytest.raises(TypeError):
            await RetryHelper.with_retry(
                mock_operation_typeerror,
                max_retries=3,
                retry_delay=0.1,
                retry_exceptions=(TypeError,)
            )
    
    @pytest.mark.asyncio
    async def test_with_retry_exponential_backoff(self):
        """Test exponential backoff in retry logic."""
        call_times = []
        
        async def mock_operation():
            call_times.append(asyncio.get_event_loop().time())
            raise Exception("Temporary failure")
        
        start_time = asyncio.get_event_loop().time()
        
        with pytest.raises(Exception):
            await RetryHelper.with_retry(
                mock_operation,
                max_retries=3,
                retry_delay=0.1,
                backoff_factor=2.0
            )
        
        # Check that delays increased exponentially
        assert len(call_times) == 4  # Initial call + 3 retries
        
        delay1 = call_times[1] - call_times[0]
        delay2 = call_times[2] - call_times[1]
        delay3 = call_times[3] - call_times[2]
        
        # Delays should roughly follow exponential pattern
        assert abs(delay2 - delay1 * 2) < 0.05  # Allow some tolerance
        assert abs(delay3 - delay2 * 2) < 0.05