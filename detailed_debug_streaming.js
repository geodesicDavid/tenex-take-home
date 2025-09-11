// More detailed test to debug streaming response parsing
async function detailedDebugStreaming() {
  // Simulate the SSE parsing logic from chatService.ts with more detail
  const mockSSEData = [
    'data: {"id": "chunk-0", "content": "Hello", "isComplete": false}\n',
    'data: {"id": "chunk-1", "content": "! How", "isComplete": false}\n',
    'data: {"id": "chunk-2", "content": " can I help you with your calendar today? I can provide information about your upcoming events, check", "isComplete": false}\n',
    'data: {"id": "chunk-3", "content": " your availability, or help with scheduling.\\n", "isComplete": false}\n',
    'data: {"id": "complete", "content": "", "isComplete": true}\n'
  ];

  let fullContent = '';
  let messageUpdates = [];
  
  console.log('Testing detailed SSE parsing...');
  
  // Simulate the decoder and line splitting
  for (const rawData of mockSSEData) {
    console.log('Raw data:', JSON.stringify(rawData));
    
    const lines = rawData.split('\n').filter(line => line.trim());
    console.log('Lines:', lines);
    
    for (const line of lines) {
      console.log('Processing line:', JSON.stringify(line));
      
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        console.log('Data after slice(6):', JSON.stringify(data));
        
        if (data === '[DONE]') {
          console.log('Received [DONE] signal');
          messageUpdates.push({ type: 'DONE', content: '' });
          break;
        }
        
        try {
          const parsedChunk = JSON.parse(data);
          console.log('Parsed chunk:', parsedChunk);
          
          if (parsedChunk.isComplete) {
            console.log('Received completion signal');
            messageUpdates.push({ type: 'COMPLETE', chunk: parsedChunk });
            break;
          }
          
          if (parsedChunk.content) {
            fullContent += parsedChunk.content;
            console.log('Added content:', JSON.stringify(parsedChunk.content));
            console.log('Full content so far:', JSON.stringify(fullContent));
            messageUpdates.push({ type: 'CONTENT', content: parsedChunk.content, fullContent: fullContent });
          }
        } catch (parseError) {
          console.error('Error parsing streaming chunk:', parseError);
          messageUpdates.push({ type: 'ERROR', error: parseError.message, data: data });
        }
      }
    }
  }
  
  console.log('\nFinal content:', JSON.stringify(fullContent));
  console.log('\nMessage updates:', messageUpdates);
}

detailedDebugStreaming();