import React from 'react';

const CallsNoti = () => {
  return (
    <div className="mb-4 mt-4 border-bottom border-secondary-subtle pb-3">
      {/* Section Label */}
      <p className="fw-semibold text-secondary mb-4" style={{ marginLeft: '20px' }}>
        Calls
      </p>

      {/* Ringtone Section */}
      <div className="d-flex justify-content-between align-items-start mb-4" style={{ marginLeft: '20px' }}>
        <div>
          <p className="mb-1 fs-6" style={{ marginRight: '30px' }}>Ringtone</p>
          <small className="text-secondary" style={{ fontSize: '0.75rem' }}>
            Default ringtone
          </small>
        </div>
        <div style={{ marginRight: '20px' }}>{/* Empty for layout symmetry */}</div>
      </div>

      {/* Vibrate Section */}
      <div className="d-flex justify-content-between align-items-start" style={{ marginLeft: '20px' }}>
        <div>
          <p className="mb-1 fs-6" style={{ marginRight: '30px' }}>Vibrate</p>
          <small className="text-secondary" style={{ fontSize: '0.75rem' }}>
            Default
          </small>
        </div>
        <div style={{ marginRight: '20px' }}>{/* Empty for layout symmetry */}</div>
      </div>
    </div>
  );
};

export default CallsNoti;
