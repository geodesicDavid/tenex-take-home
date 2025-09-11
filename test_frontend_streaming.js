// Simple test to verify frontend streaming handling
const { sendMessageStreaming } = require('./apps/web/src/services/chatService');

// Mock the fetch function to simulate streaming response
global.fetch = async (url, options) => {
  console.log('Mock fetch called with:', url, options);
  
  // Create a mock response stream
  const mockStream = {
    body: {
      getReader: () => {
        let chunks = [
          'data: {"id": "chunk-0", "content": "Hello", "isComplete": false}',
          'data: {"id": "chunk-1", "content": "! How", "isComplete": false}',
          'data: {"id": "chunk-2", "content": " are you?", "isComplete": false}',
          'data: {"id": "complete", "content": "", "isComplete": true}'
        ];
        
        let index = 0;
        
        return {
          read: async () => {
            if (index < chunks.length) {
              const chunk = chunks[index++];
              console.log('Sending chunk:', chunk);
              const encoder = new TextEncoder();
              return {
                done: false,
                value: encoder.encode(chunk + '\n')
              };
            } else {
              console.log('Stream completed');
              return {
                done: true,
                value: undefined
              };
            }
          },
          releaseLock: () => {
            console.log('Reader lock released');
          }
        };
      }
    },
    ok: true
  };
  
  return mockStream;
};

// Test the sendMessageStreaming function
(async () => {
  console.log('Starting test...');
  
  let chunksReceived = 0;
  let isCompleteReceived = false;
  
  try {
    await sendMessageStreaming(
      'Hello',
      (chunk) => {
        chunksReceived++;
        console.log('Received chunk:', chunk);
        
        if (chunk.isComplete) {
          isCompleteReceived = true;
          console.log('Received completion signal');
        }
      },
      (error) => {
        console.error('Error received:', error);
      }
    );
    
    console.log('Test completed');
    console.log('Chunks received:', chunksReceived);
    console.log('Completion signal received:', isCompleteReceived);
  } catch (error) {
    console.error('Test failed:', error);
  }
})();