import React from 'react';

const MessagesNoti = () => {
  return (
    <div className="mb-4 mt-4 border-bottom border-secondary-subtle pb-3">
      <div className="ps-3">

        {/* Secondary Note */}
        <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
          Messages
        </p>

        {/* Notification Tone Section */}
        <div className="d-flex justify-content-between align-items-start mb-4 ms-0">
          <div>
            <p className="mb-1 fs-6" style={{ marginRight: '30px' }}>Notification tone</p>
          </div>
      
        </div>

        {/* Vibrate Section */}
        <div className="d-flex justify-content-between align-items-start mb-4 ms-0">
          <div>
            <p className="mb-1 fs-6" style={{ marginRight: '30px' }}>Vibrate</p>
            <small className="text-secondary" style={{ fontSize: '0.75rem', marginRight: '30px' }}>Default</small>
          </div>
        
        </div>

        {/* Light Section */}
        <div className="d-flex justify-content-between align-items-start mb-4 ms-0">
          <div>
            <p className="mb-1 fs-6" style={{ marginRight: '30px' }}>Light</p>
            <small className="text-secondary" style={{ fontSize: '0.75rem', marginRight: '30px' }}>White</small>
          </div>
      
        </div>

        {/* High Priority Notifications Section */}
        <div className="d-flex justify-content-between align-items-start mb-4 ms-0">
          <div>
            <p className="mb-1 fs-6" style={{ marginRight: '30px' }}>Use high priority notifications</p>
            <small className="text-secondary" style={{ fontSize: '0.75rem', marginRight: '30px' }}>
              Show previews of notifications at the top of the screen
            </small>
          </div>
          <div
            className="form-check form-switch"
            style={{
              transform: 'scale(1.6)',
              marginRight: '20px',
              marginTop: '12px',
            }}
          >
            <input className="form-check-input" type="checkbox" />
          </div>
        </div>

        {/* Reaction Notifications Section */}
        <div className="d-flex justify-content-between align-items-start mb-2 ms-0">
          <div>
            <p className="mb-1 fs-6" style={{ marginRight: '30px' }}>Reaction notifications</p>
            <small className="text-secondary" style={{ fontSize: '0.75rem', marginRight: '30px' }}>
              Show notifications for reactions to messages you send
            </small>
          </div>
          <div
            className="form-check form-switch"
            style={{
              transform: 'scale(1.6)',
              marginRight: '20px',
              marginTop: '20px',
            }}
          >
            <input className="form-check-input" type="checkbox" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default MessagesNoti;
