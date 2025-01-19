import { renderBlueSquare } from './Sprite'
import { useState, useEffect } from 'react';
import './App.css';
import './Sprite.css';

function App() {
  const [frame, setFrame] = useState(0); // State to track the current frame
  const [isAnimating, setIsAnimating] = useState(false); // Animation state
  const [isStopped, setIsStopped] = useState(false); // Stop animation state

  const frameWidth = 24; // Width of one frame in pixels
  const totalFrames = isStopped ? 12 : 4; // Total number of frames depends on state
  const startFrame = isStopped ? 4 : 0; // Starting frame depends on state
  const endFrame = isStopped ? 18 : totalFrames - 1; // End frame depends on state

  const getTabInfo = () => {
    chrome.tabs.query({}, (tabs) => {
      const tabInfo = tabs.map(tab => ({
        title: tab.title,
        url: tab.url,
        active: tab.active,
        lastAccessed: tab.lastAccessed
      }))
      console.log('Tab Info:', tabInfo)

      const ws = new WebSocket('ws://127.0.0.1:8000/ws')
      ws.onopen = () => {
        ws.send(JSON.stringify(tabInfo))
      }
      ws.onmessage = (event) => {
        console.log('Message from server:', event.data)
      }
    })
  }

  useEffect(() => {
    renderBlueSquare()
  })

  useEffect(() => {
    let interval: number | undefined;

    if (isAnimating) {
      interval = window.setInterval(() => {
        setFrame((prevFrame) => {
          if (prevFrame < endFrame) {
            return prevFrame + 1; // Move to the next frame
          } else if (!isStopped) {
            return startFrame; // Loop back if not stopped
          } else {
            setIsAnimating(false); // Stop animation after reaching the endFrame
            return prevFrame;
          }
        });
      }, 200); // Adjust timing for frame speed
    }

    return () => {
      if (interval) clearInterval(interval); // Cleanup interval on unmount or animation stop
    };
  }, [isAnimating, isStopped, startFrame, endFrame]);

  const startAnimation = () => {
    setIsStopped(false); // Reset to initial animation
    setFrame(startFrame); // Reset frame
    setIsAnimating(true); // Start the animation
  };

  const stopAnimation = () => {
    setIsStopped(true); // Switch to the stopped state
    setFrame(4); // Start from frame 4
    setIsAnimating(true); // Start the "stopped" animation (frames 4 to 15)
  };

  return (
    <>
      <div className="card">
        <div
          className="dino-sprite"
          style={{
            backgroundPosition: `-${frame * frameWidth}px 0`, // Dynamically update the background position
          }}
        ></div>
        <button onClick={startAnimation}>Run Dinosaur Animation</button>
        <button onClick={stopAnimation}>Stop and Play Once</button>
        <button onClick={getTabInfo}>
          Log Tab Info
        </button>
  
      </div>
 
    </>
  );
}

export default App;