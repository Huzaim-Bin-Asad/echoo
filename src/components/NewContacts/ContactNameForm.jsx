import React from "react";
import { User } from "lucide-react";

const inputStyle = {
  border: "none",
  borderBottom: "1px solid #555", // Optional: customize border if needed
  borderRadius: 0,
  backgroundColor: "transparent",
  color: "white", // White text inside the input
  paddingLeft: "0.8rem", // Closer to the left
  paddingRight: "1rem",
  width: "80%",
  marginLeft: "9%",
  marginTop: "15%",
  maxWidth: "480px",
  textAlign: "left",
};

const iconStyle = {
  position: "absolute",
  left: "-0.2rem", // Pull icon more to the left
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  zIndex: 1,
  marginTop: "2%",
};

const ContactNameForm = ({ firstName, lastName, handleChange }) => (
  <div className="mb-4" style={{ width: "100%", maxWidth: "600px" }}>

    {/* First Name Input */}
    <div className="position-relative mb-4">
      <User
        className="position-absolute text-white" // Set the icon color to white
        style={iconStyle}
        size={22}
      />
      <input
        type="text"
        name="firstName"
        className="form-control bg-transparent text-white"
        style={inputStyle}
        value={firstName}
        onChange={handleChange}
        placeholder="First name"
      />
    </div>

    {/* Last Name Input */}
    <div className="position-relative">
      <input
        type="text"
        name="lastName"
        className="form-control bg-transparent text-white"
        style={inputStyle}
        value={lastName}
        onChange={handleChange}
        placeholder="Last name"
      />
    </div>

    {/* CSS to ensure all placeholder text is white */}
    <style>{`
      input::placeholder {
        color: white !important; /* Ensures the placeholder text is white */
      }
    `}</style>

  </div>
);

export default ContactNameForm;
