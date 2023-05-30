console.log('Running background script...');

let timer = null;

const extractDomainName = (url) => {
  if (url === '') {
    return '';
  } else {
    const re = new RegExp('^(?:https?://)?(?:[^@/\n]+@)?(?:www.)?([^:/?\n]+)');
    return re.exec(url)[1];
  }
};

const timeIsUp = async () => {
  console.log('time is up!!!!');
  await timer.saveToStorage();
};

const startTimerReqHandler = (request) => {
  const { domainName, timeRange, tabId, timerType } = request;
  console.log('START_TIMER', domainName, timeRange, tabId);

  timer = new Timer(domainName, [tabId], 0, timeRange, timerType, () => {
    timeIsUp();
  });
  timer.start();

  // todo save to local storage
  //
};

const getTimeReqHandler = (request, sendResponse) => {
  const { domainName } = request;
  console.log('GET_TIME', domainName);
  if (timer == null || domainName !== timer.domainName) {
    sendResponse({ time: 0, timeIsUp: false });
  } else {
    const { time, timeIsUp } = timer.getTime();
    console.log('current time', time, timeIsUp);
    sendResponse({ time, timeIsUp });
  }
};

const checkTimerExistHandler = (request, sendResponse) => {
  const { domainName } = request;
  if (timer && timer.domainName === domainName) {
    console.log('isTimerExist', true);
    sendResponse({
      isTimerExist: true,
      timeLimit: timer.timeLimit,
      timerType: timer.type,
    });
  } else {
    console.log('isTimerExist', false);
    sendResponse({ isTimerExist: false });
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
    startTimerReqHandler(request);
    // return true;
  } else if (request.cmd === 'GET_TIME') {
    getTimeReqHandler(request, sendResponse);
    // return true;
  } else if (request.cmd === 'CHECK_IS_TIMER_EXIST') {
    checkTimerExistHandler(request, sendResponse);
    return true;
  }
});

const stopAndSaveCurrentTimer = async () => {
  if (timer !== null) {
    // stop current timer
    if (timer.status) {
      // if timer is running
      timer.stop();
    }
    //save timer to local storage
    await timer.saveToStorage();
    timer = null; // set global timer pointer to null
    console.log('tab onActivated: stop and save last timer');
  }
};

chrome.runtime.onInstalled.addListener(async () => {
  // init localtimers in chrome local storage
  const hashmap = {};
  await chrome.storage.local.set({ LOCAL_TIMERS: JSON.stringify(hashmap) });
  console.log('init LOCAL_TIMER in chrome local storage');
});

// event when tab is closed
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  console.log('tab closed: ', tabId);
});

chrome.windows.onRemoved.addListener(async () => {
  await stopAndSaveCurrentTimer();
});

// event when activated tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const { tabId, windowId } = activeInfo;
  console.log('tab onActivated: ', tabId, windowId);

  await stopAndSaveCurrentTimer();

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log('show tabs', tabs);
  const domainName = extractDomainName(tabs[0].url);

  console.log('show current domainName', domainName);

  const { LOCAL_TIMERS } = await chrome.storage.local.get('LOCAL_TIMERS');

  console.log('localTimers_str: ', LOCAL_TIMERS);

  const localTimers = JSON.parse(LOCAL_TIMERS);
  const timerKey = `timer-${domainName}`;
  const previousTimer = localTimers[timerKey];

  if (previousTimer) {
    console.log(previousTimer);

    const { domainName, tabIds, time, timeLimit, type } = previousTimer;
    console.log('RESTART_TIMER', previousTimer);

    timer = new Timer(domainName, tabIds, time, timeLimit, type, () => {
      timeIsUp();
    });
    timer.start();
  } else {
    console.log('no previous timer');
  }

  /**
   * todo
   * if (there is running timer){
   *    stop timer
   *    save timer
   *
   * }
   */
});

class Timer {
  constructor(
    domainName = '',
    tabIds = [],
    time = 0,
    timeLimit = 25 * 60,
    type = 'max', // timer type 'max' | 'min'
    callback = () => {} // callback when time is up
  ) {
    this.domainName = domainName;
    this.tabIds = tabIds;
    this.time = time; // unit second
    this.timeLimit = timeLimit;
    this.type = type;
    this.interval = null;
    this.callback = callback;
    this.status = false; // time status, running -> true , stop -> false
  }

  getTime() {
    return { time: this.time, timeIsUp: this.time >= this.timeLimit };
  }

  start() {
    clearInterval(this.interval);
    this.status = true; // show timer is running
    this.interval = setInterval(() => {
      this.time += 1;
      if (this.time >= this.timeLimit) {
        this.callback && this.callback();
        this.stop();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
    this.status = false; // show timer is stopped
    return this.time;
  }

  copy() {
    return {
      domainName: this.domainName,
      tabIds: this.tabIds,
      time: this.time,
      timeLimit: this.timeLimit,
      type: this.type,
    };
  }

  async saveToStorage() {
    const { LOCAL_TIMERS } = await chrome.storage.local.get('LOCAL_TIMERS');
    const timers = JSON.parse(LOCAL_TIMERS);
    const timerKey = `timer-${this.domainName}`;
    timers[timerKey] = this.copy();
    const value = JSON.stringify(timers);
    await chrome.storage.local.set({ LOCAL_TIMERS: value });
  }
}
