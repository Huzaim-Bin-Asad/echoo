import React from "react";
import Header from "./Header";
import ChatDisplay from "./ChatDisplay";
import MessageInput from "./MessageInput";

function Chat({ goBack }) {
  return (
    <div className="container d-flex flex-column border rounded shadow" style={{ maxWidth: '400px', height: '100vh' }}>
      <Header goBack={goBack} />
      <ChatDisplay />
      <MessageInput />
    </div>
  );
}

export default Chat;
