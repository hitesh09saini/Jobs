import './JobBoard.css';
import React from 'react';
import JobBox from './JobBox'

export default function JobBoard() {
  return (
    <div className="cont">
      <h1>Hacker News Jobs Board</h1>
      <JobBox/>
    </div>
  );
}
