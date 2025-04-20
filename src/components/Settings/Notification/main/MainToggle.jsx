import React from 'react';

const MainToggle = () => {
  return (
    <div className="mb-4 mt-4 border-bottom border-secondary-subtle pb-3">
      <div className="ps-3">
        {/* Conversation Tones Section */}
        <div className="d-flex justify-content-between align-items-start mb-4 ms-0">
          <div>
            <p className="mb-1 fs-6" style={{ marginRight: '30px' }}>Conversation tones</p>
            <small
              className="text-secondary"
              style={{ fontSize: '0.75rem', marginRight: '30px' }}
            >
              Play sounds for incoming and outgoing messages.
            </small>
          </div>
          <div
            className="form-check form-switch"
            style={{
              transform: 'scale(1.4)',
              marginRight: '5px',
              marginTop: '25px',
            }}
          >
            <input className="form-check-input" type="checkbox" />
          </div>
        </div>

        {/* Reminders Section */}
        <div className="d-flex justify-content-between align-items-start mb-4 ms-0">
          <div>
            <p className="mb-1 fs-6" style={{ marginRight: '30px' }}>Reminders</p>
            <small
              className="text-secondary"
              style={{ fontSize: '0.75rem', marginRight: '30px' }}
            >
              Get occasional reminders about messages or status updates you haven't seen.
            </small>
          </div>
          <div
            className="form-check form-switch"
            style={{
              transform: 'scale(1.4)',
              marginRight: '5px',
              marginTop: '25px',
            }}
          >
            <input className="form-check-input" type="checkbox" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainToggle;
