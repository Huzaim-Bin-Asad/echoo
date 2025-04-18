import React from "react";
import Header from "./Header";
import ChatDisplay from "./ChatDisplay";
import MessageInput from "./MessageInput";

function Chat({ goBack }) {
  return (
    <div className="d-flex flex-column vh-100">
      <Header goBack={goBack} />
      <ChatDisplay />
      <MessageInput />
    </div>
  );
}

export default Chat;
