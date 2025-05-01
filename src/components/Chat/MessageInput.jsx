import React, { useState } from "react";
import { Camera, Paperclip, Mic, SendHorizontal } from "lucide-react";
import MediaOptions from "./MediaOptions";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../../services/UserContext"; // 🔹 Use your context

const MessageInput = ({ addMessage, updateMessage }) => {
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [message, setMessage] = useState("");
  const { user: contextUser } = useUser(); // ✅ Top-level hook usage only

  const handlePaperclipClick = () => {
    setShowMediaOptions(!showMediaOptions);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = async () => {
    if (!message.trim()) return;

    const sender_id = contextUser?.user?.user_id;
    const contact_id = localStorage.getItem("contact_id");

    if (!sender_id || !contact_id) {
      console.error("❌ Missing sender_id or selected contact_id");
      return;
    }

    const contact = contextUser.contacts?.find(
      (c) => c.contact_id === contact_id
    );
    const receiver_id = contact?.receiver_id;

    if (!receiver_id) {
      console.error(
        "❌ Could not find receiver_id (contacted_id) for contact_id:",
        contact_id
      );
      return;
    }

    const message_text = message.trim();
    const timestamp = new Date().toISOString();
    const temp_id = uuidv4();

    const optimisticMessage = {
      temp_id,
      text: message_text,
      from: "me",
      time: timestamp,
    };
    addMessage(optimisticMessage);

    setMessage("");

    const payload = {
      sender_id,
      receiver_id,
      contact_id,
      message_text,
      timestamp,
      temp_id,
      read_checker: "unread",
    };

    console.log("📤 Sending message with payload:", payload);

    try {
      const res = await fetch("http://localhost:5000/api/Send-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      console.log("✅ Message sent successfully. Server response:", data);

      // Optional: updateMessage(temp_id, data.message_id);
    } catch (err) {
      console.error("❌ Error sending message:", err.message);
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

        <div className="position-absolute end-0 top-50 translate-middle-y me-3">
          <Paperclip
            size={24}
            style={{ color: "#6c757d", cursor: "pointer" }}
            onClick={handlePaperclipClick}
          />
        </div>
      </div>

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

      {showMediaOptions && (
        <MediaOptions onClose={() => setShowMediaOptions(false)} />
      )}
    </div>
  );
};

export default MessageInput;
