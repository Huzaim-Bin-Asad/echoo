// components/QRquickLink/QRResetModal.jsx
import React from 'react';

const QRResetModal = ({ onClose, onGenerateNew }) => {
  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="resetModalLabel"
      aria-hidden="true"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay effect
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1050,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="modal-content">
          <div className="modal-body">
            <div className="d-flex flex-column align-items-start">
              <h5 className="mb-2">Reset QR Code?</h5>
              <p className="mb-0">
                Generate a new Short Link and QR Code. Your existing short link and QR code will no longer work.
              </p>
            </div>
          </div>
          <div className="modal-footer justify-content-end border-0">
            <span
              className="text-primary me-3"
              style={{ cursor: 'pointer' }}
              onClick={onClose}
            >
              Keep
            </span>
            <span
              className="text-danger"
              style={{ cursor: 'pointer' }}
              onClick={onGenerateNew}
            >
              Reset
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRResetModal;
