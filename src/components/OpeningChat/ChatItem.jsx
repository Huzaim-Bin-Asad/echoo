import React from 'react';
import { User } from 'lucide-react';

const ChatItem = ({ name, message, time, unread, img }) => {
  const truncateMessage = (message, limit = 30) => {
    return message.length > limit ? message.slice(0, limit) + '...' : message;
  };

  return (
    <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-start border-0 py-3">
      {/* Avatar */}
      <div
        className="me-3 d-flex align-items-center justify-content-center rounded-circle bg-light"
        style={{ width: 50, height: 50 }} // Fixed size for avatar
      >
        {img ? (
          <img
            src={img}
            alt={name}
            className="rounded-circle"
            width="50"
            height="50"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <User size={30} className="text-muted" /> // Fixed icon size
        )}
      </div>

      {/* Text content */}
      <div
        className="d-flex flex-column flex-grow-1"
        style={{
          // Allow the text container to grow but not exceed the available width
          maxWidth: 'calc(100% - 70px)', // Ensures text container doesn't grow beyond available space
          overflow: 'hidden',            // Prevent overflow of the text container
        }}
      >
        <div className="d-flex justify-content-between">
          <strong className="text-truncate fs-6 fs-md-5">{name}</strong>
          <small className="text-muted">{time}</small>
        </div>
        
        <div
          className="text-muted text-truncate fs-6 fs-md-6"
          style={{
            whiteSpace: 'nowrap',        // Prevent the text from wrapping
            overflow: 'hidden',         // Hide overflowed content
            textOverflow: 'ellipsis',   // Add ellipsis for overflowing content
            maxWidth: '100%',           // Ensure the message container does not exceed the available space
            flexShrink: 0,              // Prevent the text container from shrinking
          }}
        >
          {truncateMessage(message, 30)}  {/* Truncate the message after 30 characters */}
        </div>
      </div>

      {/* Unread dot */}
      {unread && (
        <span
          className="bg-success ms-2 rounded-circle"
          style={{ width: 10, height: 10, display: 'inline-block' }}
        ></span>
      )}
    </div>
  );
};

export default ChatItem;
