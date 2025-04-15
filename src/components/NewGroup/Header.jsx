import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ count, total }) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom border-secondary bg-dark text-white position-sticky top-0 z-1">
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-link text-white p-0 m-0" onClick={() => navigate('/add')}>
          <ChevronLeft size={24} />
        </button>
        <div>
          <h6 className="mb-0 fw-semibold">New Group</h6>
          <small className="text-white" style={{ opacity: 0.75 }}>
            {count > 0 ? `${count} of ${total} selected` : 'Add members'}
          </small>
        </div>
      </div>
    </div>
  );
};

export default Header;
