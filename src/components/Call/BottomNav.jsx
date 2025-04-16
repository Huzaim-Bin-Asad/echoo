import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for routing
import {
  CircleFadingArrowUp,
  Video,
  Phone,
  UserRoundPen,
} from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();  // Initialize the navigate function

  // Handle navigation when the "Messages" button is clicked
  const handleMessagesClick = () => {
    navigate("/echoo");  // Redirect to the /echoo page
  };

  return (
    <nav
      className="nav justify-content-around fixed-bottom bg-light shadow-sm border-top"
      style={{
        padding: '15px 0',
        height: '85px', // slightly increased to fit text
      }}
    >
      {/* Messages button */}
      <button
        className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0"
        id="messages"  // Add ID for "Messages"
        style={{ flex: '1 1 0%' }}
        onClick={handleMessagesClick}  // Trigger navigation on click
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-more">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
          <path d="M8 12h.01"></path>
          <path d="M12 12h.01"></path>
          <path d="M16 12h.01"></path>
        </svg>
        <small className="text-muted">Messages</small>
      </button>

      {/* Status button */}
      <button
        className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0"
        id="status"  // Add ID for "Status"
        style={{ flex: '1 1 0%' }}
      >
        <CircleFadingArrowUp size={26} />
        <small>Status</small>
      </button>

      {/* Footage button */}
      <button
        className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0"
        id="footage"  // Add ID for "Footage"
        style={{ flex: '1 1 0%' }}
      >
        <Video size={26} />
        <small>Footage</small>
      </button>

      {/* Call button with icon and raised grey oval beneath it */}
      <button
        className="nav-link text-primary border-0 bg-transparent d-flex flex-column align-items-center p-0 position-relative"
        id="call"  // Add ID for "Call"
        style={{ flex: '1 1 0%' }}
      >
        {/* Raised light grey oval as the "bottom bread" */}
        <div
          style={{
            width: '60px',  // Adjust width of the oval
            height: '35px', // Height of the oval
            backgroundColor: '#d3d3d3', // Light grey color
            borderRadius: '25px', // Make it an oval
            position: 'absolute',
            top: '-5px', // Raised oval (adjust to move upward)
            zIndex: 0, // Place the oval behind the icon
          }}
        />
        <Phone size={26} style={{ zIndex: 1 }} />  {/* Phone icon on top of the oval */}
        <small className="text-primary" style={{ marginTop: '10px' }}>Call</small>  {/* Lowering the text */}
      </button>

      {/* Profile button */}
      <button
        className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0"
        id="profile"  // Add ID for "Profile"
        style={{ flex: '1 1 0%' }}
      >
        <UserRoundPen size={26} />
        <small>Profile</small>
      </button>
    </nav>
  );
};

export default BottomNav;
