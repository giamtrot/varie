import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import speechUtils from './SpeechUtils';

function ProgramDetail() {
  const { programLink } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const { theme, toggleTheme, isDark, themeName } = useTheme();

  const [isEditingHeadlines, setIsEditingHeadlines] = useState(false);
  const [isEditingKeywords, setIsEditingKeywords] = useState(false);
  const [editedHeadlines, setEditedHeadlines] = useState('');
  const [editedKeywords, setEditedKeywords] = useState('');
  const [saving, setSaving] = useState(false);
  const [currentlySpeaking, setCurrentlySpeaking] = useState(null);
  const [showTTSSettings, setShowTTSSettings] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [ttsSettings, setTtsSettings] = useState(speechUtils.settings);
  const [selectionInfo, setSelectionInfo] = useState({ text: '', x: 0, y: 0, visible: false });

  useEffect(() => {
    // Fetch settings from server
    fetch('/api/tts-settings')
      .then(response => response.json())
      .then(data => {
        setTtsSettings(data);
        speechUtils.setSettings(data);
      })
      .catch(error => console.error('Failed to load TTS settings:', error));

    speechUtils.onStateChange = (speaking) => {
      if (!speaking) setCurrentlySpeaking(null);
    };

    const loadVoices = () => {
      const voices = speechUtils.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => speechUtils.stop();
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection.toString().trim();

        if (text && text.length > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          setSelectionInfo({
            text,
            x: rect.left + (rect.width / 2),
            y: rect.top - 10,
            visible: true
          });
        } else {
          setSelectionInfo(prev => ({ ...prev, visible: false }));
        }
      }, 0);
    };

    const handleMouseDown = (e) => {
      // Don't hide if clicking the bubble itself
      if (e.target.closest('.selection-tts-bubble')) return;
      setSelectionInfo(prev => ({ ...prev, visible: false }));
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleUpdateTTSSetting = (key, value) => {
    const newSettings = { ...ttsSettings, [key]: value };
    setTtsSettings(newSettings);
    speechUtils.updateSettings({ [key]: value });

    // Save to server
    fetch('/api/tts-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    }).catch(error => console.error('Failed to save TTS settings:', error));
  };

  const handleSpeak = (id, text) => {
    if (currentlySpeaking === id) {
      speechUtils.stop();
    } else {
      setCurrentlySpeaking(id);
      speechUtils.speak(text, () => setCurrentlySpeaking(null));
    }
  };

  const handleSpeakSelection = () => {
    if (selectionInfo.text) {
      handleSpeak('selection', selectionInfo.text);
      setSelectionInfo(prev => ({ ...prev, visible: false }));
      // Clear browser selection to avoid confusion
      window.getSelection().removeAllRanges();
    }
  };

  const parsedHeadlines = useMemo(() => {
    if (!program || !program.headlines || program.headlines === 'N/A') return [];
    // Split by newline and filter out empty lines
    const rawLines = program.headlines.split('\n').map(l => l.trim()).filter(l => l !== '');
    const result = [];

    let i = 0;
    while (i < rawLines.length) {
      const currentLine = rawLines[i];
      // Check if this line contains its own source via <br/> or <br>
      if (currentLine.includes('<br/>') || currentLine.includes('<br>')) {
        const parts = currentLine.split(/<br\s*\/?>/i);
        result.push({
          text: parts[0].trim(),
          source: parts[1] ? parts[1].trim() : ''
        });
        i++;
      } else {
        // If it doesn't have <br/>, it might be a headline with the source on the next line
        const nextLine = rawLines[i + 1];
        // If next line exists and doesn't have its own source/looks like a source line
        if (nextLine && !nextLine.includes('<br/>') && !nextLine.includes('<br>')) {
          result.push({
            text: currentLine,
            source: nextLine
          });
          i += 2;
        } else {
          // Just a headline without a clear source line
          result.push({
            text: currentLine,
            source: ''
          });
          i++;
        }
      }
    }
    return result;
  }, [program]);

  const parsedKeywords = useMemo(() => {
    if (!program || !program.keywords || program.keywords === 'N/A') return [];
    // Split by the pattern that marks a new keyword entry
    const entries = program.keywords.split(/\n\t(?=<strong>)/).map(e => e.trim()).filter(e => e !== '');
    return entries;
  }, [program]);

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
          setEditedHeadlines(foundProgram.headlines);
          setEditedKeywords(foundProgram.keywords);
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

  const handleSave = (field) => {
    setSaving(true);
    const body = { link: program.link };
    if (field === 'headlines') body.headlines = editedHeadlines;
    if (field === 'keywords') body.keywords = editedKeywords;

    fetch('/api/update-program', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to update program');
        return response.json();
      })
      .then(() => {
        setProgram(prev => ({ ...prev, ...body }));
        if (field === 'headlines') setIsEditingHeadlines(false);
        if (field === 'keywords') setIsEditingKeywords(false);
        setSaving(false);
      })
      .catch(error => {
        console.error('Update error:', error);
        alert('Failed to save changes.');
        setSaving(false);
      });
  };

  if (loading) return <div className="text-center mt-5">Loading program details...</div>;
  if (error) return <div className="alert alert-danger mt-5" role="alert">Error: {error.message}</div>;
  if (!program) return <div className="alert alert-warning mt-5" role="alert">Program data is not available.</div>;

  return (
    <div className="container mt-4">
      {selectionInfo.visible && (
        <button
          className="selection-tts-bubble"
          style={{
            left: `${selectionInfo.x}px`,
            top: `${selectionInfo.y}px`,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
          onClick={handleSpeakSelection}
        >
          🔊 Speak Selection
        </button>
      )}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button onClick={() => navigate('/')} className="btn btn-gradient btn-gradient-purple">← Back to List</button>
        <div className="d-flex gap-2">
          <button className="btn btn-gradient btn-gradient-purple" onClick={toggleTheme}>
            🎨 Theme: {themeName}
          </button>
          <button
            className={`btn btn-gradient ${showTTSSettings ? 'btn-gradient-blue' : 'btn-gradient-purple'}`}
            onClick={() => setShowTTSSettings(!showTTSSettings)}
            title="Speech Settings"
          >
            ⚙️ Speech Settings
          </button>
          <button
            className={`btn btn-gradient ${isDisabled ? 'btn-gradient-teal' : 'btn-gradient-orange'}`}
            onClick={toggleDisable}
          >
            {isDisabled ? '✅ Enable Program' : '🚫 Disable Program'}
          </button>
          {currentlySpeaking && (
            <button className="btn btn-danger" onClick={() => speechUtils.stop()}>
              ⏹️ Stop Audio
            </button>
          )}
        </div>
      </div>

      {showTTSSettings && (
        <div className="tts-settings-panel">
          <div className="tts-settings-title">
            <span>🔊 Text-to-Speech Settings</span>
            <button className="btn btn-sm btn-outline-light" onClick={() => setShowTTSSettings(false)}>✕</button>
          </div>
          <div className="tts-settings-grid">
            <div className="tts-setting-item">
              <label>Voice</label>
              <select
                value={ttsSettings.voiceURI}
                onChange={(e) => handleUpdateTTSSetting('voiceURI', e.target.value)}
              >
                <option value="">Default Voice</option>
                {availableVoices.map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
            <div className="tts-setting-item">
              <label>Speed: {ttsSettings.rate}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={ttsSettings.rate}
                onChange={(e) => handleUpdateTTSSetting('rate', parseFloat(e.target.value))}
              />
            </div>
            <div className="tts-setting-item">
              <label>Pitch: {ttsSettings.pitch}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={ttsSettings.pitch}
                onChange={(e) => handleUpdateTTSSetting('pitch', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}

      <div className="d-flex align-items-center mb-4">
        <h1 className="mb-0">📺 {program.title}</h1>
        <button
          className={`tts-btn ${currentlySpeaking === 'title' ? 'active' : ''}`}
          onClick={() => handleSpeak('title', program.title)}
          title="Listen to Title"
        >
          {currentlySpeaking === 'title' ? '⏹️' : '🔊'}
        </button>
      </div>
      <div className="vibrant-card vibrant-card-lavender p-3 mb-4">
        <p className="mb-2"><strong>📅 Date:</strong> {program.date}</p>
        <p className="mb-2 d-flex align-items-center">
          <strong>📝 Description:</strong> {program.description}
          <button
            className={`tts-btn ${currentlySpeaking === 'desc' ? 'active' : ''}`}
            onClick={() => handleSpeak('desc', program.description)}
            title="Listen to Description"
          >
            {currentlySpeaking === 'desc' ? '⏹️' : '🔊'}
          </button>
        </p>
        <p className="mb-2"><strong>🔗 Link:</strong> <a href={program.link} target="_blank" rel="noopener noreferrer" className="text-decoration-none">{program.link}</a></p>
        <p className="mb-0"><strong>📄 Full Content:</strong> <a href={program.full_content_link} target="_blank" rel="noopener noreferrer" className="text-decoration-none">{program.full_content_link}</a></p>
      </div>

      <div className="vibrant-card vibrant-card-blue mt-4">
        <div className="card-header-gradient">
          <span>📖 Story</span>
          {program.story !== 'N/A' && (
            <button
              className={`tts-btn ${currentlySpeaking === 'story' ? 'active' : ''}`}
              onClick={() => handleSpeak('story', program.story)}
              title="Listen to Story"
            >
              {currentlySpeaking === 'story' ? '⏹️' : '🔊'}
            </button>
          )}
        </div>
        <div className="card-body">
          {program.story !== 'N/A' ? (
            <div dangerouslySetInnerHTML={{ __html: program.story }}></div>
          ) : (
            <p>No story available.</p>
          )}
        </div>
      </div>

      <div className="vibrant-card vibrant-card-pink mt-4">
        <div className="card-header-gradient d-flex justify-content-between align-items-center">
          <span>📰 Headlines</span>
          {!isEditingHeadlines && (
            <button className="btn btn-sm btn-outline-light" onClick={() => setIsEditingHeadlines(true)}>✏️ Edit</button>
          )}
        </div>
        <div className="card-body">
          {isEditingHeadlines ? (
            <div>
              <textarea
                className="form-control editing-textarea mb-2"
                rows="10"
                value={editedHeadlines}
                onChange={(e) => setEditedHeadlines(e.target.value)}
              />
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-gradient btn-gradient-blue" onClick={() => handleSave('headlines')} disabled={saving}>
                  {saving ? 'Saving...' : '💾 Save'}
                </button>
                <button className="btn btn-sm btn-secondary" onClick={() => { setIsEditingHeadlines(false); setEditedHeadlines(program.headlines); }} disabled={saving}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            parsedHeadlines.length > 0 ? (
              <div>
                {parsedHeadlines.map((h, index) => (
                  <div key={index} className="headline-item d-flex justify-content-between align-items-start">
                    <div dangerouslySetInnerHTML={{ __html: `${h.text}${h.source ? `<br><small class="text-muted">${h.source}</small>` : ''}` }}></div>
                    <button
                      className={`tts-btn ${currentlySpeaking === `headline-${index}` ? 'active' : ''}`}
                      onClick={() => handleSpeak(`headline-${index}`, `${h.text} from ${h.source}`)}
                      title="Listen to Headline"
                    >
                      {currentlySpeaking === `headline-${index}` ? '⏹️' : '🔊'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No headlines available.</p>
            )
          )}
        </div>
      </div>

      <div className="vibrant-card vibrant-card-mint mt-4 mb-5">
        <div className="card-header-gradient d-flex justify-content-between align-items-center">
          <span>🔑 Keywords</span>
          {!isEditingKeywords && (
            <button className="btn btn-sm btn-outline-light" onClick={() => setIsEditingKeywords(true)}>✏️ Edit</button>
          )}
        </div>
        <div className="card-body">
          {isEditingKeywords ? (
            <div>
              <textarea
                className="form-control editing-textarea mb-2"
                rows="15"
                value={editedKeywords}
                onChange={(e) => setEditedKeywords(e.target.value)}
              />
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-gradient btn-gradient-blue" onClick={() => handleSave('keywords')} disabled={saving}>
                  {saving ? 'Saving...' : '💾 Save'}
                </button>
                <button className="btn btn-sm btn-secondary" onClick={() => { setIsEditingKeywords(false); setEditedKeywords(program.keywords); }} disabled={saving}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            parsedKeywords.length > 0 ? (
              <div className="keywords-content">
                {parsedKeywords.map((kw, index) => (
                  <div key={index} className="keyword-entry d-flex justify-content-between align-items-start">
                    <div dangerouslySetInnerHTML={{ __html: kw }}></div>
                    <button
                      className={`tts-btn ${currentlySpeaking === `keyword-${index}` ? 'active' : ''}`}
                      onClick={() => handleSpeak(`keyword-${index}`, kw)}
                      title="Listen to Keyword"
                    >
                      {currentlySpeaking === `keyword-${index}` ? '⏹️' : '🔊'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No keywords available.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgramDetail;
