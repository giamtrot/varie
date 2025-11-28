import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProgramReload from './ProgramReload';

function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReloading, setIsReloading] = useState(false);
  const [reloadLog, setReloadLog] = useState(''); // New state for reload log
  const [showReloadStream, setShowReloadStream] = useState(false);

  const fetchPrograms = useCallback(() => {
    setLoading(true);
    fetch('http://127.0.0.1:5000/api/programs')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Sort programs by date, assuming date is parseable or N/A
        const sortedData = data.sort((a, b) => {
          const dateA = a.date !== 'N/A' ? new Date(a.date) : new Date(0);
          const dateB = b.date !== 'N/A' ? new Date(b.date) : new Date(0);
          return dateB - dateA;
        });
        setPrograms(sortedData);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);
  
  const handleReload = () => {
    // Open the streaming UI which will start the EventSource
    setShowReloadStream(true);
    setIsReloading(true);
    setReloadLog('Opening live reload stream...');
  };

  const handleReloadDone = () => {
    // Called when stream finishes or is stopped

    setShowReloadStream(false);
    setIsReloading(false);
    // Refresh programs after a short delay to allow file write completion
    setTimeout(() => fetchPrograms(), 500);
  };

  if (loading && programs.length === 0) return <div className="text-center mt-5">Loading programs...</div>;
  if (error) return <div className="alert alert-danger mt-5" role="alert">Error: {error.message}</div>;

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>BBC Programs</h1>
        <button className="btn btn-primary" onClick={handleReload} disabled={isReloading}>
          {isReloading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Reloading...
            </>
          ) : (
            'Reload Programs'
          )}
        </button>
      </div>

      {showReloadStream && (
        <ProgramReload onDone={handleReloadDone} />
      )}

      {reloadLog && (
        <div className="card mb-4">
          <div className="card-header">
            Reload Log
          </div>
          <div className="card-body bg-light">
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{reloadLog}</pre>
          </div>
        </div>
      )}

      <div className="list-group">
        {programs.map(program => (
          <Link 
            key={program.link} 
            to={`/program/${encodeURIComponent(program.link)}`} 
            className="list-group-item list-group-item-action flex-column align-items-start"
          >
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{program.title}</h5>
              <small>{program.date}</small>
            </div>
            <p className="mb-1">{program.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProgramList;
