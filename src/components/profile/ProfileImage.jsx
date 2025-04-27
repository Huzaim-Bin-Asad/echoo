import React, { useRef, useState } from 'react';
import { User, SwitchCamera } from 'lucide-react';
import { useUser } from '../../services/UserContext.jsx';
import axios from 'axios';

const ProfileImage = () => {
  const { user, setUser } = useUser();
  const fileInputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false); // Track upload status
  const profileImageUrl = user?.user?.profile_picture || null;
  const userId = user?.user?.user_id; // Extract user_id from context (localStorage)

  const handleIconClick = () => {
    fileInputRef.current.click(); // Trigger file input when camera icon clicked
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // If uploading is in progress, don't proceed further
    if (isUploading) return;

    // Temporarily show the new image in the UI before the upload is finished
    const newImageUrl = URL.createObjectURL(file); // Local preview of the image
    setUser((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        profile_picture: newImageUrl, // Set the local image preview
      },
    }));
    setIsUploading(true); // Start the uploading state

    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('userId', userId); // Send userId too

    try {
      const response = await axios.post('http://localhost:5000/api/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedImageUrl = response.data.profilePictureUrl;

      // Only update the user profile image if the URL has changed
      if (uploadedImageUrl !== user?.user?.profile_picture) {
        setUser((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            profile_picture: uploadedImageUrl, // Update with Cloudinary URL
          },
        }));
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      // Optionally, you could reset the profile picture to the old one if needed
    } finally {
      setIsUploading(false); // Reset the upload status
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

      {/* Hidden file input */}
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
