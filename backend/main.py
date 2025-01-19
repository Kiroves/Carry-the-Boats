from fastapi import FastAPI, WebSocket
from cv.cv import posture_and_eye_tracking
from openai import OpenAI
from dotenv import load_dotenv
import os
import threading
import time

# Load the .env file
load_dotenv()

# Access the variables
openai_api_key = os.getenv("OPENAI_API_KEY")

tabs = [{'title': 'Discord', 'url': 'https://discord.com/login', 'active': False, 'lastAccessed': 1737247392979.38}, {'title': 'YouTube', 'url': 'https://www.youtube.com/', 'active': True, 'lastAccessed': 1737247414909.144}, {'title': "LeetCode - The World's Leading Online Programming Learning Platform", 'url': 'https://leetcode.com/', 'active': False, 'lastAccessed': 1737247380386.886}, {'title': 'Inbox (1,398) - jason2580134@gmail.com - Gmail', 'active': False, 'lastAccessed': 1737247384007.783}] 

tcr = False

client = OpenAI(api_key=openai_api_key)

log = []
response = None
previous_responses = []

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

# gets dinos msg
# params: cv array
def get_msg():
    response, previous_responses

    # use tabs and actions
    prompt = f"""
    You are a helpful dinosaur and assistant aiming to help the user be healthy on the internet.
    Here is the user's tab data:
    Tabs: {tabs}
    
    Categorize each tab into one of the following categories:
        - productivity
        - relaxation
    Here is the user's actions:
    Actions: {log}
    
    If the action says uncentered, that means the user is not sitting straight
    If the action says eyes closed, that means the user eyes are closed
    If the action says No landmark, that means the user is away.
    
    Output a short message to the user to help them be healthy on the internet.
    For example if action says no landmark, you could say "Where'd you go? "
    If the action says uncentered, you could say "Remember to sit up straight! You don't want to end up with a stiff neck like a brontosaurus"
    If the action says eyes closed, you could say "Wake up! You don't want to end up sleeping through an asteroid impact"
    If the user has spent a lot of time on youtube, you could tell them to spend some time being productive.
    If the user has spent a lot of time on work, you could tell the to be a break.
    You don't need to address all the input data. Just pick one at random to talk about.
    Don't talk about actions if it's empty.
    Limit the message to 1 or maybe 2 sentences. Keep is short and to the point, but funny.
    Try not to say the same thing as you said before. Here are up to 3 of your most recent responses: {previous_responses}
    Remember that you are a dinosaur
    Only respond with the message and nothing else"""

    completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
            {"role": "system", "content": prompt},
            {
                "role": "user",
                "content": "Write a haiku about recursion in programming."
            }
        ]
    )

    response = completion.choices[0].message
    previous_responses.append(response)
    if len(previous_responses) > 3:
        previous_responses.pop(0)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    posture_and_eye_tracking(log)

    while True:
        data = await websocket.receive_json()
        tabs = data.get("tabs", [])
        previous_log = []
        previous_tabs = tabs.copy()
        if tabs != previous_tabs or log != previous_log:
            get_msg()
            previous_tabs = tabs.copy()
            previous_log = log.copy()
            await websocket.send_json({"response": response})
            response = None
            
def test():
    posture_and_eye_tracking(log)
    previous_log = []
    previous_tabs = tabs.copy()
    while True:
        if tabs != previous_tabs or log != previous_log:
            get_msg()
            previous_tabs = tabs.copy()
            previous_log = log.copy()
            print(response)            
            response = None
test()
