// Create WebSocket connection
const socket = new WebSocket('ws://localhost:8000/ws');

socket.onopen = function(e) {
  console.log('[WebSocket] Connection established');
};

socket.onmessage = function(event) {
  console.log('[WebSocket] Message received:', event.data);
  // Handle incoming messages here
};

socket.onerror = function(error) {
  console.error('[WebSocket] Error:', error);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[WebSocket] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    console.log('[WebSocket] Connection died');
  }
};

document.getElementById('runAnimation').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'spawnDino' });
  });
});

document.getElementById('sayHelloButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'sayHello' });
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.query({}, (tabs) => {
    const tabInfos = tabs.map(currentTab => ({
      title: currentTab.title,
      url: currentTab.url,
      isActive: currentTab.active,
      windowId: currentTab.windowId
    }));

    console.log(tabInfos);

    fetch('http://localhost:8000/update_tabs', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(tabInfos)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Tab info sent:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
});
