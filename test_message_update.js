// Test to verify message update logic
function testMessageUpdate() {
  // Simulate initial messages state
  let messages = [
    {
      id: 'user-1',
      text: 'Hello',
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: 'agent-1',
      text: '',
      sender: 'agent',
      timestamp: new Date(),
      isStreaming: true,
      isComplete: false,
    }
  ];
  
  console.log('Initial messages:', JSON.stringify(messages, null, 2));
  
  // Simulate updateMessage function
  function updateMessage(messageId, updates) {
    messages = messages.map(msg => 
      msg.id === messageId ? { 
        ...msg, 
        ...(typeof updates === 'function' ? updates(msg) : updates) 
      } : msg
    );
  }
  
  // Simulate streaming chunks
  const chunks = [
    { content: 'Hello', isComplete: false },
    { content: '! How', isComplete: false },
    { content: ' can I help you with your calendar today?', isComplete: false },
    { content: '', isComplete: true }
  ];
  
  console.log('\nProcessing chunks...');
  
  for (const chunk of chunks) {
    if (chunk.isComplete) {
      updateMessage('agent-1', {
        isStreaming: false,
        isComplete: true,
      });
      console.log('Completion chunk processed');
      break;
    }
    
    if (chunk.content) {
      updateMessage('agent-1', (prev) => ({
        text: prev.text + chunk.content,
      }));
      console.log('Content chunk processed:', JSON.stringify(chunk.content));
    }
    
    console.log('Messages after chunk:', JSON.stringify(messages, null, 2));
  }
  
  console.log('\nFinal messages:', JSON.stringify(messages, null, 2));
}

testMessageUpdate();