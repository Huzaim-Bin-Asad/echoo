import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileInfoItem = ({ icon, label, value, onValueChange, type = 'text', placeholder, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const hasUpdated = useRef(false); // ✅ Prevent multiple submissions
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = async () => {
    if (hasUpdated.current) return; // ✅ Already updated, skip
    hasUpdated.current = true;

    if (inputValue !== value) {
      onValueChange(inputValue);
      const success = await updateUserProfile(inputValue);
      if (success) {
        navigate(-1);
      }
    }

    setIsEditing(false);
  };

  const handleFocus = () => {
    setIsEditing(true);
    hasUpdated.current = false; // ✅ Reset on new focus
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const updateUserProfile = async (newValue) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        console.error('No user data found in localStorage');
        return false;
      }

      if (id === 'name') {
        storedUser.full_name = newValue || '';
      } else if (id === 'about') {
        storedUser.about_message = newValue;
      } else {
        storedUser[id] = newValue;
      }

      const url = `https://echoo-backend.vercel.app/api/users/update`;
      await axios.put(url, storedUser);
      localStorage.setItem("user", JSON.stringify(storedUser));
      console.log('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
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
                onMouseDown={(e) => e.preventDefault()} // ✅ Prevent focus loss before click
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
