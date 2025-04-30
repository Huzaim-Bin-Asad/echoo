import React, { useState } from "react";
import { Camera, Paperclip, Mic, SendHorizontal } from "lucide-react";
import MediaOptions from "./MediaOptions";

const MessageInput = ({ addMessage }) => {
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [message, setMessage] = useState("");

  const handlePaperclipClick = () => {
    setShowMediaOptions(!showMediaOptions);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = async () => {
    if (!message.trim()) return;
  
    const user = JSON.parse(localStorage.getItem("user"));
    const sender_id = user?.user_id;
    const contact_id = localStorage.getItem("selectedContactId");
  
    if (!sender_id || !contact_id) {
      console.error("Missing sender_id or contact_id");
      return;
    }
  
    const payload = {
      sender_id,
      contact_id,
      message_text: message.trim(),
      timestamp: new Date().toISOString(),
      read_checker: "unread",
    };
  
    try {
      const res = await fetch("http://localhost:5000/api/Send-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
  
      const savedMessage = await res.json(); // From backend
      addMessage({ from: "me", text: savedMessage.message_text, time: savedMessage.timestamp });
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err.message);
    }
  };
  

  return (
    <div
      className="p-2 d-flex align-items-end flex-wrap position-relative"
      style={{
        backgroundColor: "#f8f9fa",
        border: "none",
      }}
    >
      {/* Input container with Camera icon */}
      <div className="position-relative flex-grow-1 me-2 my-1">
        <Camera
          size={24}
          className="position-absolute ms-2 mt-2"
          style={{ color: "#6c757d", pointerEvents: "none" }}
        />

        <textarea
          rows={1}
          className="form-control ps-5 pe-5"
          placeholder="Type something"
          value={message}
          onChange={handleInputChange}
          style={{
            resize: "none",
            overflowY: "auto",
            maxHeight: "150px",
            backgroundColor: "white",
            borderRadius: "20px",
            border: "1px solid #ccc",
            paddingLeft: "2.5rem",
            paddingRight: "2.5rem",
            fontSize: "18px",
            lineHeight: "1.5",
          }}
        />

        {/* Paperclip icon on the right inside input */}
        <div className="position-absolute end-0 top-50 translate-middle-y me-3">
          <Paperclip
            size={24}
            style={{ color: "#6c757d", cursor: "pointer" }}
            onClick={handlePaperclipClick}
          />
        </div>
      </div>

      {/* Send or Mic icon */}
      <div
        className="rounded-circle bg-success d-flex align-items-center justify-content-center"
        style={{
          width: "48px",
          height: "48px",
          cursor: "pointer",
        }}
        id={message.trim() ? "send" : "mic"}
        onClick={message.trim() ? handleSendClick : null}
      >
        {message.trim() ? (
          <SendHorizontal size={24} color="white" />
        ) : (
          <Mic size={24} color="white" />
        )}
      </div>

      {/* Media options popup */}
      {showMediaOptions && <MediaOptions onClose={() => setShowMediaOptions(false)} />}
    </div>
  );
};

export default MessageInput;
