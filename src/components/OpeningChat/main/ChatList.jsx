// src/components/OpeningChat/List.jsx
import React from 'react';
import ChatItem from './ChatItem';
import { useUser } from '../../../services/UserContext';
import { useGroupChatPreviews } from '../../NewGroup/useGroupChatPreviews';

const List = () => {
  const { user } = useUser();
  const { groupPreviews } = useGroupChatPreviews();

  const chatPreviews = user?.chat_preview ?? user?.chat_previews ?? [];

  return (
    <div className="list-group px-2 py-2">
      {/* Personal chats */}
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

      {/* Group chats */}
      {groupPreviews.map((group, index) => (
        <ChatItem
          key={group.groupid || `group-${index}`}
          contact_id={group.groupid}
          contact_name={group.groupname || "Unnamed Group"}
          profile_picture={group.groupprofilepicture}
          last_text={group.lastmessage ?? "No messages yet"}
          text_timestamp={group.lasttimestamp}
          isGroup={true}
        />
      ))}
    </div>
  );
};

export default List;
