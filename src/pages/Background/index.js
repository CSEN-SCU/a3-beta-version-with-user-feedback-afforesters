// Store group IDs for each priority.
let groupIds = {
  'low': null,
  'medium': null,
  'high': null,
};

// Install event
chrome.runtime.onInstalled.addListener(() => {
  console.log('Background script installed');

  // Message listener
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received setPriority command");

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
          console.log("Created new group with ID " + newGroupId);
          groupIds[request.priority] = newGroupId;
          sendResponse({ groupId: newGroupId });
        });
      } else {
        chrome.tabs.get(request.tabId, function(tab) {
          console.log("Tab ID " + request.tabId + " current groupId: " + tab.groupId);
          if (tab.groupId >= 0) {
            console.log("Ungrouping tab ID " + request.tabId);
            chrome.tabs.ungroup(tab.id, function() {
              console.log("Grouping tab ID " + request.tabId + " into group ID " + groupId);
              chrome.tabs.group({
                groupId: groupId,
                tabIds: request.tabId
              }, function() {
                sendResponse({ groupId: groupId });
              });
            });
          } else {
            console.log("Grouping tab ID " + request.tabId + " into group ID " + groupId);
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
});
