import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import MembersCan from './MembersCan';
import AdminsCan from './AdminsCan';

const GroupPermissions = ({ onBack }) => {
  return (
    <div
      className="vh-100 p-3"
      style={{
        backgroundColor: '#1e1b24', // Custom dark background
        color: '#ffffff',           // Custom light text
      }}
    >
      <Header onBack={onBack} />
      <MembersCan />
      <AdminsCan />
    </div>
  );
};

export default GroupPermissions;
