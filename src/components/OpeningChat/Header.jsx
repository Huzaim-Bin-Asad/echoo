import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🧭 Add this line
import { Search, UserRoundPlus, EllipsisVertical } from 'lucide-react';
import DotMenu from './DotMenu';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate(); // 🧭 Hook for navigation

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const goToAddPage = () => {
    navigate('/add'); // 🧭 Route path that should render Add.jsx
  };

  return (
    <div className="bg-white position-relative">
      {/* Top Header */}
      <div
        className="d-flex justify-content-between align-items-center px-3"
        style={{ paddingTop: '1.2rem', paddingBottom: '1.2rem' }}
      >
        <h5 className="mb-0 fw-bold" style={{ fontSize: '1.45rem' }}>
          Echoo
        </h5>
        <div className="d-flex align-items-center gap-3 position-relative">
          <UserRoundPlus
            size={26}
            className="text-muted"
            style={{ cursor: 'pointer' }}
            onClick={goToAddPage} // 🎯 Navigate on click
          />
          <EllipsisVertical
            size={28}
            className="text-muted"
            onClick={toggleMenu}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Show Dropdown on Left */}
      {showMenu && <DotMenu />}

      {/* Search Bar */}
      <div className="px-3 pb-2">
        <div className="d-flex align-items-center bg-light px-3 py-2 rounded-pill">
          <Search className="text-muted me-2" size={18} />
          <input
            type="text"
            className="form-control border-0 bg-light p-0"
            placeholder="Search Contacts and Groups"
            style={{ fontSize: '1.1rem' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
