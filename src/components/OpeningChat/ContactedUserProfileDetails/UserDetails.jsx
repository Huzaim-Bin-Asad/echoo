import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Search } from "lucide-react"; // lucide-react icon

const ContactedUserProfileDetails = () => {
  return (
    <div
      style={{
        width: "calc(100% + 28px)",
        marginLeft: "-15px",
        marginTop: "-24px",
      }}
      className="text-dark bg-white"
    >
      {/* CALL BUTTONS */}
      <div className="mx-4 mt-4 p-2 bg-white">
        <div
          className="d-flex justify-content-center bg-white"
          style={{ gap: "16px" }}
        >
          {/* Call */}
          <div
            className="text-center border py-2 px-2"
            style={{
              width: "145px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
            }}
          >
            <i className="bi bi-telephone fs-6 text-dark mb-1"></i>
            <div style={{ lineHeight: "1" }}>
              <small>Call</small>
            </div>
          </div>

          {/* Video */}
          <div
            className="text-center border py-2 px-2"
            style={{
              width: "145px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
            }}
          >
            <i className="bi bi-camera-video fs-6 text-dark mb-1"></i>
            <div style={{ lineHeight: "1" }}>
              <small>Video</small>
            </div>
          </div>

          {/* Search */}
          <div
            className="text-center border py-2 px-2"
            style={{
              width: "145px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
            }}
          >
            <Search size={16} className="mb-1 text-dark" />
            <div style={{ lineHeight: "1" }}>
              <small>Search</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactedUserProfileDetails;
