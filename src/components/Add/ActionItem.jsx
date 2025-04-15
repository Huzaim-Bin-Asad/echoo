import React from 'react';
import { User, Users, QrCode } from 'lucide-react';

const ActionItem = ({ icon, label, onClick }) => {
  const Icon = icon === 'group' ? Users : User;

  return (
    <div className="d-flex justify-content-between align-items-center py-3 px-2" onClick={onClick}>
      <div className="d-flex align-items-center gap-2 w-100">
        <div
          className="bg-secondary rounded-circle d-flex justify-content-center align-items-center"
          style={{ width: 42, height: 42 }}
        >
          <Icon size={20} color="white" />
        </div>
        <span className="text-white">{label}</span>
      </div>
      {label === 'New contact' && (
        <div className="pe-2">
          <QrCode size={18} color="white" />
        </div>
      )}
    </div>
  );
};

export default ActionItem;
