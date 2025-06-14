  import React, { useState, useEffect } from 'react';
  import { User, Users } from 'lucide-react';

  const ChatItem = ({
    contact_id,
    contact_name,
    last_text,
    text_timestamp,
    profile_picture,
    sender_id,
    receiver_ids = [], // expects array for personal chats
    isGroup = false,
  }) => {
    const [truncateLimit, setTruncateLimit] = useState(30);
    const showChat = window.showChat;

    const receiver_id = receiver_ids?.[0] || ""; // ✅ Safe default for attribute + localStorage

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
      msg?.length > limit ? msg.slice(0, limit) + '...' : msg;

    const formattedTime = text_timestamp
      ? new Date(text_timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    const handleClick = () => {
      localStorage.setItem('sender_id', sender_id);
      localStorage.setItem('receiver_id', receiver_id);
      localStorage.setItem('contact_id', contact_id);


      if (typeof showChat === 'function') {
        showChat();
      }
    };

    return (
      <div
        className="list-group-item list-group-item-action d-flex justify-content-between align-items-start border-0 py-3"
        style={{ cursor: 'pointer', paddingLeft: '2px' }}
        sender_id={sender_id}
        receiver_id={receiver_id}
        data-contact-id={contact_id}
        onClick={handleClick}
      >
        {/* Avatar */}
        <div
          className="me-3 d-flex align-items-center justify-content-center rounded-circle bg-light"
          style={{ width: 50, height: 50 }}
        >
          {profile_picture ? (
            <img
              src={profile_picture}
              alt={contact_name}
              className="rounded-circle"
              width="50"
              height="50"
              style={{ objectFit: 'cover' }}
            />
          ) : isGroup ? (
            <Users size={30} className="text-muted" />
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
            <strong className="text-truncate fs-6 fs-md-5">{contact_name}</strong>
            <small className="text-muted">{formattedTime}</small>
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
            {truncateMessage(last_text, truncateLimit)}
          </div>
        </div>
      </div>
    );
  };

  export default ChatItem;
