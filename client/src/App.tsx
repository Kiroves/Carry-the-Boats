// import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const getTabInfo = () => {
    chrome.tabs.query({}, (tabs) => {
      const tabInfo = tabs.map(tab => ({
        title: tab.title,
        url: tab.url,
        active: tab.active,
        lastAccessed: tab.lastAccessed
      }))
      console.log('Tab Info:', tabInfo)
    })
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={getTabInfo}>
          Log Tab Info
        </button>
      </div>
    </>
  )
}

export default App
