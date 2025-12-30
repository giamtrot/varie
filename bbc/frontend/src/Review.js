import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';

function Review() {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toggleTheme, themeName } = useTheme();

  useEffect(() => {
    loadRandomKeywords();
  }, []);

  const loadRandomKeywords = () => {
    setLoading(true);
    setError(null);

    fetch('/api/review-keywords')
      .then(response => response.json())
      .then(data => {
        if (data.keywords) {
          setKeywords(data.keywords);
        } else if (data.message) {
          setError(data.message);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load keywords:', error);
        setError('Failed to load keywords');
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>✨ Review Keywords</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-gradient btn-gradient-purple" onClick={toggleTheme}>
            🎨 Theme: {themeName}
          </button>
          <button
            className="btn btn-gradient btn-gradient-blue"
            onClick={loadRandomKeywords}
          >
            🔄 Get New Keywords
          </button>
          <button
            className="btn btn-gradient btn-gradient-purple"
            onClick={() => navigate('/')}
          >
            ← Back to Index
          </button>
        </div>
      </div>

      {error ? (
        <div className="alert alert-warning">
          {error}
        </div>
      ) : keywords.length === 0 ? (
        <div className="alert alert-warning">
          No keywords available from disabled programs. Please disable some programs first.
        </div>
      ) : (
        <div>
          <div className="alert alert-info mb-4">
            💡 Here are 3 randomly selected keywords from disabled programs for review.
          </div>

          <div className="row">
            {keywords.map((keyword, index) => {
              // Cycle through different card colors
              const cardColors = ['vibrant-card-blue', 'vibrant-card-pink', 'vibrant-card-mint'];
              const cardColor = cardColors[index % cardColors.length];

              return (
                <div key={index} className="col-md-12 mb-4">
                  <div className={`vibrant-card ${cardColor}`}>
                    <div className="card-header-gradient">
                      <div className="d-flex align-items-center">
                        <span className="badge-number me-3">{index + 1}</span>
                        <h5 className="mb-0 text-white">🔑 {keyword.text}</h5>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <h6 className="text-muted">📖 Definition:</h6>
                        <p className="mb-0">{keyword.explanation}</p>
                      </div>
                      {keyword.example && (
                        <div className="mb-3">
                          <h6 className="text-muted">💬 Example:</h6>
                          <p className="mb-0 fst-italic">"{keyword.example}"</p>
                        </div>
                      )}
                      <div>
                        <small className="text-muted">
                          <strong>📺 Source:</strong> {keyword.programTitle}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Review;
