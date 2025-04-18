import React from "react";

const ChatSettingsSection = () => {
  return (
    <div className="mb-4">
      <p className="fw-bold">Chat settings</p>
      <div className="ps-3">
        <p>Enter is send <span className="text-muted">Enter key will send your message</span></p>
        <p>Media visibility <span className="text-muted">Show newly downloaded media in your device's gallery</span></p>
        <p>Font size <span className="text-muted">Small</span></p>
        <p>Voice message transcripts <span className="text-muted">Read new voice messages.</span></p>
      </div>
    </div>
  );
};

export default ChatSettingsSection;
