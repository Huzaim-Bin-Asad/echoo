import React from 'react';
import { Dropdown } from 'react-bootstrap'; // Bootstrap's Dropdown component

const DropdownMenu = () => {
  return (
    <Dropdown.Menu
      className="show"
      style={{
        position: 'absolute',
        top: '60px', // Adjust based on your header's height
        right: '20px', // Adjust position if needed
        borderRadius: '8px', // Average border radius
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1030,
      }}
    >
      <Dropdown.Item href="#delete" className="text-danger">
        Delete Call Log
      </Dropdown.Item>
      <Dropdown.Item href="#settings">
        Settings
      </Dropdown.Item>
    </Dropdown.Menu>
  );
};

export default DropdownMenu;
