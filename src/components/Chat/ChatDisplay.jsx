import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, Paperclip, Mic, SendHorizontal } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '../../services/UserContext';

const isEmojiOnly = (text) => {
  const emojiRegex = /^[\p{Emoji}\s]+$/u;
  return emojiRegex.test(text.trim());
};

function ChatDisplay() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { user: contextUser } = useUser();
  const messageEndRef = useRef(null);
  const socketRef = useRef(null);
  const retryCountRef = useRef(0);
  const pendingMessagesRef = useRef([]);
  const isConnectingRef = useRef(false);
  const userIdRef = useRef(null); // Track userId to prevent unnecessary reconnections

  const formatMessage = useCallback((msg) => ({
    ...msg,
    text: msg.message_text,
    from: msg.sender_id === contextUser?.user?.user_id ? 'me' : 'them',
    isCurrentUser: msg.sender_id === contextUser?.user?.user_id,
  }), [contextUser]);

  const sendPendingMessages = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      while (pendingMessagesRef.current.length > 0) {
        const message = pendingMessagesRef.current.shift();
        socketRef.current.send(JSON.stringify(message));
      }
    }
  }, []);

  const setupWebSocket = useCallback(() => {
    const userId = contextUser?.user?.user_id;
    if (!userId) {
      console.warn('No user ID available for WebSocket connection');
      return;
    }

    // Prevent reinitialization if userId hasn’t changed
    if (userId === userIdRef.current && socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected for user:', userId);
      return;
    }

    if (isConnectingRef.current) {
      console.log('WebSocket connection already in progress');
      return;
    }

    if (socketRef.current) {
      console.log('Closing existing WebSocket');
      socketRef.current.close(1000, 'Normal closure');
      socketRef.current = null;
    }

    isConnectingRef.current = true;
    userIdRef.current = userId;
    const socket = new WebSocket("wss://echoo-backend-production.up.railway.app");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('✅ WebSocket connected for user:', userId);
      setIsConnected(true);
      retryCountRef.current = 0;
      isConnectingRef.current = false;

      socket.send(JSON.stringify({
        type: 'identify',
        user_id: userId
      }));

      sendPendingMessages();
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'messages') {
          const newMessages = data.payload?.messages?.map(formatMessage) || [];
          setMessages(prev => {
            const existingIds = new Set(prev.map(msg => msg.message_id || msg.temp_id));
            const filtered = newMessages.filter(msg => !existingIds.has(msg.message_id || msg.temp_id));
            return [...prev, ...filtered];
          });
        } else if (data.type === 'new_message') {
          const msg = data.payload;
          console.log('new_message:', { temp_id: msg.temp_id, message_id: msg.message_id, text: msg.message_text });
          setMessages(prev => {
            // Check for existing message by temp_id or matching content
            const existingIndex = prev.findIndex(m =>
              (m.temp_id && m.temp_id === msg.temp_id) ||
              (m.status === 'sending' && m.text === msg.message_text && m.sender_id === msg.sender_id &&
               Math.abs(new Date(m.timestamp) - new Date(msg.timestamp)) < 1000)
            );
            if (existingIndex !== -1) {
              // Update existing message
              return prev.map((m, index) =>
                index === existingIndex
                  ? { ...formatMessage(msg), message_id: msg.message_id, status: 'sent' }
                  : m
              );
            }
            // Add new message if no match (e.g., from another user)
            return [...prev, { ...formatMessage(msg), status: 'sent' }];
          });
        } else if (data.type === 'message_sent') {
          const { message_id, temp_id, savedMessage } = data.payload;
          console.log('message_sent:', { temp_id, message_id, text: savedMessage.message_text });
          setMessages(prev =>
            prev.map(msg =>
              msg.temp_id === temp_id
                ? { ...formatMessage(savedMessage), message_id, status: 'sent' }
                : msg
            )
          );
        } else if (data.type === 'read_receipt') {
          const { message_ids } = data.payload;
          setMessages(prev =>
            prev.map(msg =>
              message_ids.includes(msg.message_id) ? { ...msg, read_checker: 'read' } : msg
            )
          );
        } else if (data.type === 'error') {
          console.error('Server error:', data.payload);
          setMessages(prev =>
            prev.map(msg =>
              msg.status === 'sending' && msg.temp_id ? { ...msg, status: 'failed' } : msg
            )
          );
        } else if (data.type === 'pong') {
          console.log('🏓 Received pong from server');
          return; // Handle ping/pong for keep-alive
        }
      } catch (err) {
        console.error('Error processing message:', err);
      }
    };

    socket.onerror = (err) => {
      console.error('❌ WebSocket error:', err);
      setIsConnected(false);
      isConnectingRef.current = false;
    };

    socket.onclose = (event) => {
      console.log(`🔌 WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason || 'Unknown'}`);
      setIsConnected(false);
      isConnectingRef.current = false;

      const maxRetries = 5;
      if (retryCountRef.current >= maxRetries) {
        console.log('Max retries reached. Stopping reconnection attempts.');
        return;
      }

      const retryDelay = Math.min(2000 * Math.pow(2, retryCountRef.current), 30000);
      retryCountRef.current += 1;

      setTimeout(() => {
        console.log(`Reconnecting... Attempt ${retryCountRef.current}`);
        setupWebSocket();
      }, retryDelay);
    };

    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        console.log('Cleaning up WebSocket on unmount');
        socketRef.current.close(1000, 'Component unmount');
      }
      isConnectingRef.current = false;
    };
  }, [contextUser, formatMessage, sendPendingMessages]);

  useEffect(() => {
    const cleanup = setupWebSocket();
    return cleanup;
  }, [setupWebSocket]);

  const fetchMessages = useCallback(() => {
    if (!isConnected || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      const sender_id = contextUser?.user?.user_id;
      const receiverId = localStorage.getItem('receiver_id');
      if (sender_id && receiverId) {
        pendingMessagesRef.current.push({
          type: 'get_messages',
          sender_id,
          receiver_id: receiverId,
          limit: 50
        });
      }
      return;
    }

    const sender_id = contextUser?.user?.user_id;
    const receiverId = localStorage.getItem('receiver_id');

    if (!sender_id || !receiverId) {
      console.warn('Missing sender_id or receiverId for fetching messages');
      return;
    }

    try {
      socketRef.current.send(
        JSON.stringify({
          type: 'get_messages',
          sender_id,
          receiver_id: receiverId,
          limit: 50
        })
      );
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, [contextUser, isConnected]);

  useEffect(() => {
    if (isConnected) {
      fetchMessages();
    }
  }, [fetchMessages, isConnected]);

  // Ping server to keep connection alive
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        console.log('🏓 Sending ping to server');
        socketRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isConnected]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    const messageText = messageInput.trim();
    if (!messageText || !isConnected || !socketRef.current) {
      console.warn('Cannot send message: Not connected or empty message');
      return;
    }

    const sender_id = contextUser?.user?.user_id;
    const contact_id = localStorage.getItem('contact_id');
    const contact = contextUser.contacts?.find(c => c.contact_id === contact_id);
    const receiver_id = contact?.receiver_id;

    if (!sender_id || !contact_id || !receiver_id) {
      console.error('Missing required IDs:', { sender_id, contact_id, receiver_id });
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

    setMessages(prev => [...prev, {
      ...formatMessage(newMessage),
      status: 'sending'
    }]);
    setMessageInput('');

    if (socketRef.current.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(JSON.stringify({
          type: 'send_message',
          ...newMessage
        }));
      } catch (err) {
        console.error('Failed to send message:', err);
        setMessages(prev => prev.map(msg =>
          msg.temp_id === temp_id ? { ...msg, status: 'failed' } : msg
        ));
      }
    } else {
      pendingMessagesRef.current.push({
        type: 'send_message',
        ...newMessage
      });
    }
  };

  const sortedMessages = [...messages].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 overflow-auto p-2" style={{ background: '#f8f9fa' }}>
        {sortedMessages.map((msg) => {
          const isMe = msg.from === 'me';
          const emojiOnly = isEmojiOnly(msg.text);
          const isFailed = msg.status === 'failed';
          const isSending = msg.status === 'sending';
  
          return (
            <div
              key={msg.message_id || msg.temp_id}
              className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: emojiOnly ? '0' : '0.75rem 1rem',
                  backgroundColor: emojiOnly
                    ? 'transparent'
                    : isMe
                    ? '#DCF8C6'
                    : '#ffffff',
                  borderRadius: emojiOnly
                    ? '0'
                    : isMe
                    ? '20px 20px 0px 20px'
                    : '20px 20px 20px 0px',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  boxShadow: emojiOnly ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.1)',
                  marginBottom: '0.5rem',
                  opacity: isFailed ? 0.6 : isSending ? 0.8 : 1,
                  border: isFailed ? '1px dashed #ff6b6b' : 'none',
                }}
              >
                <div style={{ fontSize: emojiOnly ? '1.5rem' : '1rem' }}>
                  {msg.text}
                </div>
                <div
                  className="d-flex justify-content-end align-items-center gap-1 mt-1"
                  style={{ fontSize: '0.75rem', color: '#888' }}
                >
                  {isFailed && <span style={{ color: '#ff6b6b' }}>Failed</span>}
                  {isSending && <span>⌛</span>}
                  {!isSending && !isFailed && <span>✔</span>}
                  {!isSending &&
                    new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
  
      <div
        className="p-2 d-flex align-items-end flex-wrap position-relative"
        style={{
          backgroundColor: '#f8f9fa',
          border: 'none',
        }}
      >
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
              fontSize: '1rem',
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
            opacity: messageInput.trim() ? 1 : 0.7,
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
          <div className="w-100 mt-2">Media Options Component Here</div>
        )}
      </div>
    </div>
  );
}

export default ChatDisplay;