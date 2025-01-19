// src/content.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'

const BlueSquare: React.FC = () => {
  return <div style={{
    width: '50px',
    height: '50px',
    backgroundColor: 'blue',
    position: 'fixed',
    bottom: '50px',
    right: '50px',
    zIndex: 10001
  }} />
}

export function renderBlueSquare() {
  const root = document.createElement('div')
  root.id = 'crx-root'
  document.body.appendChild(root)

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BlueSquare />
    </React.StrictMode>
  )
}