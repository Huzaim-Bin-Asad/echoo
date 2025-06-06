import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import MembersCan from './MembersCan';
import AdminsCan from './AdminsCan';

const GroupPermissions = ({ onBack }) => {
  return (
    <div className="bg-dark text-white vh-100 p-3">
      <Header onBack={onBack} /> {/* ✅ Pass onBack to Header */}
      <MembersCan />
      <AdminsCan />
    </div>
  );
};

export default GroupPermissions;
