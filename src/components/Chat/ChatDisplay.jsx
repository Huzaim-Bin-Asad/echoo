import React from "react";

// Regex to detect emoji-only messages (basic version)
const isEmojiOnly = (text) => {
  const emojiRegex = /^[\p{Emoji}\s]+$/u;
  return emojiRegex.test(text.trim());
};

function ChatDisplay({ messages }) {
  return (
    <div className="flex-grow-1 overflow-auto p-2" style={{ background: "#f8f9fa" }}>
      {messages.map((msg, index) => {
        const isMe = msg.from === "me";
        const emojiOnly = isEmojiOnly(msg.text);

        const wrapperStyle = {
          display: "flex",
          justifyContent: isMe ? "flex-end" : "flex-start",
        };

        const bubbleStyles = {
          maxWidth: '70%',
          padding: emojiOnly ? '0' : '0.75rem 1rem',
          backgroundColor: emojiOnly ? 'transparent' : isMe ? '#DCF8C6' : '#ffffff',
          borderRadius: emojiOnly
            ? '0'
            : isMe
              ? '20px 20px 0px 20px'
              : '20px 20px 20px 0px',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          boxShadow: emojiOnly ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.1)',
          textAlign: emojiOnly ? 'left' : 'inherit',
          marginBottom: '0.5rem',
        };

        return (
          <div key={index} style={wrapperStyle}>
            <div style={bubbleStyles} data-temp-id={msg.temp_id}>
              <div style={{ fontSize: emojiOnly ? '1.5rem' : '1rem' }}>
                {msg.text}
              </div>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#888',
                  textAlign: emojiOnly ? 'left' : 'right',
                  marginTop: '0.25rem',
                }}
              >
                {msg.time
                  ? new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>

              {/* Optional debug info */}
              {msg.message_id && msg.sender_id && !emojiOnly && (
                <div
                  style={{
                    fontSize: '0.65rem',
                    color: '#bbb',
                    marginTop: '0.25rem',
                    textAlign: 'right',
                  }}
                >
                  <div>msg_id: {msg.message_id}</div>
                  <div>sender: {msg.sender_id}</div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatDisplay;
