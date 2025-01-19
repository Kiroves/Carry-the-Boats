from tcr import get_hr
import asyncio
import os
import random
import time

from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, Request
from openai import OpenAI

from cv.cv import PostureEyeTracker  # Update import to use the new class

# Load the .env file
load_dotenv()

# Access the variables
openai_api_key = os.getenv("OPENAI_API_KEY")

tabs = []

client = OpenAI(api_key=openai_api_key)
hr= 60
log = []
response = None
previous_responses = []
new_tabs = []

app = FastAPI()
tracker = PostureEyeTracker()  # Create tracker instance
cooldown = False
            
@app.on_event("startup")
async def startup_event():
    tracker.start() 
    global hr
    hr = await get_hr()
    print("hr", hr)# Start tracking when the app starts

@app.on_event("shutdown")
async def shutdown_event():
    tracker.stop()  # Stop tracking when the app shuts down
    
@app.post("/update_tabs")
async def update_tabs(request: Request):
    global tabs, log, new_tabs
    data = await request.json()
    new_tabs = data
    tabs = new_tabs  # Update tabs with new data
    return {"hi": "hi"}

async def get_msg():
    global response, previous_responses, log, hr, tabs
    # use tabs and actions
    prompt = f"""
    You are a helpful dinosaur and assistant aiming to help the user be healthy on the internet.
    You will be given the user's browser tab data
    
    Categorize each tab into one of the following categories:
        - productivity
        - relaxation
    You will also be given a list of the user's actions called log.
    Prioritize the last action in log.
    
    If the log says uncentered, that means the user is not sitting straight
    If the log says eyes closed, that means the user eyes are closed
    If the log says No landmark, that means the user is away.
    
    You will also be given the user's heart rate.
    
    Output a short message to the user to help them be healthy on the internet.
    For example if log says no landmark, you could say "Where'd you go? "7
    If the log says "heart_rate", you could mention their heart rate and either 
    tell them to chill out, or lock in depending on whether their current tabs is relaxation or productive.
    If the log says uncentered, you could say "Remember to sit up straight!"
    If the log says tab, you could talk about the tabs"

    If the log says eyes closed, you could say "Wake up! You don't want to end up sleeping through an asteroid impact"
    If the user has spent a lot of time on youtube, you could tell them to spend some time being productive.
    If the user has spent a lot of time on work or their heart rate is high that could mean that they are stressed,
    you could tell them to take a break.
    
    IMPORTANT:
    <important start>
    If log is empty, or log is heart_rate, 
    but there's nothing unusual about the heart rate or 
    if log is tab, but you have already talk about every tab, 
    say something funny or dinosaur related.
    <important end>
    
    
    Limit the message to 1 short sentence. Keep is short and to the point, but funny.
    Try not to say the same thing as you said before. You will also be given up your most recent responses to avoid mentioning the same thing.
    Remember that you are a dinosaur and try to make dinosaur puns if possible.
    You can also recommend to close work tabs if the user is currently relaxing or close relaxing tabs if the user is being productive.
    Think about how much time they have spent on the tabs as well.
    Try not to talk about the same thing twice in general.
    Only respond with the message and nothing else
    """
    
    userprompt = f"""
   "tabs": {tabs},
    "log": {log},   
    "previous_responses": {previous_responses},
    "heart_rate": {hr}
    """
    print("info", tabs, log, hr)

    completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": prompt},
        {
            "role": "user",
            "content": userprompt
        }
    ],
    temperature=0.8
)
    response = completion.choices[0].message
    previous_responses.append(response)
    if len(previous_responses) > 4:
        previous_responses.pop(0)
    return response

def update_log():
    global log
    while True:
        status = tracker.get_status()
        if status:
            log.append(status)
        time.sleep(0.1)  # Small delay to prevent CPU overuse

@app.post("/dino")
async def dino(request: Request):
    global log
    data = await request.json()
    action = data.get("action")

    if action == "tab":
        log.append("tab")
    elif action == "heart_rate":
        log.append("heart_rate")
    elif action == "activity":
        pass

    message = await get_msg()
    return {"message": message}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global response, tabs, log, new_tabs
    await websocket.accept()

    async def append_heart_rate():
        while True:
            await asyncio.sleep(15)
            log.append("heart_rate")
            await get_msg()  # Call get_msg when heart_rate is appended to log

    asyncio.create_task(append_heart_rate())

    while True:
        if new_tabs != tabs:
            tabs = new_tabs
            log.append("tab")
            await get_msg()
        # Check for new status
        status = tracker.get_status()
        if status:
            log.append(status)
            await get_msg()  # Call get_msg when log changes
        # Get message and send response
        if response:
            await websocket.send_json({"response": response})
            response = None