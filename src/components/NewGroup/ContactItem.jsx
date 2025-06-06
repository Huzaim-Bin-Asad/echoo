import React from 'react';
import { User } from 'lucide-react';

const ContactItem = ({ name, message, selected, profilePicture }) => {
  return (
    <div
      className={`d-flex align-items-center py-2 rounded ${
        selected ? 'bg-secondary bg-opacity-50' : 'hover-bg-light'
      }`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter') e.currentTarget.click();
      }}
      style={{ cursor: 'pointer', paddingLeft: '8px' }}  // smaller left padding
      aria-pressed={selected}
      aria-label={`Select contact ${name}`}
    >
      <div
        className="rounded-circle d-flex justify-content-center align-items-center overflow-hidden"
        style={{ width: 40, height: 40, backgroundColor: '#6c757d' }} // smaller size
      >
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={`${name}'s profile`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <User size={20} color="white" />  // smaller icon to match smaller pfp
        )}
      </div>

      <div className="d-flex flex-column ms-3 flex-grow-1">
        <div className="fw-semibold text-white text-truncate" title={name}>
          {name}
        </div>
        {message && (
          <small className="text-white-50 text-truncate" title={message}>
            {message}
          </small>
        )}
      </div>
    </div>
  );
};

export default ContactItem;
