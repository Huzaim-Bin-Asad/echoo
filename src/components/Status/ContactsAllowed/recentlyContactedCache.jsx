import { useEffect, useRef } from "react";
import axios from "axios";

const RequentlyContacted = () => {
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      try {
        const { user_id } = JSON.parse(userData);
        const response = await axios.post("http://localhost:5000/api/chat/frequent", { user_id });

        if (response.data && Array.isArray(response.data)) {
          const newEntries = response.data;

          // De-duplicate incoming entries
          const uniqueNew = new Map();
          for (const entry of newEntries) {
            uniqueNew.set(entry.other_user_id, entry);
          }

          const existingRaw = localStorage.getItem("RecentlyContacted");
          const existingParsed = existingRaw ? JSON.parse(existingRaw) : [];

          const existingMap = new Map();
          for (const entry of existingParsed) {
            existingMap.set(entry.other_user_id, entry);
          }

          // Merge: latest contact on top, remove duplicates
          const merged = [...uniqueNew.values(), ...existingParsed].reduce((acc, entry) => {
            if (!acc.find(e => e.other_user_id === entry.other_user_id)) {
              acc.push(entry);
            }
            return acc;
          }, []);

          // Keep only latest 5
          const topFive = merged.slice(0, 5);

          const hasChanged = JSON.stringify(existingParsed) !== JSON.stringify(topFive);
          if (hasChanged) {
            localStorage.setItem("RecentlyContacted", JSON.stringify(topFive));
            console.log("[INFO] RecentlyContacted cache updated.");
          }
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    // Poll every 500ms
    intervalRef.current = setInterval(fetchContacts, 500);

    // Cleanup on unmount
    return () => clearInterval(intervalRef.current);
  }, []);

  return null;
};

export default RequentlyContacted;
