import React from "react";
import { FolderCode, History } from "lucide-react";

const ChatGeneralSection = () => {
  return (
    <div className="mb-3 mt-3">
      <p
        className="fw-semibold text-secondary"
        style={{ marginLeft: "16px", fontSize: "0.95rem" }}
      >
        Chat General
      </p>
      <div className="ps-3">
        <div className="d-flex align-items-start mb-4">
          <FolderCode size={24} className="me-2 mt-1" />
          <div className="ms-1">
            <p className="mb-1" style={{ fontSize: "1rem" }}>Chat Backup</p>
            <small className="text-secondary" style={{ fontSize: "0.75rem" }}>
              Backup your chats to the cloud
            </small>
          </div>
        </div>

        <div className="d-flex align-items-start mb-2">
          <History size={22} className="me-3 mt-1" />
          <p className="mb-0" style={{ fontSize: "1rem" }}>Chat History</p>
        </div>
      </div>
    </div>
  );
};

export default ChatGeneralSection;
