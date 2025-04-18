import React from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';

const Header = ({ goBack }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <ChevronLeft size={24} style={{ cursor: 'pointer' }} onClick={goBack} />
      <h5 className="mb-0">Notifications</h5>
      <MoreVertical size={24} />
    </div>
  );
};

export default Header;
