import React from 'react';
import { Search, EllipsisVertical } from 'lucide-react';

const Header = ({ togglePopup }) => {
  return (
    <div
      className="d-flex justify-content-between align-items-center px-3 py-3 bg-white sticky-top"
      style={{ 
        height: '64px', 
        zIndex: 1001,
        borderBottom: '1px solid rgba(0,0,0,0.08)'
      }}
    >
      <h5 className="mb-0 fw-bold" style={{ fontSize: '1.2rem' }}>Updates</h5>
      <div className="d-flex align-items-center gap-3">
        <Search size={20} className="text-muted" style={{ cursor: 'pointer' }} />
        <div 
          className="position-relative" 
          onClick={togglePopup} 
          style={{ 
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <EllipsisVertical size={20} className="text-muted" />
        </div>
      </div>
    </div>
  );
};

export default Header;