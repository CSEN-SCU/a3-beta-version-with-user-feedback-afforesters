// For priority setting
// Store group IDs for each priority.
let groupIds = {
  low: null,
  medium: null,
  high: null,
};

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
      chrome.tabs.group(
        {
          createProperties: { color: color, title: request.priority },
          tabIds: request.tabId,
        },
        function (newGroupId) {
          groupIds[request.priority] = newGroupId;
          sendResponse({ groupId: newGroupId });
        }
      );
    } else {
      chrome.tabs.get(request.tabId, function (tab) {
        if (tab.groupId >= 0) {
          chrome.tabs.ungroup(tab.id, function () {
            chrome.tabs.group(
              {
                groupId: groupId,
                tabIds: request.tabId,
              },
              function () {
                sendResponse({ groupId: groupId });
              }
            );
          });
        } else {
          chrome.tabs.group(
            {
              groupId: groupId,
              tabIds: request.tabId,
            },
            function () {
              sendResponse({ groupId: groupId });
            }
          );
        }
      });
    }

    return true;
  } else if (request.cmd === 'START_TIMER') {
    const { domainName, timeRange, tabId } = request;
    console.log('START_TIMER', domainName, timeRange, tabId);

    timer.startTime = new Date();
    timer.id = domainName;
    timer.timeRange = timeRange;
    startTimer();
    // todo save to local storage
    //
  } else if (request.cmd === 'GET_TIME') {
    const { domainName } = request;
    console.log('GET_TIME', domainName);
    const currTime = new Date();

    if (domainName === timer.id) {
      const diff = minutesDiff(currTime, timer.startTime);
      sendResponse({ time: diff, timeIsUp: diff >= timer.timeRange });
    }
  }
});
