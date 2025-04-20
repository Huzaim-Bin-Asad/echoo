import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import "./AppLanguageSelector.css";

const languages = [
  { label: "English", sub: "(device's language)" },
  { label: "اردو", sub: "Urdu" },
  { label: "Afrikaans", sub: "Afrikaans" },
  { label: "Shqip", sub: "Albanian" },
  { label: "አማርኛ", sub: "Amharic" },
];

export default function AppLanguageSelector({ show, handleClose }) {
  const [selected, setSelected] = useState("English");
  const [expanded, setExpanded] = useState(false);
  const [closing, setClosing] = useState(false);
  const [halfOpen, setHalfOpen] = useState(false);
  const startY = useRef(null);
  const [setSwipeDistance] = useState(0); // Track swipe distance

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setSwipeDistance(0); // Reset swipe distance on new touch
  };

  const handleTouchMove = (e) => {
    if (startY.current === null) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;

    setSwipeDistance(deltaY); // Update swipe distance

    if (deltaY > 20 && deltaY < 100) {
      // If swiping down but not enough to fully close
      setClosing(false);
      setHalfOpen(true);
    } else if (deltaY >= 100) {
      // If swiping down past the threshold to close
      setClosing(true);
      setHalfOpen(false);
    } else if (deltaY < -20 && deltaY > -100) {
      // If swiping up but not enough to fully expand
      setExpanded(false);
      setHalfOpen(true);
    } else if (deltaY <= -100) {
      // If swiping up past the threshold to expand
      setExpanded(true);
      setHalfOpen(false);
    }
  };

  const handleTouchEnd = () => {
    if (closing) {
      handleClose();
    } else if (expanded) {
      // Fully expanded, no change needed
    }
    setSwipeDistance(0); // Reset swipe distance when touch ends
  };

  useEffect(() => {
    if (show) {
      setExpanded(false);
      setClosing(false);
      setHalfOpen(false);
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName={`custom-slide-up-modal 
        ${expanded ? "expanded" : ""} 
        ${closing ? "closing" : ""} 
        ${halfOpen ? "half-open" : ""}`}
      dialogClassName="border-0 m-0"
      backdropClassName="custom-backdrop"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="drag-indicator">―</div>

      <Modal.Header className="bg-dark text-white border-0 py-2">
        <Modal.Title>App language</Modal.Title>
     
      </Modal.Header>
      <div
          style={{
            borderBottom: "1px solid lightgray",
            margin: "16px 0", // Adding some margin for spacing
          }}
        ></div>
      <Modal.Body className="bg-dark text-white custom-modal-body">
        <div className="list-group">
          {languages.map((lang, index) => (
            <label
              key={index}
              className={`list-group-item list-group-item-dark d-flex justify-content-start align-items-center ${
                selected === lang.label ? "active" : ""
              }`}
              style={{ cursor: "pointer" }}
            >
              <div className="form-check d-flex align-items-center">
                <input
                  className="form-check-input"
                  type="radio"
                  name="language"
                  value={lang.label}
                  checked={selected === lang.label}
                  onChange={() => setSelected(lang.label)}
                  style={{ marginTop: "0px" }}
                />
                <div className="ms-2 fs-5">
                  <div>{lang.label}</div>
                  <small className="text-secondary">{lang.sub}</small>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Light grey separation line */}

      </Modal.Body>
    </Modal>
  );
}
