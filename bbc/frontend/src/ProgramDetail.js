import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProgramDetail() {
  const { programLink } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [programLink]);

  if (loading) return <div className="text-center mt-5">Loading program details...</div>;
  if (error) return <div className="alert alert-danger mt-5" role="alert">Error: {error.message}</div>;
  if (!program) return <div className="alert alert-warning mt-5" role="alert">Program data is not available.</div>;

  return (
    <div className="container mt-4">
      <button onClick={() => navigate('/')} className="btn btn-secondary mb-3">Back to List</button>
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
