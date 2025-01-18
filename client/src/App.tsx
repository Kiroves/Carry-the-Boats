import React from 'react';
import { Settings } from 'lucide-react';

function App() {
  return (
    <div className="w-[400px] h-[500px] bg-white">
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Chrome Extension</h1>
        </div>
      </header>
      
      <main className="p-4">
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Welcome!</h2>
          <p className="text-gray-600">
            This is your new Chrome extension. Start customizing it by editing <code>src/App.tsx</code>
          </p>
        </div>
        
        <div className="mt-4 space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">Getting Started</h3>
            <p className="mt-1 text-sm text-gray-500">
              1. Build your extension using <code>npm run build</code><br />
              2. Go to chrome://extensions/<br />
              3. Enable Developer mode<br />
              4. Click "Load unpacked" and select the dist folder
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;