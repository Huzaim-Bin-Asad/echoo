import React from 'react';
import { BellRing, Images, Sparkles } from 'lucide-react';

const ChatOptions = () => {
  const rowStyle = {
    paddingTop: '15px',
    paddingBottom: '14px',
  };

  return (
    <div
      className="d-flex flex-column bg-white rounded shadow-sm"
      style={{
        padding: "1.5rem",
        width: "calc(100% + 28px)",
        marginLeft: "-15px",
        marginTop: "10px",
        minHeight: "200px",
      }}
    >
      <div className="d-flex align-items-center" style={{  paddingBottom: '14px'}}>
        <BellRing className="me-3 text-primary" size={24} />
        <span className="fs-6">Notifications</span>
      </div>
      <div className="d-flex align-items-center" style={rowStyle}>
        <Images className="me-3 text-success" size={24} />
        <span className="fs-6">Media visibility</span>
      </div>
      <div className="d-flex align-items-center" style={rowStyle}>
        <Sparkles className="me-3 text-warning" size={24} />
        <span className="fs-6">Starred messages</span>
      </div>
      <div className="d-flex align-items-center mt-3">
        <span className="me-3 text-danger">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="lucide lucide-clock-fading">
            <path d="M12 2a10 10 0 0 1 7.38 16.75" />
            <path d="M12 6v6l4 2" />
            <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
            <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
            <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
            <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />
          </svg>
        </span>
        <span className="fs-6">Disappearing messages</span>
      </div>
    </div>
  );
};

export default ChatOptions;
