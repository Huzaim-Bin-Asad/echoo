import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search } from 'lucide-react';

const SettingsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between align-items-center px-2 py-2 border-bottom bg-dark text-white sticky-top" style={{ minHeight: '60px', zIndex: 1030 }}>
      <div className="d-flex align-items-center gap-2">
        <ChevronLeft size={26} style={{ cursor: 'pointer' }} onClick={() => navigate('/echoo')} />
        <h4 className="mb-0 fw-bold">Settings</h4>
      </div>
      <Search size={22} style={{ cursor: 'pointer' }} />
    </div>
  );
};

export default SettingsHeader;
