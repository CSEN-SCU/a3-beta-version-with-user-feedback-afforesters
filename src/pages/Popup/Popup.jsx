import React, { useState } from 'react';
import Timer from './Timer';
import EditCard from './EditCard';
import './Popup.css';

const Popup = () => {
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Reddit</h1>
      </header>
      <Timer />
      <EditCard title={'Add Maximum'} value={max} setValue={setMax} />
      <EditCard title={'Edit Minimum'} value={min} setValue={setMin} />
    </div>
  );
};

export default Popup;
