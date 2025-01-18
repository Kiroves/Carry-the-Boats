import asyncio
import websockets
import json
from dotenv import load_dotenv
import os

# Load the .env file
load_dotenv()

# Access the variables
openai_api_key = os.getenv("OPENAI_API_KEY")

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
# asyncio.run(test_websocket())


from openai import OpenAI
client = OpenAI(api_key=openai_api_key)

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Write a haiku about recursion in programming."
        }
    ]
)

print(completion.choices[0].message)
