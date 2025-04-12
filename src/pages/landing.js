import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import landingImg from "../assets/landing.jpg";

const Landing = () => {
  return (
    <div
      className="d-flex flex-column bg-light position-relative"
      style={{
        height: "80vh", // 80% of the viewport
        overflow: "hidden", // prevent internal scroll
      }}
    >
      {/* Top Section */}
      <div
        className="d-flex align-items-end justify-content-center position-relative flex-grow-1"
        style={{
          backgroundColor: "#f9efe3",
          paddingBottom: "20px",
        }}
      >
        <svg
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            height: "80px",
            transform: "translateY(-100%)",
            zIndex: 2,
          }}
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,100 1140,0 1440,100 V100 H0 Z"
            fill="#1a1a2e"
          />
        </svg>

        <img
          src={landingImg}
          alt="Connect Illustration"
          style={{
            width: "50%",
            maxWidth: "250px",
            height: "auto",
            zIndex: 1,
          }}
        />
      </div>

      {/* Bottom Section */}
      <div
        className="text-center text-white px-4 py-3"
        style={{
          backgroundColor: "#1a1a2e",
        }}
      >
        <h4 className="fw-bold mb-2">Let's connect with each other</h4>
        <p className="text-secondary mb-3" style={{ fontSize: "0.85rem" }}>
          A message is a discrete communication intended by the source consumption.
        </p>
        <button
          className="btn btn-danger px-4 py-2"
          style={{
            borderRadius: "30px",
          }}
        >
          Let's Start →
        </button>
      </div>
    </div>
  );
};

export default Landing;
