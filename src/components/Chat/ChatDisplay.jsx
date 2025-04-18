import React from "react";
import Message from "./Message";

function ChatDisplay() {
  const messages = [
    { from: "me", text: "I don’t think I can join later in the afternoon 😢" },
    { from: "Nina", text: "Really why can't it be? 😤" },
    { from: "me", image: "/chat-image.jpg", text: "Recap has not been completed" },
    { from: "Nina", text: "oh yeah already" },
    { from: "me", text: "I'm really sorry, next time" },
    { from: "me", text: "I don’t think I can join later in the afternoon 😢" },
    { from: "Nina", text: "Really why can't it be? 😤" },
    { from: "me", image: "/chat-image.jpg", text: "Recap has not been completed" },
    { from: "Nina", text: "oh yeah already" },
    { from: "me", text: "I'm really sorry, next time" } ,   { from: "me", text: "I don’t think I can join later in the afternoon 😢" },
    { from: "Nina", text: "Really why can't it be? 😤" },
    { from: "me", image: "/chat-image.jpg", text: "Recap has not been completed" },
    { from: "Nina", text: "oh yeah already" },
    { from: "me", text: "I'm really sorry, next time" }
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
