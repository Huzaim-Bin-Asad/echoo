import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Archive, Settings } from 'lucide-react';

const Popup = ({ togglePopup, onPrivacyClick, onArchiveSettingsClick }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white border-0 shadow-lg rounded-3 overflow-hidden"
      style={{
        width: '220px',
        zIndex: 1050,
      }}
    >
      <ul className="list-unstyled mb-0">
        <li>
          <button
            className="dropdown-item d-flex align-items-center py-3 px-3"
            onClick={onPrivacyClick}
            style={{ fontSize: '0.9rem' }}
          >
            <Lock size={18} className="me-2" />
            Status Privacy
          </button>
        </li>
        <li>
          <button
            className="dropdown-item d-flex align-items-center py-3 px-3"
            onClick={onArchiveSettingsClick} // Trigger the click handler here
            style={{ fontSize: '0.9rem' }}
          >
            <Archive size={18} className="me-2" />
            Status Archive Settings
          </button>
        </li>
        <li>
          <button
            className="dropdown-item d-flex align-items-center py-3 px-3"
            onClick={() => navigate('/settings')}
            style={{ fontSize: '0.9rem' }}
          >
            <Settings size={18} className="me-2" />
            Settings
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Popup;
