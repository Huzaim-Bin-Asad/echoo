import React, { useEffect, useState } from "react";
import boy2 from "../../../assets/boy2.jpg";

const StickyHeader = ({ onBack }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const maxScroll = 30;
  const clampedScroll = Math.min(scrollY, maxScroll);

  const scale = 1 - (clampedScroll / maxScroll) * 0.6;
  const translateX = clampedScroll * -4.5;
  const translateY = clampedScroll * 0.6;
  const opacity = 1 - (clampedScroll / maxScroll) ** 2.2;
  const showMiniHeader = scrollY > 20;

  return (
    <>
      <div
        className="d-flex align-items-center px-3 py-4 bg-white sticky-top"
        style={{
          zIndex: 100,
          borderBottom: showMiniHeader ? "2px solid #dee2e6" : "none",
          maxHeight: "70px",
        }}
      >
        <i
          className="bi bi-chevron-left fs-4 text-dark"
          style={{ cursor: "pointer" }}
          onClick={onBack} // <-- Call the parent's function
        ></i>

        {showMiniHeader && (
          <div className="d-flex align-items-center ms-2" style={{ marginTop: "-4px" }}>
            <img
              src={boy2}
              alt="Profile"
              width="50"
              height="50"
              className="rounded-circle me-2"
            />
            <strong>Huzaim</strong>
          </div>
        )}

        <i
          className="bi bi-three-dots-vertical fs-4 text-dark ms-auto"
          style={{ cursor: "pointer" }}
        ></i>
      </div>

      <div className="text-center bg-white" style={{ marginTop: "-60px", paddingTop: "0px" }}>
        <div
          style={{
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
            transformOrigin: "top left",
            transition: "transform 0.2s ease-out, opacity 0.2s ease-out",
            opacity,
            display: "inline-block",
            position: "relative",
            zIndex: 100000,
          }}
        >
          <img
            src={boy2}
            className="rounded-circle"
            alt="Profile"
            width="100"
            height="100"
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <h5 className="mb-0">Huzaim</h5>
          <small className="text-muted">~Jam</small>
        </div>
      </div>
    </>
  );
};

export default StickyHeader;
