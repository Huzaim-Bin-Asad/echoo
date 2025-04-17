import React from "react";
import { User } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';

const ProfileSetting = () => {
  return (
    <div className="border-bottom pb-2 mb-3" style={{ height: "75px" }}>

      <div className="d-flex justify-content-between align-items-start">
        {/* Profile with larger circle + user icon */}
        <div className="d-flex align-items-center gap-4">
          <div
            style={{
              width: "60px", // Size of the circle
              height: "60px", // Size of the circle
              borderRadius: "50%",
              backgroundColor: "#2d2d2d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={42} color="white" /> {/* Increased icon size */}
          </div>

          {/* Profile name and welcome text */}
          <div style={{ marginLeft: "-10px" }}> {/* Shifted content to the left */}
            <h5 className="mb-1" style={{ fontSize: "1.25rem" }}>Keenshaheer</h5>
            <small className="text-white" style={{ fontSize: ".85rem" }}>
              Hey there! I am using Echo...
            </small>
          </div>
        </div>

        {/* QR Code */}
        <div
          style={{
            transform: "translate(-4px, 15px)", // Adjusted translation for better alignment
          }}
        >
          <QRCodeSVG
            value="keenshaheer123"
            size={27} // QR code size
            bgColor="#212529"
            fgColor="#ffffff"
            level="H"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
