import React from "react";

function MessageInput() {
  return (
    <div className="p-2 border-top d-flex align-items-center">
      <i className="bi bi-plus-circle mx-2"></i>
      <input
        type="text"
        className="form-control me-2"
        placeholder="Type something"
      />
      <i className="bi bi-camera mx-2"></i>
      <i className="bi bi-mic-fill text-success fs-5"></i>
    </div>
  );
}

export default MessageInput;
