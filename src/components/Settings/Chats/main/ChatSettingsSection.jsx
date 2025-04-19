import React from "react";

const ChatSettingsSection = () => {
  return (
    <div className="mb-4 border-bottom border-secondary-subtle pb-3 mt-3">
      <p className="fw-semibold text-secondary" style={{ marginLeft: "25px" }}>Chat settings</p>
      <div className="ps-3">
        <div className="d-flex justify-content-between align-items-start mb-4 ms-4">
          <div>
            <p className="mb-1 fs-6">Enter is send</p>
            <small className="text-secondary">Enter key will send your message</small>
          </div>
          <div className="form-check form-switch" style={{ transform: "scale(1.4)", marginRight: "8px", marginTop: "25px" }}>
            <input className="form-check-input" type="checkbox" />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-start mb-4 ms-4">
          <div>
            <p className="mb-1 fs-6">Media visibility</p>
            <small className="text-secondary">Show new downloaded media in your device's gallery</small>
          </div>
          <div className="form-check form-switch" style={{ transform: "scale(1.4)", marginRight: "8px", marginTop: "28px" }}>
            <input className="form-check-input" type="checkbox" />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-start mb-4 ms-4">
          <div>
            <p className="mb-1 fs-6">Font size</p>
            <small className="text-secondary">Small</small>
          </div>
          <div className="form-check form-switch" style={{ transform: "scale(1.4)", marginRight: "8px" }}>
            {/* Empty toggle block for symmetry */}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-start mb-2 ms-4">
          <div>
            <p className="mb-1 fs-6">Voice message transcripts</p>
            <small className="text-secondary">Read new voice messages.</small>
          </div>
          <div className="form-check form-switch" style={{ transform: "scale(1.4)", marginRight: "8px", marginTop: "20px" }}>
            <input className="form-check-input" type="checkbox" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSettingsSection;
