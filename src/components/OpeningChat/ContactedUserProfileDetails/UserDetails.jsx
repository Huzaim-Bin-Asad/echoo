import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

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
          <div
            className="text-center border py-2 px-2"
            style={{
              width: "125px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
            }}
          >
            <i className="bi bi-telephone fs-6 text-dark mb-1"></i>
            <div style={{ lineHeight: "1" }}>
              <small>Call</small>
            </div>
          </div>
          <div
            className="text-center border py-2 px-2"
            style={{
              width: "125px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
            }}
          >
            <i className="bi bi-camera-video fs-6 text-dark mb-1"></i>
            <div style={{ lineHeight: "1" }}>
              <small>Video</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactedUserProfileDetails;
