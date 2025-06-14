import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import ChatDisplay from "./ChatDisplay";

function Chat(props) {
  const { goBack, onProfileClick, messages: incomingMessages = [], ...rest } = props;

  const [messages, setMessages] = useState(incomingMessages);
  const [scrollToBottomTrigger] = useState(false);
  const scrollContainerRef = useRef(null);

  // 🔍 Log when messages prop is received
  useEffect(() => {
    console.log("💬 Chat component received props:");
    console.log("messages:", incomingMessages);
    console.log("other props:", rest);
  }, [incomingMessages]);

  // Safely update messages only if they actually changed
  useEffect(() => {
    if (JSON.stringify(messages) !== JSON.stringify(incomingMessages)) {
      setMessages(incomingMessages);
    }
  }, [incomingMessages]);

  // Scroll to bottom when messages or trigger changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [scrollToBottomTrigger, messages]);

  return (
    <div className="d-flex flex-column" style={{ height: '100vh', maxWidth: '768px', margin: '0 auto' }}>
      <Header goBack={goBack} onProfileClick={onProfileClick} />
      <div
        ref={scrollContainerRef}
        className="flex-grow-1 overflow-auto"
        style={{ backgroundColor: "#f8f9fa", padding: "1rem" }}
      >
        <ChatDisplay messages={messages} />
      </div>
    </div>
  );
}

export default Chat;
