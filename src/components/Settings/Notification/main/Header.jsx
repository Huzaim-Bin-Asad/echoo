import React from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';

const Header = ({ goBack }) => {
  return (
    <>
      <div
        className="bg-dark text-white"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1030,
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          borderBottom: '1px solid #444',
        }}
      >
        <ChevronLeft size={24} style={{ cursor: 'pointer' }} onClick={goBack} />
        <h5 className="mb-0">Notifications</h5>
        <MoreVertical size={24} />
      </div>
      {/* Spacer to push content below fixed header */}
      <div style={{ height: '50px' }} />
    </>
  );
};

export default Header;
