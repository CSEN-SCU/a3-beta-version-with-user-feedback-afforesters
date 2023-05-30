import React from 'react';
import './Timer.css';

const styles = {
  red: {
    color: `#E84B4B`,
  },
  yellow: {
    color: `rgba(238, 229, 15, 1)`,
  },
  body: {
    height: '70px',
  },
};

const Timer = ({ time, timeRange, timeIsUp, type = 'max' }) => {
  return (
    <div style={styles.body}>
      {timeRange === 0 ? (
        <p>No Limits Set</p>
      ) : (
        <h1 style={timeIsUp ? styles.red : styles.yellow}>
          {time}m/{timeRange}m
        </h1>
      )}
      {timeRange && !timeIsUp && <p>Running...</p>}
      {timeIsUp && type === 'max' && <p>Maximum daily time limit reached</p>}
      {timeIsUp && type === 'min' && <p>Minimum daily time reached</p>}
    </div>
  );
};

export default Timer;
