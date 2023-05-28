// For priority setting
// Store group IDs for each priority.
let groupIds = {
  'low': null,
  'medium': null,
  'high': null,
};

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

    let groupId = groupIds[request.priority];
      
    if (groupId === null) {
      console.log('create new group');
      chrome.tabs.group({
        createProperties: { color: color, title: request.priority },
        tabIds: request.tabId
      }, function(newGroupId) {
        groupIds[request.priority] = newGroupId;
        sendResponse({ groupId: newGroupId });
      });
    } else {
      chrome.tabs.get(request.tabId, function(tab) {
        if (tab.groupId >= 0) {
          chrome.tabs.ungroup(tab.id, function() {
            chrome.tabs.group({
              groupId: groupId,
              tabIds: request.tabId
            }, function() {
              sendResponse({ groupId: groupId });
            });
          });
        } else {
          chrome.tabs.group({
            groupId: groupId,
            tabIds: request.tabId
          }, function() {
            sendResponse({ groupId: groupId });
          });
        }
      });
    }

    return true;
  }
});
