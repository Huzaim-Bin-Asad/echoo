import React, { useEffect, useState } from "react";
import { ChevronLeft, PhoneCall, Video, EllipsisVertical } from "lucide-react";
import { useUser } from "../../services/UserContext";
import axios from "axios";

function Header({ goBack, onProfileClick }) {
  const { user } = useUser();
  const [displayData, setDisplayData] = useState({
    profilePicture: "",
    name: "",
  });

  const handleBack = (e) => {
    e.stopPropagation(); // Prevents triggering parent click
    if (goBack) goBack();
    else if (window.goBack) window.goBack();
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const senderId = localStorage.getItem("sender_id");
      const receiverId = localStorage.getItem("receiver_id");

      if (!senderId || !receiverId) return;

      const payload = { sender_id: senderId, receiver_id: receiverId };

      try {
        const response = await axios.post(
          "https://echoo-backend.vercel.app/api/contact-info",
          payload
        );

        const { contactName, profilePicture } = response.data;

        setDisplayData((prev) => {
          if (
            prev.name !== contactName ||
            prev.profilePicture !== profilePicture
          ) {
            return { name: contactName, profilePicture };
          }
          return prev;
        });
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [user]);

  return (
    <div className="d-flex align-items-center justify-content-between p-2 border-bottom flex-wrap">
      <div className="d-flex align-items-center flex-grow-1 flex-shrink-1" style={{ minWidth: 0 }}>
        {/* Back Button */}
        <div onClick={handleBack}>
          <ChevronLeft
            size={24}
            className="me-2 flex-shrink-0"
            style={{ cursor: "pointer", color: "black" }}
          />
        </div>

        {/* Clickable Contact Info */}
        <div
          className="d-flex align-items-center"
          onClick={() => {
            if (onProfileClick) onProfileClick();
          }}
          style={{ cursor: "pointer", flex: 1 }}
        >
          {displayData.profilePicture ? (
            <img
              src={displayData.profilePicture}
              alt="Profile"
              width="46"
              height="46"
              className="rounded-circle me-2 flex-shrink-0"
            />
          ) : (
            <div className="me-2 flex-shrink-0">
              <svg width="30" height="30" fill="black">
                <circle cx="15" cy="15" r="15" />
              </svg>
            </div>
          )}
          <div className="text-truncate">
            <div className="fw-bold text-truncate">{displayData.name}</div>
          </div>
        </div>
      </div>

      {/* Right-side Action Buttons */}
      <div className="d-flex align-items-center justify-content-end flex-shrink-0 mt-2 mt-md-0">
        <PhoneCall
          size={24}
          className="mx-2"
          style={{ color: "black", cursor: "pointer" }}
        />
        <Video
          size={24}
          className="mx-2"
          style={{ color: "black", cursor: "pointer" }}
        />
        <EllipsisVertical
          size={24}
          className="mx-2"
          style={{ color: "black", cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export default Header;
