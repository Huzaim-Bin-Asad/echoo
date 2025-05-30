import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import ChatDisplay from "./ChatDisplay";

function Chat({ goBack }) {
  const [messages] = useState([]);
  const [scrollToBottomTrigger] = useState(false);
  const scrollContainerRef = useRef(null);


  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [scrollToBottomTrigger]);

  return (
    <div className="d-flex flex-column" style={{ height: '100vh', maxWidth: '768px', margin: '0 auto' }}>
      <Header goBack={goBack} />
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