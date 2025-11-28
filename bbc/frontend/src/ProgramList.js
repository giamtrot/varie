import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReloading, setIsReloading] = useState(false);

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
    setIsReloading(true);
    fetch('http://127.0.0.1:5000/api/reload-programs', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(`Error reloading programs: ${data.error}\n\nOutput:\n${data.output}`);
        } else {
          alert(`Reload complete!\n\n--- Script Output ---\n${data.output}`);
        }
        setIsReloading(false);
        fetchPrograms(); // Refresh the list after reload
      })
      .catch(error => {
        alert(`An error occurred while communicating with the server: ${error.message}`);
        setIsReloading(false);
      });
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
