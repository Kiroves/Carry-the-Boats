from fastapi import FastAPI, WebSocket
from cv.cv import PostureEyeTracker  # Update import to use the new class
from openai import OpenAI
from dotenv import load_dotenv
import os
import time

# Load the .env file
load_dotenv()

# Access the variables
openai_api_key = os.getenv("OPENAI_API_KEY")

tabs = [{'title': 'Discord', 'url': 'https://discord.com/login', 'active': False},
        {'title': 'YouTube', 'url': 'https://www.youtube.com/', 'active': True}]

client = OpenAI(api_key=openai_api_key)

log = []
response = None
previous_responses = []

app = FastAPI()
tracker = PostureEyeTracker()  # Create tracker instance

@app.on_event("startup")
async def startup_event():
    tracker.start()  # Start tracking when the app starts

@app.on_event("shutdown")
async def shutdown_event():
    tracker.stop()  # Stop tracking when the app shuts down
    
def get_msg():
    global response, previous_responses

    # use tabs and actions
    prompt = f"""
    You are a helpful dinosaur and assistant aiming to help the user be healthy on the internet.
    You will be given the user's browser tab data
    
    Categorize each tab into one of the following categories:
        - productivity
        - relaxation
    You will also be given a list of the user's actions.
    
    If the action says uncentered, that means the user is not sitting straight
    If the action says eyes closed, that means the user eyes are closed
    If the action says No landmark, that means the user is away.
    
    Output a short message to the user to help them be healthy on the internet.
    For example if action says no landmark, you could say "Where'd you go? "
    If the action says uncentered, you could say "Remember to sit up straight!"
    If the action says eyes closed, you could say "Wake up! You don't want to end up sleeping through an asteroid impact"
    If the user has spent a lot of time on youtube, you could tell them to spend some time being productive.
    If the user has spent a lot of time on work, you could tell the to be a break.
    You don't need to address all the input data. Just pick one at random to talk about.
    Don't talk about actions if it's empty.
    Limit the message to 1 or maybe 2 sentences. Keep is short and to the point, but funny.
    Try not to say the same thing as you said before. You will also be given up to 3 of your most recent responses
    Remember that you are a dinosaur and try to make dinosaur puns if possible.
    Only respond with the message and nothing else
    """
    
    userprompt = f"""
   "tabs": {tabs},
    "log": {log[-1]},   
    "previous_responses": {previous_responses}
    """

    completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": prompt},
        {
            "role": "user",
            "content": userprompt
        }
    ]
)

    response = completion.choices[0].message
    previous_responses.append(response)
    if len(log) > 3:
        log.pop(0)
    if len(previous_responses) > 3:
        previous_responses.pop(0)

def update_log():
    while True:
        status = tracker.get_status()
        if status:
            log.append(status)
        time.sleep(0.1)  # Small delay to prevent CPU overuse

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global response
    await websocket.accept()
    
    while True:
        data = await websocket.receive_json()
        tabs = data.get("tabs", [])
        
        # Check for new status
        status = tracker.get_status()
        if status:
            log.append(status)
            
        # Get message and send response
        if response:
            await websocket.send_json({"response": response})
            response = None

def test():
    global response
    tracker.start()
    try:
        while True:
            status = tracker.get_status()
            if status:
                log.append(status)
                get_msg()  # Your existing message generation function
                print(response)
            time.sleep(0.1)  # Small delay to prevent CPU overuse
    finally:
        tracker.stop()

if __name__ == "__main__":
    test()