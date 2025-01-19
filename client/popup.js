const button = document.getElementById('runAnimation');
const currentState = button.dataset.state;

// check state
// if (currentState === 'stopped') {
//   button.textContent = 'Stop';
// } else {
//   button.textContent = 'Start';
// }

// set button text accordingly


document.getElementById('runAnimation').addEventListener('click', () => {
  const button = document.getElementById('runAnimation');
  const currentState = button.dataset.state;
  
  if (currentState === 'stopped') {
    button.textContent = 'Stop';
    button.dataset.state = 'running';
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'spawnDino' });
    });
  } else {
    button.disabled = true;  // Disable button
    button.textContent = 'Stopping...';
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'stopDino' });
    });
    // Re-enable button and reset state after animation completes (~ 3 seconds)
    setTimeout(() => {
      button.disabled = false;
      button.textContent = 'Start';
      button.dataset.state = 'stopped';
    }, 3000);
  }
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
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStatusBox') {
    const statusBox = document.getElementById('statusBox');
    statusBox.innerText = request.message;
  }
  if (request.action === 'updateButtonState') {
    const button = document.getElementById('runAnimation');
    if (request.state === 'running') {
      button.textContent = 'Stop';
      button.dataset.state = 'running';
    } else {
      button.textContent = 'Start';
      button.dataset.state = 'stopped';
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('lastMessage', (data) => {
    const statusBox = document.getElementById('statusBox');
    if (data.lastMessage) {
      statusBox.innerText = data.lastMessage;
    }
  });

  // Request the dino state from the content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'checkDinoState' });
  });
});
