import React, { useEffect, useState } from "react";
import { ChevronLeft, PhoneCall, Video, EllipsisVertical } from "lucide-react";
import { useUser } from "../../services/UserContext";
import axios from "axios"; // Import axios to make HTTP requests

function Header({ goBack }) {
  const { user } = useUser();
  const [displayData, setDisplayData] = useState({
    profilePicture: "",
    name: "",
  });

  const handleBack = () => {
    if (goBack) goBack();
    else if (window.goBack) window.goBack();
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const senderId = localStorage.getItem("sender_id");
      const receiverId = localStorage.getItem("receiver_id");

      if (!senderId || !receiverId) {
        return;
      }

      const payload = {
        sender_id: senderId,
        receiver_id: receiverId,
      };

      try {
        // Make a POST request to the backend to get the contact details
        const response = await axios.post(
          "https://echoo-backend.vercel.app/api/contact-info",
          payload
        );

        const { contactName, profilePicture } = response.data;

        // Update the display data
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
        // Enhanced error handling
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error(
            `Backend returned error status: ${error.response.status}`
          );
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          // No response from server
          console.error("No response from server:", error.request);
        } else {
          // Error setting up the request
          console.error("Error setting up request:", error.message);
        }
      }
    }, 100); // Now checks every 0.5 second (500 ms)

    return () => {
      clearInterval(intervalId); // Cleanup interval on component unmount
    };
  }, [user]);

  return (
    <div className="d-flex align-items-center justify-content-between p-2 border-bottom flex-wrap">
      <div
        className="d-flex align-items-center flex-grow-1 flex-shrink-1"
        style={{ minWidth: 0 }}
      >
        <ChevronLeft
          size={24}
          className="me-2 flex-shrink-0"
          style={{ cursor: "pointer", color: "black" }}
          onClick={handleBack}
        />
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
