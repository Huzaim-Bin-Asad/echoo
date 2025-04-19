import React from "react";
import { ChevronLeft } from "react-bootstrap-icons";

const Header = ({ goBack }) => {
  return (
    <>
      <div
        className="bg-dark"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1030,
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0 1rem',
          borderBottom: '1px solid #444',
        }}
        onClick={goBack}
      >
        <ChevronLeft
          size={24}
          className="me-2"
          style={{ cursor: 'pointer', color: 'white' }}
        />
        <h4 className="mb-0 text-white">Chats</h4>
      </div>
      {/* Spacer to push content below fixed header */}
      <div style={{ height: '50px' }} />
    </>
  );
};

export default Header;
