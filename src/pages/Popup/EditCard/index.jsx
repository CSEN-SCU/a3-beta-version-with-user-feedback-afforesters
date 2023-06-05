import React, { useCallback, useMemo } from 'react';
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
  isRunning,
  setIsRunning,
}) => {
  const isFocused = useMemo(() => currFocus === name, [currFocus, name]);

  const focusHandler = () => {
    isFocused ? setCurrFocus('') : setCurrFocus(name);
  };

  const inputHandler = (event) => {
    setValue(parseInt(event.target.value));
  };

  const startHandler = useCallback(() => {
    setTimeRange(value);
    setIsRunning(!isRunning);
  }, [setTimeRange, value, setIsRunning, isRunning]);

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
          <p>m</p>
        </div>
        <button
          className="button-23"
          disabled={!isFocused}
          onClick={startHandler}
        >
          {isRunning ? 'RESTART' : 'START'}
        </button>
      </div>
    </div>
  );
};

export default EditCard;
