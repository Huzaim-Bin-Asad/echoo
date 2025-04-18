import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
const ChatItem = ({ name, message, time, unread, img }) => {
  const [truncateLimit, setTruncateLimit] = useState(30);

  useEffect(() => {
    const updateLimit = () => {
      const width = window.innerWidth;
      if (width < 400) setTruncateLimit(20);
      else if (width < 576) setTruncateLimit(30);
      else if (width < 768) setTruncateLimit(45);
      else if (width < 992) setTruncateLimit(60);
      else setTruncateLimit(80);
    };

    updateLimit();
    window.addEventListener('resize', updateLimit);
    return () => window.removeEventListener('resize', updateLimit);
  }, []);

  const truncateMessage = (msg, limit) =>
    msg.length > limit ? msg.slice(0, limit) + '...' : msg;

 
  return (
    <div
    className="list-group-item list-group-item-action d-flex justify-content-between align-items-start border-0 py-3"
    onClick={() => window.showChat()}
    style={{ cursor: "pointer" }}
  >
  
      {/* Avatar */}
      <div
        className="me-3 d-flex align-items-center justify-content-center rounded-circle bg-light"
        style={{ width: 50, height: 50 }}
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
          <User size={30} className="text-muted" />
        )}
      </div>

      {/* Text content */}
      <div
        className="d-flex flex-column flex-grow-1"
        style={{ maxWidth: 'calc(100% - 70px)', overflow: 'hidden' }}
      >
        <div className="d-flex justify-content-between">
          <strong className="text-truncate fs-6 fs-md-5">{name}</strong>
          <small className="text-muted">{time}</small>
        </div>
        <div
          className="text-muted text-truncate fs-6 fs-md-6"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            flexShrink: 0,
          }}
        >
          {truncateMessage(message, truncateLimit)}
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
