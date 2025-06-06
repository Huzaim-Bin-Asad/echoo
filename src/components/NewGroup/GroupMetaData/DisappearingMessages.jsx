import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DisappearingMessages = ({ onSelect }) => {
  const [selected, setSelected] = useState("off");

  const options = [
    { label: "24 hours", value: "24h" },
    { label: "7 days", value: "7d" },
    { label: "90 days", value: "90d" },
    { label: "Off", value: "off" },
  ];

  const handleChange = (value) => {
    setSelected(value);
    if (onSelect) onSelect(value);
  };

  return (
    <>
      <style>{`
        .custom-container {
          background-color: #1f1b2e;
          color: white;
          max-width: 320px;
          margin: 20px auto;
          font-family: system-ui, sans-serif;
          position: relative;
          z-index: 1050;
          border-radius: 27px !important;
          padding: 1.15rem 1.5rem; /* increased vertical padding by ~15% */
        }
        .custom-radio-label {
          cursor: pointer;
          border-radius: 30px !important;
          padding: 10px 12px; /* increased vertical padding for taller option */
          background-color: transparent;
          color: white;
          user-select: none;
          transition: color 0.25s;
          padding-left: 40px;
          display: flex;
          align-items: center;
          margin-bottom: 1rem; /* increased spacing between options */
          position: relative;
        }
        .custom-radio-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
          margin: 0;
        }
        .custom-radio-circle {
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          border: 2.5px solid #9980e3;
          border-radius: 50%;
          box-sizing: border-box;
          transition: border-color 0.25s;
          background-color: transparent;
        }
        .custom-radio-input:checked + .custom-radio-circle {
          border-color: white;
          background-color: white;
        }
      `}</style>

      <div className="custom-container">
        <h5 style={{ fontWeight: 600, color: "#bb99ff" }}>
          Disappearing messages
        </h5>
        <p style={{ fontSize: "0.9rem", color: "#c4c4c4" }}>
          All new messages in this chat will disappear after the selected duration.
        </p>
        <div className="mt-3">
          {options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <label
                key={option.value}
                htmlFor={`disappearing-${option.value}`}
                className="custom-radio-label"
              >
                <input
                  id={`disappearing-${option.value}`}
                  type="radio"
                  name="disappearing"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => handleChange(option.value)}
                  className="custom-radio-input"
                />
                <span className="custom-radio-circle"></span>
                <span style={{ fontSize: "1rem" }}>{option.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DisappearingMessages;
