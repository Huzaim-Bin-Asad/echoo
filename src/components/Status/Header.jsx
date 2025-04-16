// components/Status/Header.jsx
import React from 'react';
import { Search, EllipsisVertical } from 'lucide-react';

const Header = ({ togglePopup }) => {
  return (
    <div
      className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom bg-white sticky-top"
      style={{ height: '64px', zIndex: 1001 }}
    >
      <h5 className="mb-0 fw-bold">Updates</h5>
      <div className="d-flex align-items-center gap-3">
        <Search />
        <div className="position-relative" onClick={togglePopup} style={{ cursor: 'pointer' }}>
          <EllipsisVertical />
        </div>
      </div>
    </div>
  );
};

export default Header;
