import React from 'react';
import ChatItem from './ChatItem';
import { useUser } from '../../../services/UserContext';

const ChatList = ({ visible = false }) => {
  const { user } = useUser();

  // Support both 'chat_preview' and 'chat_previews' just in case
  const chatPreviews = user
    ? user.chat_preview ?? user.chat_previews ?? []
    : [];

  if (!visible || chatPreviews.length === 0) return null;

  return (
    <div className="list-group px-2 py-2">
      {chatPreviews.map((chat, index) => (
        <ChatItem
          key={chat.contact_id || index}
          contact_id={chat.contact_id}
          contact_name={chat.contact_name}
          profile_picture={chat.profile_picture}
          last_text={chat.last_text}
          text_timestamp={chat.text_timestamp}
          sender_id={chat.sender_id}
          receiver_id={Array.isArray(chat.receiver_id) ? chat.receiver_id : [chat.receiver_id]}
        />
      ))}
    </div>
  );
};

export default ChatList;
