import React from "react";
import {
  ChevronLeft,
  PhoneCall,
  Video,
  EllipsisVertical,
  User,
} from "lucide-react";

function Header({ goBack }) {
  const handleBack = () => {
    if (goBack) goBack();
    else if (window.goBack) window.goBack();
  };

  return (
    <div className="d-flex align-items-center justify-content-between p-2 border-bottom flex-wrap">
      <div className="d-flex align-items-center flex-grow-1 flex-shrink-1" style={{ minWidth: 0 }}>
        <ChevronLeft
          size={24}
          className="me-2 flex-shrink-0"
          style={{ cursor: "pointer", color: "black" }}
          onClick={handleBack}
        />
        <User
          size={30}
          className="me-2 flex-shrink-0"
          style={{ color: "black" }}
        />
        <div className="text-truncate">
          <div className="fw-bold text-truncate">Nina Greer</div>
          <small className="text-success">Online</small>
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
