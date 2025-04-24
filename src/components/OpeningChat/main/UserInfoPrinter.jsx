import React, { useEffect, useRef } from 'react';
import { useUser } from '../../../services/UserContext'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';
import ChatList from './ChatList'; // Import ChatList

const UserInfoPrinter = () => {
  const { user, loading } = useUser(); // Getting user data from context
  const navigate = useNavigate();
  const printCount = useRef(0); // Reference to count the number of times we print user data

  useEffect(() => {
    // When user data is updated and loading is complete
    if (user && !loading) {
      printCount.current += 1;

      // Print to console every 10 context updates
      if (printCount.current % 10 === 0) {
        console.log("🖨️ [UserInfoPrinter] Current user data:", user);
      }
    }
  }, [user, loading]);

  // Check if chat preview exists (replace `user.chatPreview` with your actual path)
  const chatPreview = user ? user.chat_previews : null;
  console.log("chatPreview:", chatPreview);  // Added for debugging


  return (
    <div className="flex-grow-1 overflow-auto p-3">
      {/* Display user information with elegance */}
      <div className="mb-3">
 
      </div>

      {/* If there is no chat preview, show a "Start Conversation" link */}
      {!chatPreview || chatPreview.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <p>You haven’t started any conversations yet.</p>
          <p>
            <strong>Start a conversation</strong> by clicking{" "}
            <a
              href="/new-contact"
              onClick={(e) => {
                e.preventDefault(); // Prevent page reload
                navigate('/new-contact'); // Redirect programmatically
              }}
              className="link-primary"
            >
              here
            </a>
            .
          </p>
        </div>
      ) : (
        // If there is chat data, display it
        <ChatList visible={true} />
      )}
    </div>
  );
};

export default UserInfoPrinter;
