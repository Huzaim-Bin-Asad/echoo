import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import ChatDisplay from "./ChatDisplay";
import MessageInput from "./MessageInput";

function Chat({ goBack }) {
  const [messages, setMessages] = useState([]);
  const [scrollToBottomTrigger, setScrollToBottomTrigger] = useState(false);
  const scrollContainerRef = useRef(null);

  const addMessage = (newMessage) => {
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setScrollToBottomTrigger(prev => !prev);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [scrollToBottomTrigger]);

  return (
    <div className="d-flex flex-column" style={{ height: '93vh', maxWidth: '768px', margin: '0 auto' }}>
      <Header goBack={goBack} />
      <div
        ref={scrollContainerRef}
        className="flex-grow-1 overflow-auto"
        style={{ backgroundColor: "#f8f9fa", padding: "1rem" }}
      >
        <ChatDisplay messages={messages} />
      </div>
      <MessageInput addMessage={addMessage} />
    </div>
  );
}

export default Chat;