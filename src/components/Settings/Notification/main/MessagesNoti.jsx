import React from 'react';
import { Form } from 'react-bootstrap';

const MessagesNoti = () => {
  return (
    <div className="mb-4">
      <h6 className="text-uppercase text-muted">Messages</h6>
      <div className="mb-3">
        <strong>Notification tone</strong>
      </div>
      <div className="mb-3">
        <strong>Vibrate</strong>
        <div className="text-muted">Default</div>
      </div>
      <div className="mb-3 text-muted">
        Popup notification<br />
        <small className="d-block">Not available</small>
      </div>
      <div className="mb-3">
        <strong>Light</strong>
        <div className="text-muted">White</div>
      </div>
      <Form.Check 
        type="switch"
        id="high-priority"
        label="Use high priority notifications"
      />
      <small className="text-muted d-block mb-3">
        Show previews of notifications at the top of the screen
      </small>
      <Form.Check 
        type="switch"
        id="reaction-notifications"
        label="Reaction notifications"
      />
      <small className="text-muted d-block">
        Show notifications for reactions to messages you send
      </small>
    </div>
  );
};

export default MessagesNoti;
