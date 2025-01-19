import asyncio
import json

import websockets
from dotenv import load_dotenv


async def test_websocket():
    uri = "ws://localhost:8000/ws"
    async with websockets.connect(uri) as websocket:
        # JSON object to send
        data = {"type": "greeting", "content": "Hello, WebSocket!"}
        await websocket.send(json.dumps(data))  # Send JSON as a string

        # Receive and parse the JSON response
        response = await websocket.recv()
        print("Response from server:", json.loads(response))  # Convert back to Python dict

# Run the test
asyncio.run(test_websocket())



