import React from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ contactCount = 0 }) => {
  const navigate = useNavigate(); // Get the navigation function

  const handleBack = () => {
    navigate('/echoo'); // Navigate to /echoo
  };

  return (
    <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom border-secondary bg-dark text-white position-sticky top-0 z-1">
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-link text-white p-0 m-0" onClick={handleBack}>
          <ChevronLeft size={24} />
        </button>
        <div>
          <h6 className="mb-0 fw-semibold">Select contact</h6>
          <small className="text-white" style={{ opacity: 0.75 }}>
            {contactCount} contacts
          </small>
        </div>
      </div>
      <button className="btn btn-link text-white p-0 m-0">
        <Search size={20} />
      </button>
    </div>
  );
};

export default Header;
