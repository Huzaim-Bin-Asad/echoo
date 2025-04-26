import React from 'react';
import Header from './Header';  // Assuming you have a Header component
import UserInfoPrinter from './UserInfoPrinter';  // Make sure the case matches the actual file name
import BottomNav from './BottomNav';  // Assuming you have a BottomNav component

const OpeningChat = () => {
  return (
    <div className="container-fluid p-0 d-flex flex-column" style={{ height: '100vh', maxWidth: '768px', margin: '0 auto' }}>
   {/* Header section */}
      <Header />

      {/* User info and chat list section, which grows to fill the remaining space and allows for scrolling */}
      <div className="flex-grow-1 overflow-auto" style={{ paddingBottom: '60px' }}>
        <UserInfoPrinter />  {/* Include the UserInfoPrinter component */}
      </div>

      {/* Bottom navigation section */}
      <BottomNav />
    </div>
  );
};

export default OpeningChat;
