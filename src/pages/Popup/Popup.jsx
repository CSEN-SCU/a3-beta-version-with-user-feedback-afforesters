import React, { useCallback, useEffect, useRef, useState } from 'react';
import Timer from './Timer';
import EditCard from './EditCard';
import './Popup.css';

const Popup = () => {
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [priority, setPriority] = useState('');
  const [title, setTitle] = useState('');
  const [currFocus, setCurrFocus] = useState('');
  const [time, setTime] = useState(0);
  const [timeRange, setTimeRange] = useState(0);
  const [timeIsUp, setTimeIsUp] = useState(false);

  const tabIdRef = useRef();
  const intervalRef = useRef(null);

  const startTimer = useCallback(
    (_time) => {
      setTimeRange(_time);
      chrome.runtime.sendMessage({
        cmd: 'START_TIMER',
        domainName: title,
        timeRange: _time,
        tabId: tabIdRef.current,
      });
    },
    [title]
  );

  const handleClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.group({ tabIds: tabId }, (groupId) => {
        chrome.runtime.sendMessage(
          {
            cmd: 'setPriority',
            priority: priority,
            groupId: groupId,
            tabId: tabId,
          },
          (response) => {
            // Handle response.
          }
        );
      });
    });
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentURL = tabs[0].url;
      const re = new RegExp(
        '^(?:https?://)?(?:[^@/\n]+@)?(?:www.)?([^:/?\n]+)'
      );
      const domainName = re.exec(currentURL)[1];
      setTitle(domainName);
      // save current tab id to tabIdRef
      tabIdRef.current = tabs[0].id;

      intervalRef.current = setInterval(() => {
        chrome.runtime.sendMessage(
          {
            cmd: 'GET_TIME',
            domainName: domainName,
          },
          (response) => {
            setTime(response.time);
            if (response.timeIsUp) {
              setTimeIsUp(true);
              clearInterval(intervalRef.current);
            }
          }
        );
      }, 1000);
    });

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">{title}</h1>
      </header>
      <Timer time={time} timeRange={timeRange} timeIsUp={timeIsUp} />

      <EditCard
        title={'Add Maximum'}
        name="max"
        value={max}
        setValue={setMax}
        currFocus={currFocus}
        setCurrFocus={setCurrFocus}
        setTimeRange={startTimer}
      />

      <EditCard
        title={'Edit Minimum'}
        name="min"
        value={min}
        setValue={setMin}
        currFocus={currFocus}
        setCurrFocus={setCurrFocus}
        setTimeRange={startTimer}
      />

      <div>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">--Select a Prority--</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={handleClick}>Set Pority</button>
      </div>
    </div>
  );
};

export default Popup;
