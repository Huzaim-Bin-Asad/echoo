// MessageInput.js
import React, { useState } from "react";
import { Smile, Camera, Paperclip, Mic } from "lucide-react";
import MediaOptions from "./MediaOptions"; // Import MediaOptions

const MessageInput = () => {
  const [showMediaOptions, setShowMediaOptions] = useState(false);

  // Toggle media options visibility
  const handlePaperclipClick = () => {
    setShowMediaOptions(!showMediaOptions);
  };

  return (
    <div className="p-2 border-top d-flex align-items-center flex-wrap position-relative">
      {/* Input with Smile icon inside */}
      <div className="position-relative flex-grow-1 me-2 my-1 d-flex align-items-center">
        {/* Smile icon inside the input field */}
        <Smile
          size={20}
          className="position-absolute ms-2"
          style={{ color: "#6c757d", pointerEvents: "none" }}
        />

        {/* Input field */}
        <input
          type="text"
          className="form-control ps-5"
          placeholder="Type something"
          style={{ minWidth: 0 }}
        />

        {/* Camera and Paperclip inside the input (right side) */}
        <div className="position-absolute end-0 d-flex align-items-center me-3">
          <Camera
            size={20}
            style={{ color: "#6c757d", pointerEvents: "none" }}
          />
          <Paperclip
            size={20}
            className="ms-2"
            style={{ color: "#6c757d", cursor: "pointer" }}
            onClick={handlePaperclipClick} // Trigger media options display
          />
        </div>
      </div>

      {/* Microphone in a circular button */}
      <div
        className="rounded-circle bg-success d-flex align-items-center justify-content-center"
        style={{ width: "36px", height: "36px", cursor: "pointer" }}
      >
        <Mic size={20} color="white" />
      </div>

      {/* Display media options when Paperclip is clicked */}
      {showMediaOptions && <MediaOptions onClose={() => setShowMediaOptions(false)} />}
    </div>
  );
};

export default MessageInput;
