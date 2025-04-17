import React from 'react';
import Header from './Header';
import ChatList from './ChatList';
import BottomNav from './BottomNav';

const OpeningChat = () => {
  return (
    <div className="container-fluid p-0 d-flex flex-column" style={{ height: '100vh', maxWidth: '768px', margin: '0 auto' }}>
      <Header />

      {/* Responsive chat list area */}
      <div className="flex-grow-1 overflow-auto" style={{ paddingBottom: '60px' }}>
        <ChatList />
      </div>

      <BottomNav />
    </div>
  );
};

export default OpeningChat;
