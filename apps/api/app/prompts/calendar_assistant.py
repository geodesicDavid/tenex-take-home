from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.models.calendar import CalendarEvent
from app.models.chat import ChatMessage
import logging

logger = logging.getLogger(__name__)


class PromptBuilder:
    """Builds structured prompts for the LLM with calendar context."""
    
    def __init__(self):
        self.system_prompt = self._build_system_prompt()
    
    def _build_system_prompt(self) -> str:
        """Build the system prompt that defines the assistant's role and capabilities."""
        return """You are a helpful calendar assistant integrated with Google Calendar. You have access to the user's calendar events and can help them with:

1. **Schedule Management**: 
   - View upcoming meetings and appointments
   - Check availability for specific dates/times
   - Identify scheduling conflicts
   - Suggest optimal meeting times

2. **Calendar Navigation**:
   - Navigate through daily, weekly, or monthly schedules
   - Find specific events by keywords
   - Show free/busy times

3. **Meeting Assistance**:
   - Provide meeting details and context
   - Help prepare for upcoming meetings
   - Suggest follow-up actions

**IMPORTANT GUIDELINES**:
- Always be polite, professional, and concise
- Use the calendar data provided to give accurate, context-aware responses
- If you don't have access to recent calendar data, acknowledge this limitation
- Never make up or assume information about events that isn't provided
- Focus on being helpful with scheduling and calendar management
- If the user asks about events outside the provided data range, be honest about the limitation

**RESPONSE STYLE**:
- Use bullet points for lists of events or times
- Keep responses focused and relevant to calendar management
- Be proactive in suggesting calendar-related assistance
- If appropriate, ask clarifying questions to better help the user"""

    def build_chat_prompt(
        self,
        user_message: str,
        calendar_events: List[CalendarEvent],
        conversation_history: List[ChatMessage] = None,
        current_time: datetime = None
    ) -> str:
        """
        Build a complete prompt with system instructions, calendar context, and user message.
        
        Args:
            user_message: The user's current message
            calendar_events: List of calendar events for context
            conversation_history: Previous chat messages for context
            current_time: The current datetime (defaults to now)
            
        Returns:
            Complete prompt string
        """
        if current_time is None:
            current_time = datetime.now()
        
        # Format calendar events for the prompt
        calendar_context = self._format_calendar_events(calendar_events, current_time)
        
        # Format conversation history
        history_context = self._format_conversation_history(conversation_history or [])
        
        # Build the complete prompt
        prompt = f"""{self.system_prompt}

=== CURRENT TIME ===
{current_time.strftime('%A, %B %d, %Y at %I:%M %p')}

=== CALENDAR CONTEXT ===
{calendar_context}

=== CONVERSATION HISTORY ===
{history_context}

=== USER MESSAGE ===
{user_message}

=== ASSISTANT RESPONSE ===
"""
        
        logger.debug(f"Built prompt with {len(calendar_events)} calendar events")
        return prompt
    
    def _format_calendar_events(self, events: List[CalendarEvent], current_time: datetime) -> str:
        """Format calendar events for inclusion in the prompt."""
        if not events:
            return "No calendar events available for the requested time period."
        
        # Sort events by start time
        sorted_events = sorted(events, key=lambda x: x.start_time)
        
        formatted_events = []
        today = current_time.date()
        tomorrow = today + timedelta(days=1)
        
        for event in sorted_events:
            event_date = event.start_time.date()
            event_day = event.start_time.strftime('%A, %B %d')
            
            # Add date headers for better readability
            if event_date == today:
                day_label = "Today"
            elif event_date == tomorrow:
                day_label = "Tomorrow"
            else:
                day_label = event_day
            
            # Format time range
            start_time = event.start_time.strftime('%I:%M %p')
            end_time = event.end_time.strftime('%I:%M %p')
            time_range = f"{start_time} - {end_time}"
            
            # Event details
            event_details = f"**{event.summary or 'Untitled Event'}**"
            if event.description:
                event_details += f"\n   Description: {event.description}"
            if event.location:
                event_details += f"\n   Location: {event.location}"
            if event.attendees:
                attendees_str = ", ".join([a.get('email', '') for a in event.attendees if a.get('email')])
                if attendees_str:
                    event_details += f"\n   Attendees: {attendees_str}"
            
            formatted_events.append(f"{day_label} at {time_range}\n{event_details}")
        
        return "\n\n".join(formatted_events)
    
    def _format_conversation_history(self, history: List[ChatMessage]) -> str:
        """Format conversation history for inclusion in the prompt."""
        if not history:
            return "No previous conversation."
        
        formatted_history = []
        for msg in history[-5:]:  # Only include last 5 messages to keep prompt manageable
            timestamp = msg.timestamp.strftime('%I:%M %p')
            role = "User" if msg.role == "user" else "Assistant"
            formatted_history.append(f"{timestamp} - {role}: {msg.content}")
        
        return "\n".join(formatted_history)
    
    def build_calendar_summary_prompt(
        self,
        events: List[CalendarEvent],
        summary_type: str = "daily",
        target_date: datetime = None
    ) -> str:
        """
        Build a prompt for calendar summarization.
        
        Args:
            events: Calendar events to summarize
            summary_type: Type of summary ('daily', 'weekly', 'monthly')
            target_date: Date to summarize (defaults to today)
            
        Returns:
            Prompt string for calendar summarization
        """
        if target_date is None:
            target_date = datetime.now()
        
        # Filter events based on summary type
        if summary_type == "daily":
            filtered_events = [e for e in events if e.start_time.date() == target_date.date()]
            period = target_date.strftime('%A, %B %d, %Y')
        elif summary_type == "weekly":
            week_start = target_date - timedelta(days=target_date.weekday())
            week_end = week_start + timedelta(days=6)
            filtered_events = [e for e in events if week_start.date() <= e.start_time.date() <= week_end.date()]
            period = f"Week of {week_start.strftime('%B %d')}"
        elif summary_type == "monthly":
            filtered_events = [e for e in events if e.start_time.month == target_date.month and e.start_time.year == target_date.year]
            period = target_date.strftime('%B %Y')
        else:
            filtered_events = events
            period = "Selected Period"
        
        calendar_context = self._format_calendar_events(filtered_events, target_date)
        
        prompt = f"""{self.system_prompt}

Please provide a {summary_type} calendar summary for {period}:

=== CALENDAR EVENTS ===
{calendar_context}

=== SUMMARY REQUEST ===
Please provide a concise summary of the calendar above. Include:
- Total number of events
- Key highlights or important meetings
- Any potential scheduling conflicts
- Notable patterns (e.g., many meetings on certain days)
- Suggestions for better time management if applicable

Keep the summary brief but informative.

=== ASSISTANT RESPONSE ===
"""
        
        return prompt
    
    def extract_calendar_intent(self, user_message: str) -> Dict[str, Any]:
        """
        Extract calendar-related intent from user message.
        
        Args:
            user_message: The user's message
            
        Returns:
            Dictionary with extracted intent information
        """
        message_lower = user_message.lower()
        
        intent = {
            "action": "general_inquiry",
            "time_period": None,
            "specific_date": None,
            "keywords": [],
            "requires_calendar_data": True
        }
        
        # Extract time period
        if any(word in message_lower for word in ["today", "now", "current"]):
            intent["time_period"] = "today"
        elif any(word in message_lower for word in ["tomorrow"]):
            intent["time_period"] = "tomorrow"
        elif any(word in message_lower for word in ["week", "this week"]):
            intent["time_period"] = "week"
        elif any(word in message_lower for word in ["month", "this month"]):
            intent["time_period"] = "month"
        
        # Extract action
        if any(word in message_lower for word in ["schedule", "meeting", "appointment"]):
            intent["action"] = "schedule_management"
        elif any(word in message_lower for word in ["free", "available", "busy"]):
            intent["action"] = "availability_check"
        elif any(word in message_lower for word in ["conflict", "overlap", "double book"]):
            intent["action"] = "conflict_detection"
        elif any(word in message_lower for word in ["summary", "overview", "what's on"]):
            intent["action"] = "summary"
        elif any(word in message_lower for word in ["find", "search", "look for"]):
            intent["action"] = "search"
        
        return intent