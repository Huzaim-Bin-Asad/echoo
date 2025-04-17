import React from 'react';

const ProfileInfoItem = ({ icon, label, value, action }) => (
  <div className="d-flex align-items-start mb-4">
    <div className="d-flex align-items-center">
      {icon} {/* Render the passed icon */}
    </div>
    <div>
      <small className="text-white">{label}</small>
      <div className="text-white">{value || action}</div>
    </div>
  </div>
);

export default ProfileInfoItem;
