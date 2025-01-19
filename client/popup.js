document.getElementById('focusButton').addEventListener('click', () => {
  alert('Stay focused!');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'spawnDino' });
  });
});