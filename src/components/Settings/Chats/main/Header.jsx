import React from "react";
import { ChevronLeft } from "react-bootstrap-icons";

const Header = ({ goBack }) => {
  return (
    <div className="d-flex align-items-center mb-3" style={{ cursor: 'pointer' }} onClick={goBack}>
      <ChevronLeft size={24} className="me-2" />
      <h4 className="mb-0">Chats</h4>
    </div>
  );
};

export default Header;
