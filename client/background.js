const messages = ['heart_rate', 'tab', 'activity'];
let currentMessageIndex = 0;

function sendDinoMessage() {
  fetch('http://localhost:8000/dino', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: messages[currentMessageIndex] })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Dino message sent:', data);
    currentMessageIndex = (currentMessageIndex + 1) % messages.length;
    
    chrome.storage.local.set({ lastMessage: data.message.content });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: 'sayAlert', 
        message: data.message.content 
      });
    });

    chrome.runtime.sendMessage({ action: 'updateStatusBox', message: data.message.content });
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function sendTabInfo() {
  chrome.tabs.query({}, (tabs) => {
    const tabInfos = tabs.map(currentTab => ({
      title: currentTab.title,
      url: currentTab.url,
      isActive: currentTab.active,
      windowId: currentTab.windowId
    }));

    fetch('http://localhost:8000/update_tabs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tabInfos)
    })
    .then(response => response.json())
    .then(data => console.log('Tab info sent:', data))
    .catch(error => console.error('Error:', error));
  });
}

// Initial execution
sendTabInfo();
sendDinoMessage();

// Set up intervals
setInterval(sendDinoMessage, 10000);
setInterval(sendTabInfo, 10000);
