import React from 'react';
import SvgIconMinus from './assets/SvgIconPlus';
import SvgIconPlus from './assets/SvgIconMinus';
import './EditCard.css';

const EditCard = ({ title, isFocused, value, setValue }) => {
  const plusHandler = () => {
    setValue(value + 1);
  };
  const minusHandler = () => {
    if (value > 0) setValue(value - 1);
  };
  const inputHandler = (event) => {
    setValue(parseInt(event.target.value));
  };
  return (
    <div className="edit-card">
      <div className="edit-title">{title}</div>
      <div className="edit-body">
        <div id="svg-btn-plus" className="svg-btn" onClick={minusHandler}>
          <SvgIconPlus />
        </div>
        <div className="time-input">
          <input
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
        <div id="svg-btn-minus" className="svg-btn" onClick={plusHandler}>
          <SvgIconMinus />
        </div>
      </div>
    </div>
  );
};

export default EditCard;
