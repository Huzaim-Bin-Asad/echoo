import React from 'react';
import { User } from 'lucide-react';  // Importing User icon

const ContactItem = ({ name, message, visible = false }) => {
  return (
    <div className="d-flex align-items-center px-3 py-2">
      {/* Icon Container with a fixed size */}
      <div
        className="bg-secondary rounded-circle d-flex justify-content-center align-items-center"
        style={{
          width: 50,  // Fixed width for the icon
          height: 50,  // Fixed height for the icon
          overflow: 'hidden',  // Hide overflow
          flexShrink: 0,  // Prevent the icon from shrinking
          flexGrow: 0,  // Prevent the icon from growing
        }}
      >
        <User size={24} color="white" /> {/* Icon size stays constant */}
      </div>

      {/* Text Container */}
      <div className="d-flex flex-column ms-3"> {/* ms-3 adds margin to the left to space out text */}
        <div className="fw-bold">{name}</div>
        {/* Message text aligned below name */}
        {message && <small className="text-white">{message}</small>}
      </div>
    </div>
  );
};

export default ContactItem;
