import React from "react";

function Message({ from, text, image }) {
  const isMe = from === "me";
  return (
    <div className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"} mb-2`}>
      <div className={`p-2 rounded ${isMe ? "bg-success text-white" : "bg-light"}`} style={{ maxWidth: '75%' }}>
        {image && <img src={image} alt="attachment" className="img-fluid rounded mb-2" />}
        <div>{text}</div>
      </div>
    </div>
  );
}

export default Message;
