// src/components/NewGroup/useGroupChatPreviews.js
import { useState, useEffect } from 'react';

export const useGroupChatPreviews = () => {
  const [groupPreviews, setGroupPreviews] = useState([]);

  useEffect(() => {
    const fetchGroupPreviews = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          console.error("User not found in localStorage.");
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user.user_id;

        // Try to load from cache
        const cached = localStorage.getItem("GroupChatPreview");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.userId === userId && parsed.data) {
            setGroupPreviews(parsed.data);
            return;
          }
        }

        // Otherwise fetch from server
        const res = await fetch(`https://echoo-backend.vercel.app/api/fetch-group-previews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ userId })
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // Save to state and cache
        setGroupPreviews(data);
        localStorage.setItem("GroupChatPreview", JSON.stringify({ userId, data }));
      } catch (error) {
        console.error("❌ Error fetching group previews:", error);
      }
    };

    fetchGroupPreviews();
  }, []);

  return { groupPreviews };
};
