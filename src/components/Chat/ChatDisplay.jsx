import React from "react";

function ChatDisplay({ messages }) {
  return (
    <div className="flex-grow-1 overflow-auto p-2" style={{ background: "#f8f9fa" }}>
      {messages.map((msg, index) => {
        const isMe = msg.from === "me";
        const bubbleStyles = {
          maxWidth: '75%',
          marginLeft: isMe ? 'auto' : '0',
          marginRight: isMe ? '0' : 'auto',
          marginBottom: '0.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: isMe ? '#DCF8C6' : '#ffffff',
          borderRadius: isMe
            ? '20px 20px 0px 20px' // top-left, top-right, bottom-right, bottom-left
            : '20px 20px 20px 0px', // sender (left) — bottom-left is flat
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        };

        return (
          <div key={index} style={bubbleStyles}>
            {msg.text}
            <div style={{ fontSize: '0.75rem', color: '#888', textAlign: 'right', marginTop: '0.25rem' }}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatDisplay;
