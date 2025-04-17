import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Popup = ({ togglePopup, onPrivacyClick, onArchiveSettingsClick }) => {
  const navigate = useNavigate(); // Initialize the navigation hook

  return (
    <div
      className="position-absolute end-0 mt-2 bg-white border shadow-sm rounded"
      style={{
        width: '200px',
        zIndex: 1000,
      }}
    >
      <ul className="list-unstyled mb-0">
        <li>
          <button
            className="dropdown-item"
            style={{ padding: '10px' }}
            onClick={onPrivacyClick}
          >
            Status Privacy
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            style={{ padding: '10px' }}
            onClick={onArchiveSettingsClick}
          >
            Status Archive Settings
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            style={{ padding: '10px' }}
            onClick={() => navigate('/settings')} // Navigate directly to /settings
          >
            Settings
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Popup;
