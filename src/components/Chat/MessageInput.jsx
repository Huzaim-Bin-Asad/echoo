import React, { useState } from "react";
import { Camera, Paperclip, Mic, SendHorizontal } from "lucide-react"; // Import SendHorizontal
import MediaOptions from "./MediaOptions"; // Import MediaOptions

const MessageInput = ({ addMessage }) => {
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [message, setMessage] = useState(""); // State to track the input message

  // Toggle media options visibility
  const handlePaperclipClick = () => {
    setShowMediaOptions(!showMediaOptions);
  };

  // Handle text input change
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  // Handle send message logic (for example, sending the message)
  const handleSendClick = () => {
    if (message.trim()) {
      const newMessage = { from: "me", text: message.trim() };
      addMessage(newMessage); // Add new message to the chat
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div
      className="p-2 d-flex align-items-center flex-wrap position-relative"
      style={{
        backgroundColor: "#f8f9fa", // Transparent background
        border: "none", // No borders for container
      }}
    >
      {/* Input with Camera icon inside */}
      <div className="position-relative flex-grow-1 me-2 my-1 d-flex align-items-center">
        {/* Camera icon inside the input field */}
        <Camera
          size={24}
          className="position-absolute ms-2"
          style={{ color: "#6c757d", pointerEvents: "none" }}
        />

        {/* Input field */}
        <input
          type="text"
          className="form-control ps-5"
          placeholder="Type something"
          value={message} // Bind input value to the state
          onChange={handleInputChange} // Update message state on change
          style={{
            minWidth: 0,
            backgroundColor: "white", // Transparent background
            borderRadius: "20px", // Rounded corners
            border: "1px solid white", // Light border for input (for placeholder)
            paddingLeft: "2rem", // Space for camera icon
            fontSize: "18px", // Larger font size
          }}
        />

        {/* Paperclip inside the input (right side) */}
        <div className="position-absolute end-0 d-flex align-items-center me-3">
          <Paperclip
            size={24}
            style={{ color: "#6c757d", cursor: "pointer" }}
            onClick={handlePaperclipClick} // Trigger media options display
          />
        </div>
      </div>

      {/* Conditionally render Microphone or Send icon */}
      <div
        className="rounded-circle bg-success d-flex align-items-center justify-content-center"
        style={{
          width: "48px",
          height: "48px",
          cursor: "pointer",
        }}
        id={message.trim() ? "send" : "mic"} // Set ID based on message state
        onClick={message.trim() ? handleSendClick : null} // Send message if text is present
      >
        {message.trim() ? (
          <SendHorizontal size={24} color="white" />
        ) : (
          <Mic size={24} color="white" />
        )}
      </div>

      {/* Display media options when Paperclip is clicked */}
      {showMediaOptions && <MediaOptions onClose={() => setShowMediaOptions(false)} />}
    </div>
  );
};

export default MessageInput;
