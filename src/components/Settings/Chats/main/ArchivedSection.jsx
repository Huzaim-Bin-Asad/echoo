import React from "react";

const ArchivedSection = () => {
  return (
    <div className="mb-4 border-bottom border-secondary-subtle pb-3 mt-3">
      <p className="fw-semibold text-secondary" style={{ marginLeft: "25px" }}>Archived chats</p>
      <div className="ps-3">
        <div className="d-flex justify-content-between align-items-start mb-2 ms-4">
          <div>
            <p className="mb-1 fs-6">Keep chats archived</p>
            <small className="text-secondary">
              Archived chats will remain archived when you receive a new message
            </small>
          </div>
          <div className="form-check form-switch" style={{ transform: "scale(1.4)", marginRight: "8px", marginTop: "20px" }}>
            <input className="form-check-input" type="checkbox" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivedSection;
