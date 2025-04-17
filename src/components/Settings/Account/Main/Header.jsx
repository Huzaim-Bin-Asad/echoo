import React from 'react';

const Header = ({ title }) => {
  return (
    <div className="d-flex align-items-center mb-4">
      <i className="bi bi-arrow-left me-3" role="button"></i>
      <h4 className="mb-0">{title}</h4>
    </div>
  );
};

export default Header;
