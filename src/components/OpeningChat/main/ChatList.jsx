import React, { useEffect, useState } from 'react';
import ChatItem from './ChatItem';

const List = () => {
  const [personalChats, setPersonalChats] = useState([]);
  const [groupPreviews, setGroupPreviews] = useState([]);

  useEffect(() => {
    // Load personal chat previews from localStorage
    try {
      const cachedPersonal = localStorage.getItem("PersonalChatPreviews");
      if (cachedPersonal) {
        const parsed = JSON.parse(cachedPersonal);
        if (Array.isArray(parsed)) {
          setPersonalChats(parsed);
        } else {
          console.warn("⚠️ Invalid format for PersonalChatPreviews:", parsed);
        }
      } else {
        console.log("ℹ️ No cached PersonalChatPreviews found.");
      }
    } catch (err) {
      console.error("❌ Error parsing PersonalChatPreviews:", err);
    }

    // Load group chat previews from localStorage
    try {
      const cachedGroup = localStorage.getItem("GroupChatPreview");
      if (cachedGroup) {
        const parsed = JSON.parse(cachedGroup);
        if (Array.isArray(parsed.data)) {
          setGroupPreviews(parsed.data);
        } else {
          console.warn("⚠️ Invalid group data format:", parsed);
        }
      } else {
        console.log("ℹ️ No cached GroupChatPreview found.");
      }
    } catch (err) {
      console.error("❌ Error parsing GroupChatPreview:", err);
    }
  }, []);

  return (
    <div className="list-group px-2 py-2">
      {/* Personal chats */}
      {personalChats.map((chat, index) => (
        <ChatItem
          key={chat.contact_id || index}
          contact_id={chat.contact_id}
          contact_name={chat.contact_name}
          profile_picture={chat.profile_picture}
          last_text={chat.last_text}
          text_timestamp={chat.text_timestamp}
          sender_id={chat.sender_id}
          receiver_ids={Array.isArray(chat.receiver_ids) ? chat.receiver_ids : [chat.receiver_ids]}
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
