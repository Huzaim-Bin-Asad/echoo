// components/QRquickLink/QRScan.jsx
import React from 'react';

const QRScan = () => {
  return (
    <div className="text-center position-relative">
      {/* Simulate dark camera background */}
      <div className="bg-dark position-relative rounded" style={{ height: 360 }}>
        <div
          className="position-absolute border border-light"
          style={{
            width: 220,
            height: 220,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: 8,
          }}
        />
      </div>
      <p className="text-muted mt-3">Scan a WhatsApp QR code</p>

      {/* Simulate bottom icons */}
      <div className="d-flex justify-content-between mt-4 px-4 text-light">
        <i className="bi bi-image fs-3"></i>
        <i className="bi bi-camera-video-off fs-3"></i>
      </div>
    </div>
  );
};

export default QRScan;
