import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProgramReload from './ProgramReload';

function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReloading, setIsReloading] = useState(false);
  const [showReloadStream, setShowReloadStream] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [disabledPrograms, setDisabledPrograms] = useState(new Set());
  const [showDisabled, setShowDisabled] = useState(false);
  const navigate = useNavigate();

  const fetchPrograms = useCallback(() => {
    setLoading(true);
    fetch('/api/programs')
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
    // Load disabled programs from server
    fetch('/api/disabled-programs')
      .then(response => response.json())
      .then(data => {
        const disabled = new Set(data.disabled || []);
        setDisabledPrograms(disabled);
      })
      .catch(error => console.error('Failed to load disabled programs:', error));
  }, [fetchPrograms]);

  const handleReload = () => {
    // Open the streaming UI which will start the EventSource
    setShowReloadStream(true);
    setIsReloading(true);
    setReloadKey(prev => prev + 1);
  };

  const handleReloadDone = () => {
    // Called when stream finishes or is stopped
    // Keep the stream visible; just refresh the programs list
    setIsReloading(false);
    // Refresh programs after a short delay to allow file write completion
    setTimeout(() => fetchPrograms(), 500);
  };

  const toggleDisable = (e, programLink) => {
    e.preventDefault();
    e.stopPropagation();
    setDisabledPrograms(prev => {
      const updated = new Set(prev);
      if (updated.has(programLink)) {
        updated.delete(programLink);
      } else {
        updated.add(programLink);
      }
      // Save to server
      fetch('/api/disabled-programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disabled: Array.from(updated) })
      })
        .catch(error => console.error('Failed to save disabled programs:', error));

      return updated;
    });
  };

  if (loading && programs.length === 0) return <div className="text-center mt-5">Loading programs...</div>;
  if (error) return <div className="alert alert-danger mt-5" role="alert">Error: {error.message}</div>;

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>🎬 BBC Programs</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-gradient btn-gradient-purple" onClick={() => setShowDisabled(!showDisabled)}>
            {showDisabled ? '👁️ Hide Disabled' : '👁️ Show Disabled'}
          </button>
          <button className="btn btn-gradient btn-gradient-blue" onClick={handleReload} disabled={isReloading}>
            {isReloading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                🔄 Reloading...
              </>
            ) : (
              '🔄 Reload Programs'
            )}
          </button>
          <Link to="/review" className="btn btn-gradient btn-gradient-pink">✨ Review</Link>
          {showReloadStream && (!isReloading) && (<button className="btn btn-gradient btn-gradient-teal" onClick={() => setShowReloadStream(false)}>
            📋 Hide Log
          </button>)}
        </div>
      </div>

      {showReloadStream && (
        <div className="reload-stream-box">
          <ProgramReload key={reloadKey} onDone={handleReloadDone} />
        </div>
      )}

      <div className="list-group">
        {programs
          .filter(program => showDisabled || !disabledPrograms.has(program.link))
          .map(program => {
            const isDisabled = disabledPrograms.has(program.link);
            const handleClick = () => {
              if (!isDisabled) {
                navigate(`/program/${encodeURIComponent(program.link)}`);
              }
            };
            return (
              <div
                key={program.link}
                onClick={handleClick}
                className={`program-list-item list-group-item list-group-item-action flex-column align-items-start`}
                style={!isDisabled ? { cursor: 'pointer' } : {}}
              >
                <div className="d-flex w-100 justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h5 className="mb-1">📺 {program.title}</h5>
                    <p className="mb-1 text-secondary">{program.description}</p>
                  </div>
                  <div className="ms-2 d-flex gap-2 align-items-center">
                    <small className="text-muted">📅 {program.date}</small>
                    <button
                      className={`btn btn-sm btn-gradient ${isDisabled ? 'btn-gradient-teal' : 'btn-gradient-orange'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDisable(e, program.link);
                      }}
                    >
                      {isDisabled ? '✅ Enable' : '🚫 Disable'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ProgramList;
