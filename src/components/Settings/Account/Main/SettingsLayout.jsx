import React from 'react';
import {
  ShieldLock,
  People,
  Envelope,
  Key,
  
  FileText,
  Trash,
  Pencil,
  Lock,
} from 'react-bootstrap-icons';

const options = [
  { icon: <ShieldLock />, label: 'Security notifications' },
  { icon: <People />, label: 'Passkeys' },
  { icon: <Envelope />, label: 'Email address' },
  { icon: <Key />, label: 'Two-step verification' },
  { icon: <FileText />, label: 'Request account info' },
  { icon: <Trash />, label: 'Delete account' },
  { icon: <Pencil />, label: 'Edit Profile' },
  { icon: <Lock />, label: 'Change Password' },
];

const SettingsLayout = () => {
  return (
    <div className="settings-parent custom-background">
      <div className="list-group p-0 m-0">
        {options.map((item, index) => (
          <div
            key={index}
            className="list-group-item d-flex align-items-center" 
            style={{
              paddingTop: '-5rem',
              marginTop: "-15px",
              paddingBottom: '1rem',
              marginBottom: '35px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
            }}
          >
            <span className="me-3 fs-5 text-white">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsLayout;
