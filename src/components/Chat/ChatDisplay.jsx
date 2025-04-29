import React from "react";
import Message from "./Message";

function ChatDisplay() {
  const messages = [
 
  ];

  return (
    <div className="flex-grow-1 overflow-auto p-2" style={{ background: "#f8f9fa" }}>
      {messages.map((msg, index) => (
        <Message key={index} from={msg.from} text={msg.text} image={msg.image} />
      ))}
    </div>
  );
}

export default ChatDisplay;
