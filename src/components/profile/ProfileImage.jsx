import React, { useRef, useState } from 'react';
import { User, SwitchCamera } from 'lucide-react';
import { useUser } from '../../services/UserContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ import useNavigate

const ProfileImage = () => {
  const { user, setUser } = useUser();
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // ✅ initialize navigate

  const [isUploading, setIsUploading] = useState(false);
  const profileImageUrl = user?.user?.profile_picture || null;
  const userId = user?.user?.user_id;

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || isUploading) return;
  
    // Instantly navigate back
    navigate(-1);
  
    const newImageUrl = URL.createObjectURL(file);
    setUser((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        profile_picture: newImageUrl,
      },
    }));
  
    setIsUploading(true);
  
    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('userId', userId);
  
    try {
      const response = await axios.post('http://localhost:5000/api/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const uploadedImageUrl = response.data.profilePictureUrl;
  
      if (uploadedImageUrl !== user?.user?.profile_picture) {
        setUser((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            profile_picture: uploadedImageUrl,
          },
        }));
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="position-relative d-flex justify-content-center mb-4">
      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt="Profile"
          className="rounded-circle"
          style={{
            width: '120px',
            height: '120px',
            objectFit: 'cover',
            padding: '10px',
            display: 'inline-block',
          }}
        />
      ) : (
        <User
          size={120}
          className="rounded-circle text-white"
          style={{
            backgroundColor: 'grey',
            padding: '10px',
            display: 'inline-block',
          }}
        />
      )}

      <div
        onClick={handleIconClick}
        className="position-absolute bottom-0 bg-white rounded-circle d-flex justify-content-center align-items-center"
        style={{
          height: '34px',
          width: '34px',
          marginBottom: '5px',
          left: '58%',
          zIndex: '1',
          cursor: 'pointer',
        }}
      >
        <SwitchCamera size={20} color="#121B22" />
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ProfileImage;
