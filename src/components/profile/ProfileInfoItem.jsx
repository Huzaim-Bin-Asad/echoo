import React, { useState } from 'react';
import axios from 'axios'; // Make sure axios is installed

const ProfileInfoItem = ({ icon, label, value, onValueChange, type = 'text', placeholder, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = async () => {
    if (inputValue !== value) {
      onValueChange(inputValue); // Update the parent component
      await updateUserProfile(inputValue); // Send the updated full user object to the backend
    }
    setIsEditing(false);
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const updateUserProfile = async (newValue) => {
    try {
      // Get full user object from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        console.error('No user data found in localStorage');
        return;
      }
  
      // Update the specific field locally
      if (id === 'name') {
        const [first_name, last_name] = newValue.split(' ');
        storedUser.first_name = first_name || '';
        storedUser.last_name = last_name || '';
      } else if (id === 'about') {
        storedUser.about_message = newValue;
      } else {
        storedUser[id] = newValue;
      }
  
      const url = `http://localhost:5000/api/users/update`; // ✅ NEW URL: no userId in URL anymore
  
      await axios.put(url, storedUser); // ✅ Send the full updated object
      console.log('Profile updated successfully');
  
      // Update localStorage after backend update
      localStorage.setItem("user", JSON.stringify(storedUser));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  

  return (
    <div className="d-flex align-items-start mb-4">
      <div className="d-flex align-items-center">
        {icon}
      </div>
      <div>
        <small className="text-white">{label}</small>
        <div className="text-white">
          {isEditing ? (
            <div className="position-relative">
              <input
                id={id}
                type={type}
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                className="form-control bg-secondary text-white pe-5"
                placeholder={placeholder}
              />
              <button
                className="btn btn-link position-absolute end-0 top-0 p-0 m-0"
                onClick={handleBlur}
                style={{
                  height: '100%',
                  width: '40px',
                  color: 'white',
                  zIndex: 10,
                  background: 'transparent'
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
                  <path d="M6 12h16" />
                </svg>
              </button>
            </div>
          ) : (
            <span onClick={handleFocus} className="text-white" style={{ cursor: 'pointer' }}>
              {value || 'Click to edit'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoItem;
