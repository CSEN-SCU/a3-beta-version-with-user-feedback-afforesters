import React, { useEffect, useState } from 'react';
import Timer from './Timer';
import EditCard from './EditCard';
import './Popup.css';

const Popup = () => {
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [priority, setPriority] = useState('');
  const [title, setTitle] = useState('');
  
  const handleClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tabId = tabs[0].id;
      chrome.tabs.group({ tabIds: tabId }, groupId => {
        chrome.runtime.sendMessage({
          cmd: 'setPriority',
          priority: priority,
          groupId: groupId,
          tabId: tabId
        }, response => {
          // Handle response.
        });
      });
    });
  };

  useEffect(()=>{
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentURL = tabs[0].url;
      const re = new RegExp("^(?:https?://)?(?:[^@/\n]+@)?(?:www.)?([^:/?\n]+)");
      const domainName = re.exec(currentURL)[1];
      setTitle(domainName)
    });
  },[])


  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">{title}</h1>
      </header>
      <Timer />
      <EditCard title={'Add Maximum'} value={max} setValue={setMax} />
      <EditCard title={'Edit Minimum'} value={min} setValue={setMin} />

      <div>
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="">--Select a Priority--</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={handleClick}>Set Priority</button>
      </div>
    </div>
  );
};

export default Popup;
