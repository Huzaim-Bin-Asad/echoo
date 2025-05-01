import React, { useEffect, useState } from "react";

// Regex to detect emoji-only messages (basic version)
const isEmojiOnly = (text) => {
  const emojiRegex = /^[\p{Emoji}\s]+$/u;
  return emojiRegex.test(text.trim());
};

function ChatDisplay() {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Load current user from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setCurrentUser(userData);
      console.log("Current user loaded:", userData);
    } else {
      console.warn("No user data found in localStorage under 'user'");
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      const target = document.querySelector('.flex-grow-1.overflow-auto');
      if (!target) return;

      // Retrieve sender and receiver IDs from localStorage and convert to number
      const senderId = localStorage.getItem("sender_id");
      const receiverId = localStorage.getItem("receiver_id");
      
      if (!senderId || !receiverId) {
        console.warn("Missing sender_id or receiver_id in localStorage");
        return;
      }

      console.log(`Fetching messages between ${senderId} (sender) and ${receiverId} (receiver)`);

      fetch('http://localhost:5000/api/get-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender_id: senderId, receiver_id: receiverId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data || !Array.isArray(data.messages)) {
            console.warn("Invalid response format:", data);
            return;
          }

          const formatted = data.messages.map((msg) => {
            const isCurrentUser = msg.sender_id === senderId;
            return {
              ...msg,
              text: msg.message_text,
              time: msg.timestamp,
              from: isCurrentUser ? "me" : "them",
              isCurrentUser,
            };
          });

          // Only update state if messages have changed
          if (JSON.stringify(messages) !== JSON.stringify(formatted)) {
            setMessages(formatted);
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
        });
    }, 500);

    return () => clearInterval(interval);
  }, [currentUser, messages]);

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

              {/* Debug info (only shown in development) */}
              {process.env.NODE_ENV === 'development' && (
                <div style={{
                  fontSize: '0.65rem',
                  color: '#bbb',
                  marginTop: '0.25rem',
                  textAlign: 'right',
                }}>
                  <div>Sender: {msg.sender_id}</div>
                  <div>Receiver: {msg.receiver_id}</div>
                  <div>Direction: {msg.from}</div>
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
