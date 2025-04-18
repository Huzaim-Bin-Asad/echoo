import React from "react";
import { ChevronLeft, Phone, MoreVertical } from "lucide-react";

function Header({ goBack }) {
  const handleBack = () => {
    if (goBack) goBack(); // Use prop, fallback to window.goBack if needed
    else if (window.goBack) window.goBack();
  };

  return (
    <div className="d-flex align-items-center justify-content-between p-2 border-bottom">
      <div className="d-flex align-items-center">
        <ChevronLeft
          size={24}
          className="me-2"
          style={{ cursor: "pointer", color: "black" }}
          onClick={handleBack}
        />
        <img
          src="https://via.placeholder.com/40"
          alt="profile"
          className="rounded-circle me-2"
        />
        <div>
          <div className="fw-bold">Nina Greer</div>
          <small className="text-success">Online</small>
        </div>
      </div>

      <div className="d-flex align-items-center">
        <Phone size={20} className="mx-2" style={{ color: "black" }} />
        <MoreVertical size={20} style={{ color: "black" }} />
      </div>
    </div>
  );
}

export default Header;
