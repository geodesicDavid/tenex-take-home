import { sendMessageStreaming } from './apps/web/src/services/chatService';

// Test the sendMessageStreaming function with mock data
async function testSendMessageStreaming() {
  console.log('Testing sendMessageStreaming...');
  
  try {
    await sendMessageStreaming(
      'Hello',
      (chunk) => {
        console.log('Received chunk:', chunk);
      },
      (error) => {
        console.error('Error received:', error);
      }
    );
    
    console.log('Test completed');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSendMessageStreaming();