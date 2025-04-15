import React from 'react';
import { User } from 'lucide-react';

const ContactItem = ({ name, message, selected }) => (
  <div
    className={`d-flex align-items-center px-3 py-2 ${selected ? 'bg-secondary bg-opacity-50 rounded' : ''}`}
    style={{ cursor: 'pointer' }}
  >
    <div
      className="bg-secondary rounded-circle d-flex justify-content-center align-items-center"
      style={{ width: 50, height: 50 }}
    >
      <User size={24} color="white" />
    </div>

    <div className="d-flex flex-column ms-3" style={{ flex: 1 }}>
      <div className="fw-bold">{name}</div>
      {message && <small className="text-white" style={{ opacity: 0.8 }}>{message}</small>}
    </div>
  </div>
);

export default ContactItem;
