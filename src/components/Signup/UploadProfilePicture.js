import React from "react";
import { SwitchCamera } from "lucide-react";

const UploadProfilePicture = () => {
  return (
    <div className="d-flex align-items-center justify-content-center my-5 gap-4">
      {/* Circle with Camera Icon */}
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: "#f1f1f1",
          border: "2px dashed #ccc",
        }}
      >
        <SwitchCamera size={36} />
      </div>

      {/* Upload Text */}
      <div className="text-start">
        <div style={{ fontSize: "1.5rem", fontWeight: "600", lineHeight: "1.2" }}>
          Upload
          <br />
          Profile Picture
        </div>
      </div>
    </div>
  );
};

export default UploadProfilePicture;
