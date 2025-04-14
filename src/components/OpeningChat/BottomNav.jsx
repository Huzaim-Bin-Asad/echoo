import React from 'react';
import { MessageCircleMore, CircleFadingArrowUp, Video, Phone, UserRoundPen } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="nav justify-content-around fixed-bottom py-2 bg-light shadow-sm border-top">
      <button className="nav-link text-primary border-0 bg-transparent p-0">
        <MessageCircleMore size={24} />
      </button>
      <button className="nav-link text-muted border-0 bg-transparent p-0">
        <CircleFadingArrowUp size={24} />
      </button>
      <button className="nav-link text-muted border-0 bg-transparent p-0">
        <Video size={24} />
      </button>
      <button className="nav-link text-muted border-0 bg-transparent p-0">
        <Phone size={24} />
      </button>
      <button className="nav-link text-muted border-0 bg-transparent p-0">
        <UserRoundPen size={24} />
      </button>
    </nav>
  );
};

export default BottomNav;
