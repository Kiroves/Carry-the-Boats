# FastAPI Backend

## Setup

1. Create a virtual environment:
    ```bash
    python -m venv venv
    ```

2. Activate the virtual environment:
    - On Windows:
        ```bash
        venv\Scripts\activate
        ```
    - On Unix or MacOS:
        ```bash
        source venv/bin/activate
        ```

3. Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Server

Start the FastAPI server using Uvicorn:
```bash
uvicorn main:app --reload
```

The server will be available at `http://127.0.0.1:8000`.

## WebSocket Endpoint

You can connect to the WebSocket endpoint at `ws://127.0.0.1:8000/ws`.
