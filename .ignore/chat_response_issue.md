# Analysis of Chat Response Display Issue

## Problem
The chat response is displaying as raw SSE data format instead of just the content:
```
data: {"id": "chunk-0", "content": "Hello", "isComplete": false} data: {"id": "chunk-1", "content": "! How", "isComplete": false} ...
```

Instead of just:
```
Hello! How can I help you with your calendar today?
```

## Analysis
I've verified that:

1. The backend is correctly sending properly formatted SSE data:
   ```
   data: {"id": "chunk-0", "content": "Hello", "isComplete": false}
   data: {"id": "chunk-1", "content": "! How", "isComplete": false}
   ...
   data: {"id": "complete", "content": "", "isComplete": true}
   ```

2. The frontend parsing logic in `chatService.ts` is correctly parsing the SSE data and extracting the content from each chunk.

3. The message update logic in `useChatMessages.ts` is correctly appending the content to the message text.

4. The message display logic in `ChatMessageItem.tsx` is correctly displaying the message text.

## Root Cause
The issue appears to be that the message text is being set to the raw SSE data instead of just the content. This suggests that there's an issue in how the chunks are being processed in the frontend.

## Possible Issues
1. There might be an error in the JSON parsing that's causing the raw data to be used instead of the parsed content.
2. There might be an issue with how the `onChunk` callback is being called.
3. There might be an issue with how the message text is being updated in the `updateMessage` function.

## Next Steps
To fix this issue, I need to:
1. Add more detailed logging to see what's happening in the streaming process
2. Verify that the `chunk.content` is being correctly extracted and appended to the message text
3. Check if there are any errors in the parsing or message update process