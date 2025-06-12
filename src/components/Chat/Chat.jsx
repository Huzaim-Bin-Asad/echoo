import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import ChatDisplay from "./ChatDisplay";

function Chat(props) {
  const { goBack, onProfileClick, ...rest } = props;

  const [messages] = useState([]);
  const [scrollToBottomTrigger] = useState(false);
  const scrollContainerRef = useRef(null);

  // Log props
  useEffect(() => {
    console.log("Chat component mounted with the following props:");
    console.log("goBack function:", goBack?.toString?.() || goBack);
    console.log("onProfileClick function:", onProfileClick?.toString?.() || onProfileClick);
    console.log("Additional props:", rest);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [scrollToBottomTrigger]);

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
