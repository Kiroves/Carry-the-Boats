document.getElementById('runAnimation').addEventListener('click', () => {
  // alert('Stay focused!');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'spawnDino' });
  });
});

document.getElementById('sayHelloButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'sayHello' });
  });
});

document.getElementById('sendTabInfo').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const tabInfo = {
      title: currentTab.title,
      url: currentTab.url,
      isActive: currentTab.active,
      timestamp: new Date().toISOString(),
      windowId: currentTab.windowId
    };

    const ws = new WebSocket('ws://localhost:8080/ws');
    
    ws.onopen = () => {
      ws.send(JSON.stringify(tabInfo));
      console.log('Tab info sent:', tabInfo);
      ws.close();
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  });
});