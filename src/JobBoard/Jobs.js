import './JobBoard.css';
import React from 'react';

export default function Jobs({ key, title, by, time, url }) {
  return (
    <div className="jobs" key={key}>
      <a href={url} target="_blank">
        <div className="title">{title}</div>
      </a>
      <div className="BY-time">
        <span>By {by}</span> - <span>{time}</span>
      </div>
    </div>
  );
}
