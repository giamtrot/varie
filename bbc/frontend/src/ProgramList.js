import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/programs')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setPrograms(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-5">Loading programs...</div>;
  if (error) return <div className="alert alert-danger mt-5" role="alert">Error: {error.message}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">BBC Programs</h1>
      <div className="list-group">
        {programs.map(program => (
          <Link 
            key={program.link} 
            to={`/program/${encodeURIComponent(program.link)}`} 
            className="list-group-item list-group-item-action flex-column align-items-start"
          >
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{program.title}</h5>
            </div>
            <p className="mb-1">{program.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProgramList;
