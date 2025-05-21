import React from "react";

const StatusImage = () => {
  return (
    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
      <img
        src="https://via.placeholder.com/300x500"
        alt="Status"
        className="img-fluid rounded"
        style={{ maxHeight: "80%", objectFit: "cover" }}
      />
    </div>
  );
};

export default StatusImage;
