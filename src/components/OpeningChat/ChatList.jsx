import React from 'react';
import ChatItem from './ChatItem';

const chatData = [
  {
    name: 'Loretta Russell',
    message: 'Bro, will you be funny tonight?',
    time: '09:00',
    unread: true,
    img: '' // You can replace this URL with the actual image URL or leave it for testing.
  },
  {
    name: 'Nina Greer',
    message: "Bootstrap is like IKEA furniture—you get pre-built components (modals, dropdowns, cards) that you assemble.",
    time: '07:00',
    unread: true,
    img: '' // Leave empty to show the User icon
  },
  // Add more messages if needed
];

const ChatList = () => {
  return (
    <div className="list-group px-2 py-2">
      {chatData.map((chat, index) => (
        <ChatItem key={index} {...chat} />
      ))}
    </div>
  );
};

export default ChatList;
