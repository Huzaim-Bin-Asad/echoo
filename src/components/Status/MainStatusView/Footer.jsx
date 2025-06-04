import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import likedImg from "../../../assets/liked.png";
import "./Footer.css";

const Footer = ({ statusId }) => {
  const [liked, setLiked] = useState(false);

  // Recheck like status on statusId change
  useEffect(() => {
    if (!statusId) return;

    console.log("📩 Checking if status is liked:", statusId);

    const likedStatuses = JSON.parse(
      localStorage.getItem("likedStatuses") || "{}"
    );
    setLiked(!!likedStatuses[statusId]); // Update liked state
  }, [statusId]);

  const handleLikeClick = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.user_id;

    if (!userId || !statusId) return console.warn("Missing userId or statusId");

    try {
      const response = await fetch("http://localhost:5000/api/like-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, statusId }),
      });

      if (response.ok) {
        console.log("✅ Liked status");

        // Set state and update localStorage
        setLiked(true);
        const likedStatuses = JSON.parse(
          localStorage.getItem("likedStatuses") || "{}"
        );
        likedStatuses[statusId] = true;
        localStorage.setItem("likedStatuses", JSON.stringify(likedStatuses));
      } else {
        console.error("❌ Failed to like status");
      }
    } catch (err) {
      console.error("Error sending like request:", err);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-between p-2">
      <input
        type="text"
        className="form-control rounded-pill me-2"
        placeholder="Reply"
        style={{ borderRadius: "50px", flex: 1 }}
      />
      <div
        className="d-flex justify-content-center align-items-center rounded-circle"
        onClick={handleLikeClick}
        style={{
          width: "36px",
          height: "36px",
          backgroundColor: "#3a1f3d",
          cursor: "pointer",
        }}
      >
        {liked ? (
          <img
            src={likedImg}
            alt="Liked"
            className="vibrate"
            style={{ width: 20, height: 20 }}
          />
        ) : (
          <Heart color="white" size={20} />
        )}
        <span style={{ display: "none" }} data-status-id={statusId}>
          {statusId}
        </span>
      </div>
    </div>
  );
};

export default Footer;
