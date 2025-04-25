import React from "react";
import { AtSign, Signature } from "lucide-react";

const inputStyle = {
  border: "none",
  borderBottom: "1px solid #fff", // White border for inputs
  borderRadius: 0,
  backgroundColor: "transparent",
  color: "white", // Text inside the input will be white
  paddingLeft: "0.8rem", // Closer to left
  paddingRight: "1rem",
  width: "80%",
  marginLeft: "9%",
  marginTop: "15%",
  maxWidth: "480px",
  textAlign: "left",
};

const iconStyle = {
  position: "absolute",
  left: "-0.2rem", // Pull icon more left
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  zIndex: 1,
  marginTop: "2%",
  color: "white", // Make icons white

};

const ContactInfoForm = ({ email, username, handleChange }) => (
  <div className="mb-4" style={{ width: "100%", maxWidth: "600px" }}>

    {/* Email Input */}
    <div className="position-relative mb-4">
      <AtSign
        className="position-absolute"
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
        className="position-absolute"
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

    {/* Custom styling for placeholder and input text */}
    <style>{`
   
    
    `}</style>

  </div>
);

export default ContactInfoForm;
