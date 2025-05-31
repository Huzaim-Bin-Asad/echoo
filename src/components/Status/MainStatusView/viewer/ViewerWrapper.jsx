import Header from "./Header";
import ViewerList from "./ViewerList";
import { useEffect, useState } from "react";

const ViewerWrapper = ({ onHeaderClick, statusId, statusIds }) => {
  const [viewers, setViewers] = useState([]);

  useEffect(() => {
    console.log("👁️ ViewerWrapper received statusId:", statusId);
    console.log("📦 ViewerWrapper received statusIds:", statusIds);

    if (!statusId) {
      setViewers([]);
      return;
    }

    // Get current user from localStorage
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

    // Read cache from localStorage
    const cachedViewersJSON = localStorage.getItem("StatusViewers");
    if (!cachedViewersJSON) {
      setViewers([]);
      return;
    }

    try {
      const cachedViewers = JSON.parse(cachedViewersJSON);
      // Get viewers for the current statusId
      const viewersForStatus = cachedViewers[statusId] || [];

      // Filter out current user
      const filteredViewers = viewersForStatus.filter(
        ({ userId }) => userId !== currentUserId
      );

      // Map to shape required by ViewerList
      const mappedViewers = filteredViewers.map(({ contactName, profilePicture }) => ({
        name: contactName || "Unknown",
        avatar: profilePicture || "https://via.placeholder.com/32",
        // no time property included
      }));

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
