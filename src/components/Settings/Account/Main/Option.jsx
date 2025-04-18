import React from 'react';

const Option = ({ icon, label }) => {
  return (
    <div className="d-flex align-items-center py-3 px-3 bg-dark text-white">
      <span className="me-3 fs-5 text-primary">{icon}</span>
      <span>{label}</span>
    </div>
  );
};

export default Option;
