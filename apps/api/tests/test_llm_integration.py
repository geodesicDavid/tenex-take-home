import pytest
import os
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime
from app.services.llm_service import LLMService
from app.core.config import settings


class TestLLMService:
    """Test cases for LLMService."""
    
    def setup_method(self):
        """Set up test fixtures."""
        with patch.dict(os.environ, {"GOOGLE_GEMINI_API_KEY": "test_api_key"}):
            with patch('app.services.llm_service.genai') as mock_genai:
                self.llm_service = LLMService()
    
    @patch('app.services.llm_service.genai')
    def test_initialization(self, mock_genai):
        """Test LLM service initialization."""
        # Create a new instance to test initialization
        with patch.dict(os.environ, {"GOOGLE_GEMINI_API_KEY": "test_api_key"}):
            llm_service = LLMService()
        mock_genai.configure.assert_called_once_with(api_key="test_api_key")
        mock_genai.GenerativeModel.assert_called_once_with('gemini-2.5-flash-lite')
    
    @patch('app.services.llm_service.genai')
    @pytest.mark.asyncio
    async def test_generate_response_streaming(self, mock_genai):
        """Test generating streaming response."""
        # Mock the model
        mock_model = Mock()
        mock_genai.GenerativeModel.return_value = mock_model
        
        # Mock the streaming response
        mock_chunk1 = Mock()
        mock_chunk1.text = "Hello"
        mock_chunk2 = Mock()
        mock_chunk2.text = " world!"
        
        mock_response = AsyncMock()
        mock_response.__aiter__.return_value = [mock_chunk1, mock_chunk2]
        mock_model.generate_content.return_value = mock_response
        
        # Test streaming response
        response_chunks = []
        async for chunk in self.llm_service.generate_response(
            prompt="Test prompt",
            stream=True
        ):
            response_chunks.append(chunk)
        
        assert response_chunks == ["Hello", " world!"]
        mock_model.generate_content.assert_called_once()
    
    @patch('app.services.llm_service.genai')
    @pytest.mark.asyncio
    async def test_generate_response_non_streaming(self, mock_genai):
        """Test generating non-streaming response."""
        # Mock the model
        mock_model = Mock()
        mock_genai.GenerativeModel.return_value = mock_model
        
        # Mock the response
        mock_response = Mock()
        mock_response.text = "Hello world!"
        mock_model.generate_content.return_value = mock_response
        
        # Test non-streaming response
        response_chunks = []
        async for chunk in self.llm_service.generate_response(
            prompt="Test prompt",
            stream=False
        ):
            response_chunks.append(chunk)
        
        assert response_chunks == ["Hello world!"]
        mock_model.generate_content.assert_called_once()
    
    @patch('app.services.llm_service.genai')
    @pytest.mark.asyncio
    async def test_generate_response_with_timeout(self, mock_genai):
        """Test generating response with timeout handling."""
        # Mock the model
        mock_model = Mock()
        mock_genai.GenerativeModel.return_value = mock_model
        
        # Mock timeout error
        mock_model.generate_content.side_effect = Exception("Timeout")
        
        # Test timeout handling
        response_chunks = []
        async for chunk in self.llm_service.generate_response(
            prompt="Test prompt",
            stream=False
        ):
            response_chunks.append(chunk)
        
        assert "I'm sorry" in response_chunks[0]
    
    @patch('app.services.llm_service.genai')
    def test_validate_api_key(self, mock_genai):
        """Test API key validation."""
        # Mock successful validation
        mock_model = Mock()
        mock_genai.GenerativeModel.return_value = mock_model
        mock_model.generate_content.return_value = Mock()
        
        # Create a new instance for this test
        with patch.dict(os.environ, {"GOOGLE_GEMINI_API_KEY": "test_api_key"}):
            llm_service = LLMService()
            result = llm_service.validate_api_key()
        assert result is True
    
    def test_get_model_info(self):
        """Test getting model information."""
        # Create a new instance for this test
        with patch.dict(os.environ, {"GOOGLE_GEMINI_API_KEY": "test_api_key"}):
            with patch('app.services.llm_service.genai'):
                llm_service = LLMService()
                info = llm_service.get_model_info()
        
        assert info["model_name"] == "gemini-2.5-flash-lite"
        assert info["api_key_configured"] is True
        assert info["max_retries"] == 3
        assert info["timeout"] == 30.0


