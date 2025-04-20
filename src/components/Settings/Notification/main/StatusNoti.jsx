import React from 'react';

const StatusNoti = () => {
  return (
    <div className="mb-4 mt-4">
      {/* Section Heading */}
      <p className="fw-semibold text-secondary mb-4" style={{ marginLeft: '20px' }}>
        Status
      </p>

      {/* Reactions Toggle Section */}
      <div className="d-flex justify-content-between align-items-start" style={{ marginLeft: '20px' }}>
        <div>
          <p className="mb-1 fs-6" style={{ marginRight: '30px' }}>Reactions</p>
          <small className="text-secondary" style={{ fontSize: '0.75rem' }}>
            Show a notification when someone likes your status update.
          </small>
        </div>
        <div
          className="form-check form-switch"
          style={{
            transform: 'scale(1.6)',
            marginRight: '10px',
            marginTop: '0px',
          }}
        >
          <input className="form-check-input" type="checkbox" />
        </div>
      </div>
    </div>
  );
};

export default StatusNoti;
