import React, { useCallback, useMemo, useState } from 'react';
import SvgIconPlus from '../assets/SvgIconMinus';
import SvgIconMark from '../assets/SvgIconMark';
import './index.css';

const styles = {
  focused: {
    background: `rgba(217, 217, 217, 0.3)`,
    border: `3px solid rgba(0, 0, 0, 0.44)`,
  },
};

const EditCard = ({
  title,
  name,
  value,
  setValue,
  currFocus = '',
  setCurrFocus,
  setTimeRange,
}) => {
  const isFocused = useMemo(() => currFocus === name, [currFocus, name]);
  const [isRunning, setIsRunning] = useState(false);

  const focusHandler = () => {
    isFocused ? setCurrFocus('') : setCurrFocus(name);
  };

  const inputHandler = (event) => {
    setValue(parseInt(event.target.value));
  };

  const startHandler = useCallback(() => {
    setTimeRange(value);
    setIsRunning(!isRunning);
  }, [value, setTimeRange, isRunning]);

  return (
    <div className="edit-card" style={isFocused ? styles.focused : {}}>
      <div className="edit-title">{title}</div>
      <div className="edit-body">
        <div id="svg-btn-plus" className="svg-btn" onClick={focusHandler}>
          {isFocused ? <SvgIconMark /> : <SvgIconPlus />}
        </div>
        <div className="time-input">
          <input
            disabled={!isFocused}
            id="time-input-number"
            type="number"
            min="00"
            max="99"
            value={value}
            defaultValue={0}
            onChange={inputHandler}
          ></input>
          <div>m</div>
        </div>
        <button
          className="button-23"
          disabled={!isFocused}
          onClick={startHandler}
        >
          {isRunning ? 'PAUSE' : 'START'}
        </button>
      </div>
    </div>
  );
};

export default EditCard;
