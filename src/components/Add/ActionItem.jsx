import React from 'react';
import { User, Users, QrCode } from 'lucide-react';

const ActionItem = ({ icon, label, onClick }) => {
  let Icon;
  
  // Conditional rendering of icons
  if (icon === 'group') {
    Icon = Users;
  } else if (icon === 'contact') {
    Icon = User;
  } else if (icon === 'qr') {
    Icon = QrCode;
  }

  return (
    <div className="d-flex justify-content-between align-items-center py-3 px-2" onClick={onClick}>
      {/* Only display icon and label without the div for additional styling */}
      <div className="d-flex align-items-center gap-2 w-100">
        <Icon size={20} color="white" />
        <span className="text-white">{label}</span>
      </div>
    </div>
  );
};

export default ActionItem;
