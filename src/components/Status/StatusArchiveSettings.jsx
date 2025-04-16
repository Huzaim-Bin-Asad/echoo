import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Download } from 'lucide-react';

const StatusArchiveSettings = ({ handleBackClick }) => {
  const [translateY, setTranslateY] = useState(1000);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(null);
  const [saveStatus, setSaveStatus] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setTranslateY(0);
    });
  }, []);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const deltaY = e.touches[0].clientY - startY.current;
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (translateY > 120) {
      setTranslateY(1000);
      setTimeout(() => handleBackClick(), 300);
    } else {
      setTranslateY(0);
    }
  };

  return (
    <div
      className="status-archive-settings d-block d-md-none"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '35vh', // smaller popup height
        backgroundColor: '#121212',
        color: 'white',
        zIndex: 2000,
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.4)',
        transform: `translateY(${translateY}px)`,
        transition: isDragging ? 'none' : 'transform 0.45s ease',
        touchAction: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dash Handle */}
      <div className="d-flex justify-content-center pt-2">
        <div
          style={{
            width: '40px',
            height: '5px',
            backgroundColor: '#888',
            borderRadius: '3px',
          }}
        />
      </div>

      {/* Header + Description */}
      <div className="px-4 mt-3 flex-grow-1">
        <h5 className="mb-2 fw-semibold">Status Archive Settings</h5>
        <p className="text-secondary mb-4" style={{ fontSize: '0.95rem' }}>
          Updates will be kept on your device for up to 30 days. Only you can see your archived updates.
        </p>

        {/* Save Option */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center">
            <Download size={22} className="me-3 text-secondary" />
            <span className="text-white fs-6">Save Status Update</span>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="saveStatusToggle"
              checked={saveStatus}
              onChange={() => setSaveStatus(prev => !prev)}
              style={{
                width: '50px',
                height: '28px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Done Button fixed to bottom */}
      <div className="px-4 pb-3">
        <button
          className="btn btn-success w-100"
          style={{
            borderRadius: '999px', // oval
            fontSize: '1rem',
            padding: '10px 0',
          }}
          onClick={() => {
            setTranslateY(1000);
            setTimeout(() => handleBackClick(), 300);
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default StatusArchiveSettings;
