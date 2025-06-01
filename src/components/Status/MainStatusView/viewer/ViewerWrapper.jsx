import Header from "./Header";
import ViewerList from "./ViewerList";
import { useEffect, useState } from "react";

const ViewerWrapper = ({ onHeaderClick, statusId, statusIds }) => {
  const [viewers, setViewers] = useState([]);

  useEffect(() => {
    if (!statusId) {
      setViewers([]);
      return;
    }

    const userJSON = localStorage.getItem("user");
    let currentUserId = null;

    if (userJSON) {
      try {
        const user = JSON.parse(userJSON);
        currentUserId = user.user_id || null;
      } catch (e) {
        console.error("❌ Failed to parse current user data:", e);
      }
    }

    const cachedViewersJSON = localStorage.getItem("StatusViewers");
    if (!cachedViewersJSON) {
      setViewers([]);
      return;
    }

    try {
      const cachedViewers = JSON.parse(cachedViewersJSON);
      const entry = cachedViewers[statusId];

      if (!entry) {
        setViewers([]);
        return;
      }

      let readers = [];
      let likers = [];

      // 🔄 Handle nested structure: { readers: [], likers: [] }
      if (typeof entry === "object" && !Array.isArray(entry)) {
        if (entry.readers && entry.readers.readers) {
          readers = Array.isArray(entry.readers.readers) ? entry.readers.readers : [];
          likers = Array.isArray(entry.readers.likers) ? entry.readers.likers : [];
        } else {
          readers = Array.isArray(entry.readers) ? entry.readers : [];
          likers = Array.isArray(entry.likers) ? entry.likers : [];
        }
      }

      // 🧹 Fallback for flat array structure (legacy)
      if (Array.isArray(entry)) {
        readers = entry;
        likers = [];
      }

      const filteredViewers = readers.filter(({ userId }) => userId !== currentUserId);

      const mappedViewers = filteredViewers.map(({ userId, contactName, profilePicture }) => {
        const liked = likers.some((liker) => liker.userId === userId);
        return {
          name: contactName || "Unknown",
          avatar: profilePicture || "https://via.placeholder.com/32",
          liked,
        };
      });

      setViewers(mappedViewers);
    } catch (error) {
      console.error("❌ Failed to parse StatusViewers cache:", error);
      setViewers([]);
    }
  }, [statusId, statusIds]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "108%",
        maxWidth: "400px",
        margin: "0 auto",
        backgroundColor: "transparent",
        padding: "16px",
        borderRadius: "8px 8px 0 0",
        zIndex: 1000,
        maxHeight: "50vh",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <Header count={viewers.length} onClick={onHeaderClick} />
      <ViewerList viewers={viewers} />
    </div>
  );
};

export default ViewerWrapper;
