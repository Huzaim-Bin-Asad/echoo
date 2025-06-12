import React from 'react';
import useNavRoute from '../../hooks/useNavRoute';  // Custom hook
import {
  CircleFadingArrowUp,
  Video,
  Phone,
  UserRoundPen,
} from 'lucide-react';

const BottomNav = () => {
  const navigateTo = useNavRoute(); // Use the custom hook

  return (
    <nav
      className="nav justify-content-around fixed-bottom bg-light shadow-sm border-top"
      style={{
        padding: '15px 0',
        height: '85px',
      }}
    >
      {/* Messages button */}
      <button
        className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0"
        id="messages"
        style={{ flex: '1 1 0%' }}
        onClick={navigateTo("/echoo")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-more">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
          <path d="M8 12h.01"></path>
          <path d="M12 12h.01"></path>
          <path d="M16 12h.01"></path>
        </svg>
        <small className="text-muted">Messages</small>
      </button>

      {/* Status button with blue icon and text */}
      <button
        className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0 position-relative"
        id="status"
        style={{ flex: '1 1 0%' }}
        onClick={navigateTo("/status")}
      >
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
        <CircleFadingArrowUp size={26} style={{ zIndex: 1, color: 'blue' }} />
        <small className="text-primary" style={{ marginTop: '10px', color: 'blue' }}>Status</small>
      </button>

      {/* Footage button */}
      <button
        className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0"
        id="footage"
        style={{ flex: '1 1 0%' }}
        onClick={navigateTo("/footage")}
      >
        <Video size={26} />
        <small>Footage</small>
      </button>

      {/* Call button */}
      <button
        className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0 position-relative"
        id="call"
        style={{ flex: '1 1 0%' }}
        onClick={navigateTo("/call")}
      >
        <Phone size={26} />
        <small className="text-muted" style={{ marginTop: '0px' }}>Call</small>
      </button>


    </nav>
  );
};

export default BottomNav;
