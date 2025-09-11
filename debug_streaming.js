// Test script to debug streaming response parsing
async function debugStreaming() {
  // Simulate the SSE parsing logic from chatService.ts
  const mockSSEData = [
    'data: {"id": "chunk-0", "content": "Hello", "isComplete": false}',
    'data: {"id": "chunk-1", "content": "! How", "isComplete": false}',
    'data: {"id": "chunk-2", "content": " can I help you with your calendar today? I can provide information about your upcoming events, check", "isComplete": false}',
    'data: {"id": "chunk-3", "content": " your availability, or help with scheduling.\\n", "isComplete": false}',
    'data: {"id": "complete", "content": "", "isComplete": true}'
  ];

  let fullContent = '';
  
  console.log('Testing SSE parsing...');
  
  for (const line of mockSSEData) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      
      if (data === '[DONE]') {
        console.log('Received [DONE] signal');
        break;
      }
      
      try {
        const parsedChunk = JSON.parse(data);
        console.log('Parsed chunk:', parsedChunk);
        
        if (parsedChunk.isComplete) {
          console.log('Received completion signal');
          break;
        }
        
        if (parsedChunk.content) {
          fullContent += parsedChunk.content;
          console.log('Added content:', parsedChunk.content);
          console.log('Full content so far:', fullContent);
        }
      } catch (parseError) {
        console.error('Error parsing streaming chunk:', parseError);
      }
    }
  }
  
  console.log('Final content:', fullContent);
}

debugStreaming();