import React from 'react';
import './priority.css';

const PrioritySwitcher = ({ priority, setPriority, handleClick }) => (
    <div className="priority-wrapper">
        <h2 style={{ textAlign: 'left' }}>Set Tab Priority</h2>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row', width: '100%' }}>
            <button
                className={`circle-button low ${priority === 'low' ? 'selected' : ''}`}
                onClick={() => {
                    setPriority("low");
                    handleClick("low");
                }}
            >
                Low
            </button>
            <button
                className={`circle-button medium ${priority === 'medium' ? 'selected' : ''}`}
                onClick={() => {
                    setPriority("medium");
                    handleClick("medium");
                }}
            >
                Med
            </button>
            <button
                className={`circle-button high ${priority === 'high' ? 'selected' : ''}`}
                onClick={() => {
                    setPriority("high");
                    handleClick("high");
                }}
            >
                High
            </button>
        </div>
    </div>
);

export default PrioritySwitcher;
