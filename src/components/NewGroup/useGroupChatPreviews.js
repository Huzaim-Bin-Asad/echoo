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
        setGroupPreviews(data);
      } catch (error) {
        console.error("❌ Error fetching group previews:", error);
      }
    };

    fetchGroupPreviews();
  }, []);

  return { groupPreviews };
};
