import React from 'react';
import Header from './Header';
import MessageList from './MessageList';

const StarredMessages = ({ goBack }) => {
  return (
    <div className="bg-black text-white h-screen flex flex-col">
      <Header goBack={goBack} />
      <div className="flex-grow overflow-y-auto">
        <MessageList />
      </div>
    </div>
  );
};

export default StarredMessages;
