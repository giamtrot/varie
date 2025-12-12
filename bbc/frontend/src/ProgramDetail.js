import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProgramDetail() {
  const { programLink } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    fetch('/api/programs')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const foundProgram = data.find(p => p.link === decodeURIComponent(programLink));
        if (foundProgram) {
          setProgram(foundProgram);
        } else {
          setError(new Error("Program not found."));
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });

    // Load disabled programs status
    fetch('/api/disabled-programs')
      .then(response => response.json())
      .then(data => {
        const disabled = data.disabled || [];
        setIsDisabled(disabled.includes(decodeURIComponent(programLink)));
      })
      .catch(error => console.error('Failed to load disabled programs:', error));
  }, [programLink]);

  const toggleDisable = () => {
    fetch('/api/disabled-programs')
      .then(response => response.json())
      .then(data => {
        const disabled = new Set(data.disabled || []);
        const decodedLink = decodeURIComponent(programLink);

        if (disabled.has(decodedLink)) {
          disabled.delete(decodedLink);
        } else {
          disabled.add(decodedLink);
        }

        return fetch('/api/disabled-programs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ disabled: Array.from(disabled) })
        });
      })
      .then(() => {
        setIsDisabled(!isDisabled);
      })
      .catch(error => console.error('Failed to toggle disabled status:', error));
  };

  if (loading) return <div className="text-center mt-5">Loading program details...</div>;
  if (error) return <div className="alert alert-danger mt-5" role="alert">Error: {error.message}</div>;
  if (!program) return <div className="alert alert-warning mt-5" role="alert">Program data is not available.</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button onClick={() => navigate('/')} className="btn btn-secondary">Back to List</button>
        <button
          className={`btn ${isDisabled ? 'btn-outline-success' : 'btn-outline-danger'}`}
          onClick={toggleDisable}
        >
          {isDisabled ? 'Enable Program' : 'Disable Program'}
        </button>
      </div>
      <h1 className="mb-4">{program.title}</h1>
      <p><strong>Date:</strong> {program.date}</p>
      <p><strong>Description:</strong> {program.description}</p>
      <p><strong>Link:</strong> <a href={program.link} target="_blank" rel="noopener noreferrer">{program.link}</a></p>
      <p><strong>Full Content Link:</strong> <a href={program.full_content_link} target="_blank" rel="noopener noreferrer">{program.full_content_link}</a></p>

      <div className="card mt-4">
        <div className="card-header">
          Story
        </div>
        <div className="card-body">
          {program.story !== 'N/A' ? (
            <div dangerouslySetInnerHTML={{ __html: program.story }}></div>
          ) : (
            <p>No story available.</p>
          )}
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          Headlines
        </div>
        <div className="card-body">
          {program.headlines !== 'N/A' ? (
            <div dangerouslySetInnerHTML={{ __html: program.headlines.replace(/\n\s\s/g, '<br>&nbsp;&nbsp;') }}></div>
          ) : (
            <p>No headlines available.</p>
          )}
        </div>
      </div>

      <div className="card mt-4 mb-5">
        <div className="card-header">
          Keywords
        </div>
        <div className="card-body">
          {program.keywords !== 'N/A' ? (
            <div dangerouslySetInnerHTML={{ __html: program.keywords.replace(/\n\s\s\t/g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\n\s\s/g, '<br>&nbsp;&nbsp;') }}></div>
          ) : (
            <p>No keywords available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgramDetail;
