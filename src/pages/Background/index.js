console.log('This is the background page.');
console.log('Put the background scripts here.');

// For priority setting
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === 'setPriority') {
    let color;
    switch (request.priority) {
      case 'low':
        color = 'green';
        break;
      case 'medium':
        color = 'yellow';
        break;
      case 'high':
        color = 'red';
        break;
      default:
        color = 'grey';
    }

    chrome.tabs.group({
      groupId: request.groupId,
      tabIds: request.tabId,
      createProperties: { color: color, title: request.priority }
    }, (groupId) => {
      sendResponse({ groupId: groupId });
    });
  }

  return true;  
});
