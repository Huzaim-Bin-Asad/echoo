import React from 'react';

const DisappearingMessages = () => (
  <div className="mb-1 pb-0" style={{ marginTop: '-1.5rem' }}> {/* Decreased padding-bottom and margin-bottom for parent div */}
    <p className="text-secondary mb-1 fs-7 fw-normal" >Disappearing messages</p> {/* Smaller font size */}
    <ul className="list-unstyled">
      <li className="mb-2"> {/* Decreased margin-bottom for list items */}
        <div className="d-flex justify-content-between align-items-center text-white fs-6 fw-medium">
          <span>Default message timer</span>
          <span className="text-secondary fs-7">Off</span> {/* Smaller text for "Off" */}
        </div>
      </li>
    </ul>
    {/* Description below the heading with grey text */}
    <p className="text-secondary fs-7" style={{ marginTop: '.5rem' }}>
      Start new chats with disappearing messages set to your timer.
    </p> {/* Inline style added for adjustable margin-bottom */}
    <hr className="border-light my-1" /> {/* Adjusted margin */}
  </div>
);

export default DisappearingMessages;
