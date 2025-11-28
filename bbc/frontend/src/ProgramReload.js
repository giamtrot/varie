import React, { useEffect, useRef, useState } from 'react';

function ProgramReload({ onDone }) {
  const [logLines, setLogLines] = useState([]);
  const [running, setRunning] = useState(true);
  const esRef = useRef(null);

  useEffect(() => {
    // Start EventSource on mount
    const es = new EventSource('/api/reload-programs-stream');
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const line = JSON.parse(e.data);
        setLogLines(prev => [...prev, line]);
      } catch (_) {
        setLogLines(prev => [...prev, e.data]);
      }
    };

    es.addEventListener('done', (e) => {
      setLogLines(prev => [...prev, `--- PROCESS EXIT ${e.data} ---`]);
      setRunning(false);
      es.close();
      if (onDone) onDone();
    });

    es.onerror = (err) => {
      setLogLines(prev => [...prev, `SSE error: ${err?.message || err}`]);
      setRunning(false);
      try { es.close(); } catch (_) {}
      if (onDone) onDone();
    };

    return () => {
      try {
        if (es && es.readyState !== EventSource.CLOSED) es.close();
      } catch (_) {}
    };
  }, [onDone]);

  const handleStop = () => {
    const es = esRef.current;
    try { if (es) es.close(); } catch (_) {}
    setRunning(false);
    if (onDone) onDone();
  };

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Live Reload Stream</span>
        <div>
          {running ? (
            <button className="btn btn-sm btn-danger" onClick={handleStop}>Stop</button>
          ) : (
            <button className="btn btn-sm btn-secondary" disabled>Stopped</button>
          )}
        </div>
      </div>
      <div className="card-body bg-dark text-light" style={{ maxHeight: '300px', overflow: 'auto' }}>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {logLines.length === 0 ? 'Waiting for output...' : logLines.join('\n')}
        </pre>
      </div>
    </div>
  );
}

export default ProgramReload;
