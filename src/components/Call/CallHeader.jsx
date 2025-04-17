import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate
import { Search, EllipsisVertical } from 'lucide-react';

const CallHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Navigate to settings page
  const goToSettings = () => {
    navigate('/settings');
    setIsDropdownOpen(false); // Optionally close the dropdown after navigation
  };

  return (
    <>
      <div
        className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom border-secondary bg-light sticky-top"
        style={{ zIndex: 1020 }}
      >
        <h4 className="mb-0 text-dark">Calls</h4>
        <div className="d-flex align-items-center gap-3">
          <Search className="text-dark" />
          <div onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
            <EllipsisVertical className="text-dark" />
          </div>
        </div>
      </div>

      {isDropdownOpen && (
        <div
          className="dropdown-menu show"
          style={{
            position: 'absolute',
            top: '60px',
            right: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 1030,
            backgroundColor: 'white',
          }}
        >
          <div className="dropdown-item text-danger" style={{ cursor: 'pointer' }}>
            Delete Call Log
          </div>
          <div
            className="dropdown-item"
            style={{ cursor: 'pointer' }}
            onClick={goToSettings}
          >
            Settings
          </div>
        </div>
      )}
    </>
  );
};

export default CallHeader;
