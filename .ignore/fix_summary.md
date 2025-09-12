# Fix for "Agent is typing..." Issue

## Problem
The chat interface was getting stuck showing "Agent is typing..." with a loading circle after sending a message. The frontend would enter a loading state but never receive or display the actual response from the backend.

## Root Cause
The issue was in the `useChatMessages` hook in the frontend. The code was creating an agent message with an ID, but then passing it to `addMessage` which created a new message with a different ID. The `agentMessageId` variable was holding the ID of the original message, not the actual message that was added to the messages array.

This meant that when the completion signal was received, the `updateMessage` function couldn't find a message with the `agentMessageId` to update, so the message remained in the streaming state and the `isLoading` state was never set to false.

## Solution
1. Modified the `addMessage` function in `useChatMessages.ts` to return the ID of the newly added message
2. Updated the code that creates the agent message to use the returned ID for the `agentMessageId` variable

## Files Changed
- `apps/web/src/hooks/useChatMessages.ts`: Fixed the agent message ID handling

## Testing
The fix has been implemented and the frontend server has been restarted. The chat functionality should now properly handle the completion signal and update the UI accordingly.