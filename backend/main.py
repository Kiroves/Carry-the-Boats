from fastapi import FastAPI, WebSocket
from cv.cv import posture_and_eye_tracking
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load the .env file
load_dotenv()

# Access the variables
openai_api_key = os.getenv("OPENAI_API_KEY")

tabs = []

tcr = False

client = OpenAI(api_key=openai_api_key)



app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}


# gets dinos msg
# params: cv array
def get_msg(actions):
    print(actions)

    # use tabs and actions

    # completion = client.chat.completions.create(
    # model="gpt-4o-mini",
    # messages=[
    #         {"role": "system", "content": "You are a helpful assistant."},
    #         {
    #             "role": "user",
    #             "content": "Write a haiku about recursion in programming."
    #         }
    #     ]
    # )

    # print(completion.choices[0].message)
    

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    posture_and_eye_tracking(get_msg)

    while True:
        data = await websocket.receive_json()
        response = {"message": f"Received: {data}"}
        tabs = data.get("tabs", [])
        await websocket.send_json(response)  # Send JSON object
