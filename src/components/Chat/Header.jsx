import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  PhoneCall,
  Video,
  EllipsisVertical,
} from "lucide-react";
import { useUser } from "../../services/UserContext";

function Header({ goBack }) {
  const { user } = useUser();
  const [displayData, setDisplayData] = useState({
    profilePicture: "",
  });

  const handleBack = () => {
    if (goBack) goBack();
    else if (window.goBack) window.goBack();
  };

  useEffect(() => {

    const intervalId = setInterval(() => {
      const contactedUserType = localStorage.getItem("selectedContactType");
      const contactedUserId = localStorage.getItem("selectedContactId");

      if (!contactedUserType || !contactedUserId) {
        return;
      }


      if (contactedUserType === "contactUser" && user?.contacts?.length) {
        const match = user.contacts.find(
          (c) =>
            c.contacted_id === contactedUserId || c.contact_id === contactedUserId
        );

        if (match) {

          setDisplayData((prev) => {
            if (
              prev.name !== match.contact_name ||
              prev.profilePicture !== match.profile_picture
            ) {
              return {
                name: match.contact_name,
                profilePicture: match.profile_picture,
              };
            } else {
              return prev;
            }
          });
        } else {
        }
      } else if (contactedUserType === "currentUser" && user?.user) {
        const fullName = `${user.user.first_name} ${user.user.last_name} `;

        setDisplayData((prev) => {
          if (
            prev.name !== fullName ||
            prev.profilePicture !== user.user.profile_picture
          ) {
            return {
              name: fullName,
              profilePicture: user.user.profile_picture,
            };
          } else {
            return prev;
          }
        });
      } else {
      }
    }, 1);

    return () => {
      clearInterval(intervalId);
    };
  }, [user]);

  return (
    <div className="d-flex align-items-center justify-content-between p-2 border-bottom flex-wrap">
      <div className="d-flex align-items-center flex-grow-1 flex-shrink-1" style={{ minWidth: 0 }}>
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
