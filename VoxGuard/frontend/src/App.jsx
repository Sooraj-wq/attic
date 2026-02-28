/**
 * VoxGuard Main Dashboard
 * Tactical Intelligence Interface
 */

import { useState, useEffect, useRef } from 'react';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import SOSBeacon from './components/SOSBeacon';
import { API_ENDPOINTS } from './config';

function App() {
  const { isRecording, audioBlob, startRecording, stopRecording } = useAudioRecorder();
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [systemStatus, setSystemStatus] = useState('OFFLINE');

  // Check backend health on mount
  useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.HEALTH);
      const data = await response.json();
      if (data.status === 'ONLINE') {
        setSystemStatus('ONLINE');
        addLog('System initialized successfully');
      }
    } catch (error) {
      setSystemStatus('OFFLINE');
      addLog('Warning: Backend connection failed');
    }
  };

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`].slice(-10));
  };

  const handlePushToTalk = () => {
    if (isRecording) {
      stopRecording();
      addLog('Recording stopped - Processing audio');
    } else {
      startRecording();
      addLog('Recording started - Speak now');
      setResult(null);
    }
  };

  // Auto-submit when recording stops
  useEffect(() => {
    if (audioBlob && !isRecording) {
      submitAudio(audioBlob);
    }
  }, [audioBlob, isRecording]);

  const submitAudio = async (audioSource) => {
    const source = audioSource || audioBlob;
    if (!source) return;

    setIsProcessing(true);
    addLog('Transmitting audio to AI engine');

    try {
      // Convert blob to WAV format for backend
      const formData = new FormData();
      const filename = source.name || 'recording.wav';
      formData.append('audio', source, filename);

      const response = await fetch(API_ENDPOINTS.ANALYZE, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

      if (data.status === 'error') {
        addLog(`Error: ${data.message || 'Unknown error from AI engine'}`);
        return;
      }

      addLog(`Analysis complete - Threat level: ${data.threat_level}`);

    } catch (error) {
      console.error('[SUBMIT ERROR]', error);
      addLog(`Error: ${error.message}`);
      alert('Analysis failed. Check backend connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        addLog(`File dropped: ${file.name}`);
        submitAudio(file);
      } else {
        addLog('Error: Please drop an audio file only');
      }
    }
  };

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('audio/')) {
        addLog(`File selected: ${file.name}`);
        submitAudio(file);
      } else {
        addLog('Error: Please select an audio file only');
      }
    }
  };

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <span>VoxGuard</span>
        </div>
        <div className="system-status">
            <span>System Status:</span>
            <span className={`status-dot ${systemStatus === 'ONLINE' ? 'online' : 'offline'}`}></span>
            <span>{systemStatus}</span>
        </div>
      </header>

      <main className="main-content">
        
        <div className="action-grid">
            {/* Primary Input Card */}
            <div className="card">
                <button 
                    className={`btn ${isRecording ? 'btn-recording' : 'btn-primary'}`}
                    onClick={handlePushToTalk}
                    disabled={isProcessing}
                >
                    {isRecording ? 'Stop Recording' : (isProcessing ? 'Processing Audio...' : 'Start Recording')}
                </button>
                
                <div 
                    className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleZoneClick}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        accept="audio/*" 
                        style={{ display: 'none' }} 
                    />
                    <p>{isDragging ? 'Drop file now' : 'Drag & drop audio file or click to upload'}</p>
                </div>
            </div>

            {/* Secondary Actions */}
            <div className="card sos-button-wrapper">
                 <SOSBeacon />
            </div>
        </div>

        {/* Results */}
        {result && (
          <div className="result-card">
            <div className="result-header">
                <h3>Analysis Result</h3>
                <span className={`threat-badge ${result.threat_level?.toLowerCase() || 'low'}`}>
                    {result.threat_level || 'UNKNOWN'}
                </span>
            </div>
            
            {result.status === 'error' ? (
                <div className="result-body">
                    <p className="result-text" style={{color: 'var(--danger-color)'}}>
                        {result.message || 'Error processing audio.'}
                    </p>
                </div>
            ) : (
                <div className="result-body">
                    <div className="result-section">
                        <h3>Original Audio (Transcribed)</h3>
                        <p className="result-text">{result.original_text}</p>
                    </div>
                    
                    <div className="result-section">
                        <h3>English Translation</h3>
                        <p className="result-text">{result.translated_text}</p>
                    </div>

                    {result.entities && result.entities.length > 0 && (
                        <div className="result-section">
                            <h3>Detected Entities</h3>
                            <div className="entity-tags">
                                {result.entities.map((ent, i) => (
                                    <span key={i} className="entity-tag">{ent}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
          </div>
        )}

        {/* Minimal Logs */}
        <div className="logs-container">
            <div className="logs-header">System Logs</div>
            <div className="log-list">
                {[...logs].reverse().map((log, index) => (
                    <div key={index} className="log-entry">{log}</div>
                ))}
            </div>
        </div>

      </main>
    </div>
  );
}

export default App;

