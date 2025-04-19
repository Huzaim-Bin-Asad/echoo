import React from 'react';
import { ListGroup } from 'react-bootstrap';

const SettingItem = ({ icon, title, subtitle, onClick, style }) => {
  return (
    <ListGroup.Item
      className="bg-dark text-white rounded-2 d-flex align-items-center justify-content-between"
      onClick={onClick}
      style={{ ...style, border: 'none' }}
    >
      <div className="d-flex align-items-start gap-2">
        <div style={{ marginLeft: '-1rem', marginRight: '0.25rem' }} className="fs-4">
          {icon}
        </div>
        <div>
          <div className="fw-semibold">{title}</div>
          <div className="text-white small">{subtitle}</div>
        </div>
      </div>
      <span className="text-muted">&gt;</span> {/* optional arrow */}
    </ListGroup.Item>
  );
};

export default SettingItem;
