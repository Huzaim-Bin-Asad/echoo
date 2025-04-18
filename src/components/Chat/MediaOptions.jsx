// MediaOptions.js
import React from "react";
import {
  Aperture,
  Camera,
  BrainCircuit,
  FileMusic,
  LocateFixed,
  UserRoundSearch,
} from "lucide-react"; // Import new icons

const MediaOptions = ({ onClose }) => {
  const options = [
    { label: "Document", icon: <Aperture size={24} color="#28a745" /> }, // New icon for Document
    { label: "Camera", icon: <Camera size={24} color="#28a745" /> },     // New icon for Camera
    { label: "Gallery", icon: <BrainCircuit size={24} color="#28a745" /> }, // New icon for Gallery
    { label: "Audio", icon: <FileMusic size={24} color="#28a745" /> },    // New icon for Audio
    { label: "Location", icon: <LocateFixed size={24} color="#28a745" /> }, // New icon for Location
    { label: "Contact", icon: <UserRoundSearch size={24} color="#28a745" /> }, // New icon for Contact
  ];

  return (
    <div
      className="media-options-container position-absolute w-100"
      style={{
        bottom: "60px", // Position the popup above the input field
        zIndex: 9999, // Ensure the popup is on top
        backgroundColor: "#fff",
        padding: "10px",
        borderRadius: "15px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        animation: "fadeIn 0.3s ease-out", // Fade-in effect
      }}
    >
      <div className="row text-center">
        {options.map((item, idx) => (
          <div key={idx} className="col-4 mb-3" onClick={onClose}>
            <div
              className="border rounded d-flex flex-column align-items-center justify-content-center"
              style={{
                height: "60px",  // Reduced height to make divs smaller
                backgroundColor: "#e9f7ef",
                borderRadius: "35px",
                cursor: "pointer",
                padding: "8px",  
              }}
            >
              {item.icon}
            </div>
            <small className="d-block mt-1">{item.label}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaOptions;