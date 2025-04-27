import React, { useState } from 'react';

const ProfileInfoItem = ({ icon, label, value, onValueChange, type = 'text', placeholder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleEditClick = () => {
    setIsEditing(true); // Enable editing mode when clicked
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Update the input value as the user types
  };

  const handleSave = () => {
    setIsEditing(false); // Disable editing mode
    if (inputValue !== value) {
      onValueChange(inputValue); // Call onValueChange to notify the parent about the change
    }
  };

  return (
    <div className="d-flex align-items-start mb-4" onClick={!isEditing ? handleEditClick : undefined}>
      <div className="d-flex align-items-center">
        {icon} {/* Render the passed icon */}
      </div>
      <div>
        <small className="text-white">{label}</small>
        <div className="text-white">
          {isEditing ? (
            <div>
              <input
                type={type}
                value={inputValue}
                onChange={handleInputChange}
                className="form-control"
                placeholder={placeholder}
              />
              <button onClick={handleSave} className="btn btn-primary mt-2">Save</button>
            </div>
          ) : (
            <span>{value || 'Not provided'}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoItem;
