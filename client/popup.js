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
