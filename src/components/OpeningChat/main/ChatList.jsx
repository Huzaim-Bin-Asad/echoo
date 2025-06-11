import React, { useEffect, useState } from 'react';
import ChatItem from './ChatItem';
import { useUser } from '../../../services/UserContext';

const List = () => {
  const { user } = useUser();
  const [groupPreviews, setGroupPreviews] = useState([]);

  const chatPreviews = user?.chat_preview ?? user?.chat_previews ?? [];

  useEffect(() => {
    try {
      const cached = localStorage.getItem("GroupChatPreview");
      console.log("📦 Cached GroupChatPreview string:", cached);

      if (cached) {
        const parsed = JSON.parse(cached);
        console.log("🧩 Parsed GroupChatPreview:", parsed);

        if (Array.isArray(parsed.data)) {
          setGroupPreviews(parsed.data);
          console.log(`✅ Loaded ${parsed.data.length} group chat preview(s)`);
        } else {
          console.warn("⚠️ Invalid group data format:", parsed);
        }
      } else {
        console.log("ℹ️ No cached GroupChatPreview found.");
      }
    } catch (err) {
      console.error("❌ Error parsing GroupChatPreview from localStorage:", err);
    }
  }, []); // 👈 run only once on mount

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
      {groupPreviews.map((group, index) => {
        return (
          <ChatItem
            key={group.groupid || `group-${index}`}
            contact_id={group.groupid}
            contact_name={group.groupname || "Unnamed Group"}
            profile_picture={group.groupprofilepicture}
            last_text={group.lastmessage ?? "No messages yet"}
            text_timestamp={group.lasttimestamp}
            isGroup={true}
          />
        );
      })}
    </div>
  );
};

export default List;
