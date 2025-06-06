import React from 'react';
import { ChevronLeft } from 'lucide-react';

const Header = ({ onBack }) => {
  return (
    <div className="d-flex align-items-center mb-4" style={{ cursor: 'pointer' }}>
      <ChevronLeft
        className="me-3 text-white"
        onClick={() => onBack?.()} // ✅ Trigger onBack when clicked
      />
      <h5 className="mb-0 text-white">Group permissions</h5>
    </div>
  );
};

export default Header;
