import React from "react";
import { SunMoon, Wallpaper } from "lucide-react";

const DisplaySection = () => {
  return (
    <div className="mb-3 mt-3 border-bottom border-secondary-subtle pb-2">
      <p className="fw-semibold text-secondary" style={{ marginLeft: "16px", fontSize: "0.95rem" }}>
        Display
      </p>
      <div className="ps-3">
        <div className="d-flex align-items-start mb-4">
          <SunMoon size={26} className="me-2 mt-1" />
          <div className="ms-1">
            <p className="mb-1" style={{ fontSize: "1rem" }}>Theme</p>
            <small className="text-secondary" style={{ fontSize: "0.75rem" }}>
              System Default
            </small>
          </div>
        </div>

        <div className="d-flex align-items-center mb-2">
          <Wallpaper size={22} className="me-3" />
          <p className="mb-0" style={{ fontSize: "1rem" }}>Wallpaper</p>
        </div>
      </div>
    </div>
  );
};

export default DisplaySection;
