import React from 'react';
import { Search, UserRoundPlus, EllipsisVertical } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-white">
      {/* Top Header - Taller & Thicker Text */}
      <div className="d-flex justify-content-between align-items-center px-3" style={{ paddingTop: '1.2rem', paddingBottom: '1.2rem' }}>
        <h5 className="mb-0 fw-bold" style={{ fontSize: '1.45rem' }}>Echoo</h5>
        <div className="d-flex align-items-center gap-3">
          <UserRoundPlus size={26} className="text-muted" />
          <EllipsisVertical size={28} className="text-muted" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 pb-2">
        <div className="d-flex align-items-center bg-light px-3 py-2" style={{
          borderRadius: '999px',
        }}>
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
