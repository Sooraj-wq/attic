/**
 * VoxGuard SOS Beacon Component
 * Emergency Distress Signal System
 */

import { useState, useRef } from 'react';
import { API_ENDPOINTS } from '../config';

const SOSBeacon = () => {
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef(null);

  const activateSOS = async () => {
    setIsActive(true);

    // Play emergency siren sound (looping)
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(err => {
        console.error('[SOS] Audio playback failed:', err);
      });
    }

    // Send SOS alert to backend
    try {
      const response = await fetch(API_ENDPOINTS.SOS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source: 'VoxGuard Mobile Unit',
          location: 'Field Position',
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      console.log('[SOS] Alert acknowledged:', data);
    } catch (error) {
      console.error('[SOS ERROR]', error);
    }
  };

  const deactivateSOS = () => {
    setIsActive(false);

    // Stop siren sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '1rem', width: '100%', height: '100%' }}>
      {!isActive ? (
        <button 
          className="btn btn-sos"
          onClick={activateSOS}
        >
          SOS BEACON
        </button>
      ) : (
        <>
          <div className="distress-warning">
            BROADCASTING DISTRESS SIGNAL
          </div>
          <button 
            className="btn btn-primary"
            onClick={deactivateSOS}
            style={{ background: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
          >
            CANCEL ALERT
          </button>
        </>
      )}

      {/* Emergency Siren Audio (Hidden) */}
      <audio ref={audioRef}>
        {/* Placeholder: Add actual siren.mp3 file to public/ folder */}
        {/* <source src="/siren.mp3" type="audio/mpeg" /> */}
        {/* For demo, using a data URL for a simple beep tone */}
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dyvm" type="audio/wav" />
      </audio>
    </div>
  );
};

export default SOSBeacon;
