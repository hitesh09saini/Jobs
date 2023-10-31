import Jobs from './Jobs';
import React, { useState, useEffect } from 'react';

export default function JobBox() {
  const [jobStories, setJobStories] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [jobDetailsArray, setJobDetailsArray] = useState([]); // Added state for job details

  const storiesPerPage = 10;

  const fetchJobStories = () => {
    setIsLoading(true);
    const apiUrl = `https://hacker-news.firebaseio.com/v0/jobstories.json`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const start = (prevPageNumber) => (prevPageNumber - 1) * storiesPerPage;
        const end = start(pageNumber) + storiesPerPage;

        const pageStories = data.slice(start(pageNumber), end);

        const moreToLoad = end < data.length;

        setJobStories([...jobStories, ...pageStories]);
        setIsLoading(false);

        if (moreToLoad) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  };

  const fetchJobDetails = async (jobId) => {
    try {
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${jobId}.json`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching job details:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchJobStories();
  }, []);

  useEffect(() => {
    const promises = jobStories.map((storyId) => fetchJobDetails(storyId));

    Promise.all(promises).then((results) => {
      setJobDetailsArray(results);
    });
  }, [jobStories]);

  return (
    <div>
      {jobDetailsArray.map((jobDetails, index) => {
        if (jobDetails) {
          return (
            <Jobs
              key={jobStories[index]}
              title={jobDetails.title}
              by={jobDetails.by}
              url={jobDetails.url}
              time={new Date(jobDetails.time * 1000).toLocaleString()}
            />
          );
        } else {
          return <p key={jobStories[index]}>Error fetching job story data.</p>;
        }
      })}

      {isLoading && <p>Loading...</p>}
      {pageNumber === 1 && jobStories.length === 0 && !isLoading && (
        <p>No job stories to display.</p>
      )}
      {!isLoading && jobStories.length > 0 && (
        <button className="btn" onClick={fetchJobStories} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load More Jobs'}
        </button>
      )}
    </div>
  );
}
