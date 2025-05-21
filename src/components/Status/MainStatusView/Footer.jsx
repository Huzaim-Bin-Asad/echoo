import React from "react";
import { Heart } from "lucide-react";

const Footer = () => {
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
        style={{ width: "36px", height: "36px", backgroundColor: "#333" }}
      >
        <Heart color="white" size={20} />
      </div>
    </div>
  );
};

export default Footer;
