import React from 'react';

const DisappearingMessages = () => (
  <div className="mb-4">
    <p className="text-muted mb-1">Disappearing messages</p>
    <div className="list-group">
      <div className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between">
        <span>Default message timer</span>
        <span className="text-muted">Off</span>
      </div>
    </div>
  </div>
);

export default DisappearingMessages;
