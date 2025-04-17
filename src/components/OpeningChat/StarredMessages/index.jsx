import React from 'react';
import Header from './Header';
import MessageList from './MessageList';

const StarredMessages = ({ goBack }) => {
  return (
    <div 
      className="bg-white container-fluid p-0"
      style={{
        maxWidth: "768px",
        margin: "0 auto",
        height: "120vh",
        border: "1px solid #ccc",
        overflow: "hidden",
      }}
    >
      <Header goBack={goBack} />
      <MessageList />
    </div>
  );
};

export default StarredMessages;