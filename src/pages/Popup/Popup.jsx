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
  const [type, setType] = useState('max'); // default timer type max

  const tabIdRef = useRef();
  const intervalRef = useRef(null);

  const getTime = useCallback(async (domainName) => {
    const response = await chrome.runtime.sendMessage({
      cmd: 'GET_TIME',
      domainName: domainName,
    });
    const time_minute = Math.floor(response.time / 60);

    return { response, time_minute };
  }, []);

  // subscribe Timer and keep update timer on popup page
  const subscribeTimer = useCallback(
    async (domainName) => {
      const { time_minute } = await getTime(domainName);

      setTime(time_minute);

      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current); // clear previous interval
      }

      intervalRef.current = setInterval(async () => {
        const { response, time_minute } = await getTime(domainName);
        setTime(time_minute);
        if (response.timeIsUp) {
          setTimeIsUp(true);
          if (response.timerType === 'max') {
            // if timer type is max,
            // stop this timer subscription when time is up
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 1000);
    },
    [getTime]
  );

  const startTimer = useCallback(
    async (_time) => {
      if (_time === 0) {
        // do nothing
      } else {
        setTimeRange(_time);
        setType(currFocus);
        await chrome.runtime.sendMessage({
          cmd: 'START_TIMER',
          domainName: domainName,
          timeRange: _time * 60,
          tabId: tabIdRef.current,
          timerType: currFocus,
        });
        await subscribeTimer(domainName);
      }
    },
    [currFocus, domainName, subscribeTimer]
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

  const init = useCallback(async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const _domainName = extractDomainName(tabs[0].url);
    setDomainName(_domainName);
    // save current tab id to tabIdRef
    tabIdRef.current = tabs[0].id;

    const { isTimerExist, timeLimit, timerType } =
      await chrome.runtime.sendMessage({
        cmd: 'CHECK_IS_TIMER_EXIST',
        domainName: _domainName,
      });

    if (isTimerExist) {
      subscribeTimer(_domainName);
      setCurrFocus(timerType);
      setType(timerType);
      setTimeRange(timeLimit / 60); // seconds to minutes
      
      if (timerType === 'max') {
        setMax(timeLimit / 60);
        setType('max');
      } else if (timerType === 'min') {
        setMin(timeLimit / 60);
        setType('min');
      }
    } else {
      // do nothing
    }
  }, [subscribeTimer]);

  useEffect(() => {
    init();
    // return () => clearInterval(intervalRef.current);
  }, [init]);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">{domainName}</h1>
      </header>
      <Timer
        time={time}
        timeRange={timeRange}
        timeIsUp={timeIsUp}
        type={type}
      />

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
      <div className="priority-wrapper">
        <div className="box">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">--Select a Priority--</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button className="button-23" onClick={handleClick}>
          Set Priority
        </button>
      </div>
    </div>
  );
};

export default Popup;
