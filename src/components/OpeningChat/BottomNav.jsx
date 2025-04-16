import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import {
  MessageCircleMore,
  CircleFadingArrowUp,
  Video,
  Phone,
  UserRoundPen,
} from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();  // Initialize the navigate function

  // Handle navigation when Call button is clicked
  const handleCallClick = () => {
    navigate('/call');  // Redirect to /call route
  };

  return (
    <nav
      className="nav justify-content-around fixed-bottom bg-light shadow-sm border-top"
      style={{
        padding: '15px 0',
        height: '85px',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {/* Messages button with grey oval beneath it */}
      <button className="nav-link text-primary border-0 bg-transparent d-flex flex-column align-items-center p-0 position-relative" style={{ flex: 1 }} id="messages">
        <div
          style={{
            width: '60px',
            height: '35px',
            backgroundColor: '#d3d3d3',
            borderRadius: '25px',
            position: 'absolute',
            top: '-5px',
            zIndex: 0,
          }}
        />
        <MessageCircleMore size={26} style={{ zIndex: 1, color: '#007bff' }} />
        <small className="text-primary" style={{ marginTop: '10px' }}>Messages</small>
      </button>

      {/* Other buttons */}
      <button className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0" style={{ flex: 1 }} id="status">
        <CircleFadingArrowUp size={26} />
        <small>Status</small>
      </button>
      <button className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0" style={{ flex: 1 }} id="footage">
        <Video size={26} />
        <small>Footage</small>
      </button>

      {/* Call button */}
      <button
        className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0"
        style={{ flex: 1 }}
        id="call"  // Ensure the id is present here
        onClick={handleCallClick}  // Add the onClick event to trigger navigation
      >
        <Phone size={26} />
        <small>Call</small>
      </button>

      <button className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0" style={{ flex: 1 }} id="profile">
        <UserRoundPen size={26} />
        <small>Profile</small>
      </button>
    </nav>
  );
};

export default BottomNav;
