import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, Paperclip, Mic, SendHorizontal } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '../../services/UserContext';

const isEmojiOnly = (text) => {
  const emojiRegex = /^[\p{Emoji}\s]+$/u;
  return emojiRegex.test(text.trim());
};

function UnifiedChatComponent() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const { user: contextUser } = useUser();
  const messageEndRef = useRef(null); // To scroll to the bottom

  // Format message for display
  const formatMessage = useCallback((msg) => ({
    ...msg,
    text: msg.message_text,
    from: msg.sender_id === contextUser?.user?.user_id ? 'me' : 'them',
    isCurrentUser: msg.sender_id === contextUser?.user?.user_id,
  }), [contextUser]);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    const senderId = contextUser?.user?.user_id;
    const receiverId = localStorage.getItem('receiver_id');

    if (!senderId || !receiverId) return;

    try {
      const res = await fetch('http://localhost:5000/api/get-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: senderId, receiver_id: receiverId }),
      });

      const data = await res.json();
      if (data?.messages) {
        setMessages(prevMessages => {
          const newMessages = data.messages.map(formatMessage);
          // Only append new messages that don't already exist
          return [...prevMessages.filter(msg => !newMessages.some(newMsg => newMsg.temp_id === msg.temp_id)), ...newMessages];
        });
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, [contextUser, formatMessage]);

  // Set up interval to fetch messages every 0.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 500); // 500ms interval

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Scroll to the bottom
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Send message handler
  const handleSendMessage = async () => {
    const messageText = messageInput.trim();
    if (!messageText) return;

    const sender_id = contextUser?.user?.user_id;
    const contact_id = localStorage.getItem('contact_id');
    const contact = contextUser.contacts?.find(c => c.contact_id === contact_id);
    const receiver_id = contact?.receiver_id;

    if (!sender_id || !contact_id || !receiver_id) {
      console.error('Missing required IDs');
      return;
    }

    const temp_id = uuidv4();
    const timestamp = new Date().toISOString();

    const newMessage = {
      temp_id,
      message_text: messageText,
      contact_id,
      sender_id,
      receiver_id,
      timestamp,
      read_checker: 'unread',
    };

    setMessages(prev => [...prev, formatMessage(newMessage)]);
    setMessageInput(''); // Reset input field

    try {
      const res = await fetch('http://localhost:5000/api/Send-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const data = await res.json();
      setMessages(prev => prev.map(msg =>
        msg.temp_id === temp_id ? { ...msg, message_id: data.message_id } : msg
      ));
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => prev.map(msg =>
        msg.temp_id === temp_id ? { ...msg, failed: true } : msg
      ));
    }
  };

  // Scroll to the bottom whenever messages are updated
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sortedMessages = [...messages].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex-grow-1 overflow-auto p-2" style={{ background: '#f8f9fa' }}>
        {sortedMessages.map((msg) => {
          const isMe = msg.from === 'me';
          const emojiOnly = isEmojiOnly(msg.text);

          return (
            <div key={msg.message_id || msg.temp_id} style={{
              display: 'flex',
              justifyContent: isMe ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '70%',
                padding: emojiOnly ? '0' : '0.75rem 1rem',
                backgroundColor: emojiOnly ? 'transparent' : isMe ? '#DCF8C6' : '#ffffff',
                borderRadius: emojiOnly ? '0' : isMe ? '20px 20px 0px 20px' : '20px 20px 20px 0px',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                boxShadow: emojiOnly ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.1)',
                marginBottom: '0.5rem',
                opacity: msg.failed ? 0.6 : 1,
                border: msg.failed ? '1px dashed #ff6b6b' : 'none'
              }}>
                <div style={{ fontSize: emojiOnly ? '1.5rem' : '1rem' }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#888',
                  textAlign: 'right',
                  marginTop: '0.25rem',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {msg.failed && <span style={{ color: '#ff6b6b' }}>Failed</span>}
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <div className="p-2 d-flex align-items-end flex-wrap position-relative" style={{
        backgroundColor: '#f8f9fa',
        border: 'none',
      }}>
        <div className="position-relative flex-grow-1 me-2 my-1">
          <Camera
            size={24}
            className="position-absolute ms-2 mt-2"
            style={{ color: '#6c757d', pointerEvents: 'none' }}
          />

          <textarea
            rows={1}
            className="form-control ps-5 pe-5"
            placeholder="Type something"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            style={{
              resize: 'none',
              overflowY: 'auto',
              maxHeight: '150px',
              backgroundColor: 'white',
              borderRadius: '20px',
              border: '1px solid #ccc',
              paddingLeft: '2.5rem',
              paddingRight: '2.5rem',
              fontSize: '18px',
              lineHeight: '1.5',
            }}
          />

          <div className="position-absolute end-0 top-50 translate-middle-y me-3">
            <Paperclip
              size={24}
              style={{ color: '#6c757d', cursor: 'pointer' }}
              onClick={() => setShowMediaOptions(!showMediaOptions)}
            />
          </div>
        </div>

        <div
          className="rounded-circle bg-success d-flex align-items-center justify-content-center"
          style={{
            width: '48px',
            height: '48px',
            cursor: 'pointer',
            opacity: messageInput.trim() ? 1 : 0.7
          }}
          onClick={messageInput.trim() ? handleSendMessage : null}
        >
          {messageInput.trim() ? (
            <SendHorizontal size={24} color="white" />
          ) : (
            <Mic size={24} color="white" />
          )}
        </div>

        {showMediaOptions && (
          <div>Media Options Component Here</div>
        )}
      </div>
    </div>
  );
}

export default UnifiedChatComponent;
