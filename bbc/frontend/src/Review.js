import React from 'react';
import { useNavigate } from 'react-router-dom';

function Review() {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Review Page</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/')}
        >
          ← Back to Index
        </button>
      </div>
      <p>This is the review page.</p>
    </div>
  );
}

export default Review;
