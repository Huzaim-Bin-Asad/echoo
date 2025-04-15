// components/QRquickLink/QRDropdown.jsx
import React from 'react';

const QRDropdown = ({ onResetLink }) => {
  return (
    <div className="dropdown-menu show position-absolute end-0">
      <button className="dropdown-item" onClick={onResetLink}>
        Reset Link
      </button>
    </div>
  );
};

export default QRDropdown;
