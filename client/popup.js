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
  })
  .catch(error => {
    console.error('Error:', error);
  });
  console.log(messages[currentMessageIndex]);

}

// Send first message immediately
sendDinoMessage();

// Set up interval for subsequent messages
setInterval(sendDinoMessage, 4000);

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
