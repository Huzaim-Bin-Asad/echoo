import React from "react";
import { AtSign, Signature } from "lucide-react";

const inputStyle = {
  border: "none",
  borderBottom: "1px solid #555",
  borderRadius: 0,
  backgroundColor: "transparent",
  color: "white",
  paddingLeft: "0.8rem", // closer to left
  paddingRight: "1rem",
  width: "80%",
  marginLeft: "9%",
  marginTop: "15%",
  maxWidth: "480px",
  textAlign: "left",
};

const iconStyle = {
  position: "absolute",
  left: "-0.2rem", // pull icon more left
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  zIndex: 1,
  marginTop: "2%",
};

const ContactInfoForm = ({ email, username, handleChange }) => (
  <div className="mb-4" style={{ width: "100%", maxWidth: "600px" }}>

    {/* Email Input */}
    <div className="position-relative mb-4">
      <AtSign
        className="position-absolute text-muted"
        style={iconStyle}
        size={22}
      />
      <input
        type="email"
        name="email"
        className="form-control custom-email-input bg-transparent text-white"
        style={inputStyle}
        value={email}
        onChange={handleChange}
        placeholder="Email"
      />
    </div>

    {/* Username Input */}
    <div className="position-relative">
      <Signature
        className="position-absolute text-muted"
        style={iconStyle}
        size={22}
      />
      <input
        type="text"
        name="username"
        className="form-control custom-username-input bg-transparent text-white"
        style={inputStyle}
        value={username}
        onChange={handleChange}
        placeholder="Username"
      />
    </div>

  </div>
);

export default ContactInfoForm;
