import React, { useCallback, useEffect, useRef, useState } from 'react';
import Timer from './Timer';
import EditCard from './EditCard';
import { extractDomainName } from './utils/domainName';
import './Popup.css';

const Popup = () => {
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [priority, setPriority] = useState('');
  const [domainName, setDomainName] = useState('');
  const [currFocus, setCurrFocus] = useState('');
  const [time, setTime] = useState(0);
  const [timeRange, setTimeRange] = useState(0);
  const [timeIsUp, setTimeIsUp] = useState(false);

  const tabIdRef = useRef();
  const intervalRef = useRef(null);

  // subscribe Timer and keep update timer on popup page
  const subscribeTimer = (domainName) => {
    intervalRef.current = setInterval(async () => {
      const response = await chrome.runtime.sendMessage({
        cmd: 'GET_TIME',
        domainName: domainName,
      });
      setTime(response.time);
      if (response.timeIsUp) {
        setTimeIsUp(true);
        /*
        await chrome.runtime.sendMessage({
          cmd: 'TIME_IS_UP',
        });
        */
        let queryOptions = { active: true, currentWindow: true };
        let tab = await chrome.tabs.query(queryOptions);

        chrome.tabs.sendMessage(
          tab[0].id,
          { cmd: "TIME_IS_UP" },
          function (response) {
            console.log(response.status);
          }
        );
        clearInterval(intervalRef.current);
      }
    }, 1000);
  };

  const startTimer = useCallback(
    async (_time) => {
      setTimeRange(_time);
      await chrome.runtime.sendMessage({
        cmd: 'START_TIMER',
        domainName: domainName,
        timeRange: _time,
        tabId: tabIdRef.current,
      });
      subscribeTimer(domainName);
    },
    [domainName]
  );

  const handleClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.runtime.sendMessage(
        {
          cmd: 'setPriority',
          priority: priority,
          tabId: tabId,
        },
        (response) => {
          // Handle response.
        }
      );
    });
  };

  const init = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const _domainName = extractDomainName(tabs[0].url);
    setDomainName(_domainName);
    // save current tab id to tabIdRef
    tabIdRef.current = tabs[0].id;

    // todo ------
    // if current page has running timer
    // subscribeTimer(domainName)
  };

  useEffect(() => {
    init();
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">{domainName}</h1>
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
      <div className = 'priority-wrapper'>
        <div className='box'>
          <select  value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">--Select a Priority--</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          
        </div>
        <button className='button-23' role='button' onClick={handleClick}>Set Priority</button>
      </div>
      
    </div>
  );
};

export default Popup;
