import React from 'react';
import Header from './Header';  // Assuming you have a Header component
import UserInfoPrinter from './UserInfoPrinter';  
import BottomNav from './BottomNav';  

const OpeningChat = () => {
  return (
    <div
      className="container-fluid p-0 d-flex flex-column"
      style={{ height: '90vh', maxWidth: '768px', margin: '0 auto' }}
    >
      {/* Header section */}
      <Header />

      {/* User info and chat list section, scrollable */}
      <div className="flex-grow-1 overflow-auto" style={{ paddingBottom: '60px' }}>
        <UserInfoPrinter />  
      </div>

      {/* Bottom navigation section */}
      <BottomNav />
    </div>
  );
};

export default OpeningChat;
