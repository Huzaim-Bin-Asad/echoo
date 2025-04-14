import React from 'react';
import {
  MessageCircleMore,
  CircleFadingArrowUp,
  Video,
  Phone,
  UserRoundPen,
} from 'lucide-react';

const BottomNav = () => {
  return (
    <nav
      className="nav justify-content-around fixed-bottom bg-light shadow-sm border-top"
      style={{
        padding: '15px 0',
        height: '85px', // slightly increased to fit text
      }}
    >
      <button className="nav-link text-primary border-0 bg-transparent d-flex flex-column align-items-center p-0">
        <MessageCircleMore size={26} />
        <small className="text-primary">Messages</small>
      </button>
      <button className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0">
        <CircleFadingArrowUp size={26} />
        <small>Status</small>
      </button>
      <button className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0">
        <Video size={26} />
        <small>Footage</small>
      </button>
      <button className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0">
        <Phone size={26} />
        <small>Call</small>
      </button>
      <button className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0">
        <UserRoundPen size={26} />
        <small>Profile</small>
      </button>
    </nav>
  );
};

export default BottomNav;
