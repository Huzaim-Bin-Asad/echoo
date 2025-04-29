import React from 'react';
import { User as UserIcon } from 'lucide-react';

const ContactItem = ({ id, name, message, profilePicture, onClick }) => {
  return (
    <div
      className="d-flex align-items-center px-3 py-2"
      style={{ cursor: 'pointer' }}
      onClick={() => onClick?.(id)}
    >
      <div
        className="bg-secondary rounded-circle d-flex justify-content-center align-items-center"
        style={{
          width: 50,
          height: 50,
          overflow: 'hidden',
          flexShrink: 0,
          flexGrow: 0,
        }}
      >
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <UserIcon size={24} color="white" />
        )}
      </div>

      <div className="d-flex flex-column ms-3">
        <div className="fw-bold">{name}</div>
        {message && <small className="text-white">{message}</small>}
      </div>
    </div>
  );
};

export default ContactItem;
