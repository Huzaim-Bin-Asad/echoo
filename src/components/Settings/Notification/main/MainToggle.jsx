import React from 'react';
import { Form } from 'react-bootstrap';

const MainToggle = () => {
  return (
    <div className="mb-4">
      <Form.Check 
        type="switch"
        id="conversation-tones"
        label="Conversation tones"
      />
      <small className="text-muted d-block mb-3">Play sounds for incoming and outgoing messages.</small>

      <Form.Check 
        type="switch"
        id="reminders"
        label="Reminders"
      />
      <small className="text-muted d-block">Get occasional reminders about messages or status updates you haven't seen.</small>
    </div>
  );
};

export default MainToggle;