class TestPromptBuilder:
    """Test cases for PromptBuilder."""
    
    def setup_method(self):
        """Set up test fixtures."""
        from app.prompts.calendar_assistant import PromptBuilder
        from app.models.calendar import CalendarEvent
        from app.models.chat import ChatMessage
        
        self.prompt_builder = PromptBuilder()
        
        # Create test calendar events
        self.test_events = [
            CalendarEvent(
                id="1",
                summary="Test Meeting",
                start_time=datetime(2023, 12, 1, 10, 0),
                end_time=datetime(2023, 12, 1, 11, 0),
                description="Test meeting description",
                location="Test Location",
                attendees=[{"email": "test@example.com"}]
            ),
            CalendarEvent(
                id="2",
                summary="Another Meeting",
                start_time=datetime(2023, 12, 1, 14, 0),
                end_time=datetime(2023, 12, 1, 15, 0)
            )
        ]
        
        # Create test conversation history
        self.test_history = [
            ChatMessage(
                id="1",
                content="Hello",
                role="user",
                timestamp=datetime(2023, 12, 1, 9, 0)
            ),
            ChatMessage(
                id="2",
                content="Hi there!",
                role="assistant",
                timestamp=datetime(2023, 12, 1, 9, 1)
            )
        ]
    
    def test_build_system_prompt(self):
        """Test building system prompt."""
        system_prompt = self.prompt_builder._build_system_prompt()
        
        assert "calendar assistant" in system_prompt.lower()
        assert "scheduling" in system_prompt.lower()
        assert "guidelines" in system_prompt.lower()
    
    def test_build_chat_prompt(self):
        """Test building complete chat prompt."""
        prompt = self.prompt_builder.build_chat_prompt(
            user_message="What meetings do I have today?",
            calendar_events=self.test_events,
            conversation_history=self.test_history,
            current_time=datetime(2023, 12, 1, 9, 30)
        )
        
        assert "What meetings do I have today?" in prompt
        assert "Test Meeting" in prompt
        assert "Another Meeting" in prompt
        assert "Hello" in prompt
        assert "Hi there!" in prompt
        assert "Friday, December 01, 2023 at 09:30 AM" in prompt
    
    def test_build_chat_prompt_no_events(self):
        """Test building chat prompt with no calendar events."""
        prompt = self.prompt_builder.build_chat_prompt(
            user_message="What meetings do I have today?",
            calendar_events=[],
            conversation_history=[],
            current_time=datetime(2023, 12, 1, 9, 30)
        )
        
        assert "No calendar events available" in prompt
    
    def test_format_calendar_events(self):
        """Test formatting calendar events."""
        formatted = self.prompt_builder._format_calendar_events(
            self.test_events,
            datetime(2023, 12, 1, 9, 30)
        )
        
        assert "Test Meeting" in formatted
        assert "Another Meeting" in formatted
        assert "10:00 AM - 11:00 AM" in formatted
        assert "02:00 PM - 03:00 PM" in formatted
    
    def test_format_conversation_history(self):
        """Test formatting conversation history."""
        formatted = self.prompt_builder._format_conversation_history(self.test_history)
        
        assert "Hello" in formatted
        assert "Hi there!" in formatted
        assert "User" in formatted
        assert "Assistant" in formatted
    
    def test_build_calendar_summary_prompt(self):
        """Test building calendar summary prompt."""
        prompt = self.prompt_builder.build_calendar_summary_prompt(
            events=self.test_events,
            summary_type="daily",
            target_date=datetime(2023, 12, 1)
        )
        
        assert "daily calendar summary" in prompt.lower()
        assert "Test Meeting" in prompt
        assert "Another Meeting" in prompt
    
    def test_extract_calendar_intent(self):
        """Test extracting calendar intent from user message."""
        # Test schedule management
        intent = self.prompt_builder.extract_calendar_intent("Schedule a meeting tomorrow")
        assert intent["action"] == "schedule_management"
        assert intent["time_period"] == "tomorrow"
        
        # Test availability check
        intent = self.prompt_builder.extract_calendar_intent("Am I free today?")
        assert intent["action"] == "availability_check"
        assert intent["time_period"] == "today"
        
        # Test conflict detection
        intent = self.prompt_builder.extract_calendar_intent("Do I have any conflicts this week?")
        assert intent["action"] == "conflict_detection"
        assert intent["time_period"] == "week"
        
        # Test summary
        intent = self.prompt_builder.extract_calendar_intent("What's on my calendar?")
        assert intent["action"] == "summary"