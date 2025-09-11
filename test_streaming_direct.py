import requests
import json
import time

# Test the streaming endpoint
url = "http://localhost:8000/api/chat/test-stream"
headers = {
    "Content-Type": "application/json"
}

# Simple test message
data = {
    "message": "Hello, how are you?",
    "timestamp": "2023-01-01T00:00:00Z"
}

print("Testing streaming endpoint...")
print(f"Sending request to: {url}")

try:
    with requests.post(url, headers=headers, json=data, stream=True) as response:
        print(f"Status code: {response.status_code}")
        print(f"Headers: {response.headers}")
        
        if response.status_code == 200:
            print("\nStreaming response:")
            for line in response.iter_lines():
                if line:
                    decoded_line = line.decode('utf-8')
                    print(f"Received: {decoded_line}")
                    
                    # Try to parse as JSON if it's a data line
                    if decoded_line.startswith('data: '):
                        try:
                            json_data = json.loads(decoded_line[6:])  # Remove 'data: ' prefix
                            print(f"Parsed JSON: {json_data}")
                            
                            # Check if this is the completion signal
                            if json_data.get('isComplete', False):
                                print("Received completion signal!")
                                break
                        except json.JSONDecodeError as e:
                            print(f"Failed to parse JSON: {e}")
                else:
                    print("Received empty line")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            
except Exception as e:
    print(f"Error occurred: {e}")