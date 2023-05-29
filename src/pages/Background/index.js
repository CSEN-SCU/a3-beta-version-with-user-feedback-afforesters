console.log('Running background script...');

// timer
let timer = {
  id: '',
  startTime: null,
  time: 0,
  timeRange: 0,
  tabIds: [],
};

let timerInterval;

function minutesDiff(date1, date2) {
  var diff = (date1.getTime() - date2.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

const startTimer = () => {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const currTime = new Date();
    if (minutesDiff(currTime, timer.startTime) >= timer.timeRange) {
      console.log('time is up!!!!');
      // todo - save data to local storage

      clearInterval(timerInterval);
    }
  }, 1000);
};

const startTimeReqHandler = (request) => {
  const { domainName, timeRange, tabId } = request;
  console.log('START_TIMER', domainName, timeRange, tabId);

  timer.startTime = new Date();
  timer.id = domainName;
  timer.timeRange = timeRange;
  startTimer();
  // todo save to local storage
  //
};

const getTimeReqHandler = (request, sendResponse) => {
  const { domainName } = request;
  console.log('GET_TIME', domainName);
  const currTime = new Date();

  if (domainName === timer.id) {
    const diff = minutesDiff(currTime, timer.startTime);
    sendResponse({ time: diff, timeIsUp: diff >= timer.timeRange });
  } else {
    sendResponse({ time: 0, timeIsUp: false });
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
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

    chrome.storage.local.get(['groupIds', 'groups', 'tabs'], function (data) {
      console.log('Retrieved data:', data);

      let groupIds = data.groupIds || {};
      let groups = data.groups || {};
      let tabs = data.tabs || {};

      console.log('Current groupIds:', groupIds);
      console.log('Current groups:', groups);
      console.log('Current tabs:', tabs);

      if (groupIds[request.priority] !== undefined) {
        console.log('Group exists for priority, adding tab to group...');
        chrome.tabs.group(
          {
            groupId: groupIds[request.priority],
            tabIds: request.tabId,
          },
          function () {
            console.log('Tab added to existing group.');
            tabs[request.tabId] = {
              priority: request.priority,
              groupId: groupIds[request.priority],
              // Add your other attributes here.
            };
            chrome.storage.local.set({ tabs: tabs }, function () {
              console.log('Updated tab data:', tabs);
              sendResponse({ groupId: groupIds[request.priority] });
            });
          }
        );
      } else {
        console.log('No group exists for priority, creating new group...');
        chrome.tabs.group(
          {
            tabIds: request.tabId,
          },
          function (newGroupId) {
            console.log('New group created.');
            chrome.tabGroups.update(
              newGroupId,
              { color: color, title: request.priority },
              function () {
                console.log('Group updated with color and title.');
                groupIds[request.priority] = newGroupId;
                groups[newGroupId] = {
                  color: color,
                  title: request.priority,
                  // Add other group properties here.
                };
                tabs[request.tabId] = {
                  priority: request.priority,
                  groupId: newGroupId,
                  // Add your other attributes here.
                };
                chrome.storage.local.set(
                  { groupIds: groupIds, groups: groups, tabs: tabs },
                  function () {
                    console.log(
                      'Updated group and tab data:',
                      groupIds,
                      groups,
                      tabs
                    );
                    sendResponse({ groupId: newGroupId });
                  }
                );
              }
            );
          }
        );
      }
    });

    return true; // Keeps the message channel open while waiting for async response.
  } else if (request.cmd === 'START_TIMER') {
    startTimeReqHandler(request);
  } else if (request.cmd === 'GET_TIME') {
    getTimeReqHandler(request, sendResponse);
  }
});
