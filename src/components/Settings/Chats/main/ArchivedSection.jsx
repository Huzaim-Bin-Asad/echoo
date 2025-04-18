import React from "react";

const ArchivedSection = () => {
  return (
    <div className="mb-4">
      <p className="fw-bold">Archived chats</p>
      <div className="ps-3">
        <p>Keep chats archived <span className="text-muted">Archived chats will remain archived when you receive a new message</span></p>
      </div>
    </div>
  );
};

export default ArchivedSection;
