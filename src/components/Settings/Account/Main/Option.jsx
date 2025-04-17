import React from 'react';

const Option = ({ icon, label }) => {
  return (
    <div className="list-group-item d-flex align-items-center">
      <span className="me-3 fs-5 text-primary">{icon}</span>
      <span>{label}</span>
    </div>
  );
};

export default Option;
