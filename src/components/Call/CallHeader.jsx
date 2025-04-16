import React, { useState } from 'react';
import { Search, EllipsisVertical } from 'lucide-react'; 

const CallHeader = () => {
  // State to manage dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle function for dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <>
      {/* Sticky header with light background */}
      <div
        className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom border-secondary bg-light sticky-top"
        style={{ zIndex: 1020 }}
      >
        <h4 className="mb-0 text-dark">Calls</h4>
        <div className="d-flex align-items-center gap-3">
          <Search className="text-dark" />
          
          {/* Ellipsis icon that will trigger the dropdown */}
          <div 
            onClick={toggleDropdown} 
            style={{ cursor: 'pointer' }}
          >
            <EllipsisVertical className="text-dark" />
          </div>
        </div>
      </div>

      {/* Conditionally render dropdown based on state */}
      {isDropdownOpen && (
        <div
          className="dropdown-menu show"
          style={{
            position: 'absolute',
            top: '60px', // Adjust based on header height
            right: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 1030,
            backgroundColor: 'white',
          }}
        >
          <a className="dropdown-item text-danger" href="#delete">
            Delete Call Log
          </a>
          <a className="dropdown-item" href="#settings">
            Settings
          </a>
        </div>
      )}
    </>
  );
};

export default CallHeader;
