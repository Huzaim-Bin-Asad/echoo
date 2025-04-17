import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ProfileHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center mb-4">
      <button
        className="btn btn-link text-white p-0 me-3"
        onClick={() => navigate(-1)} // Navigate back one step in history
      >
        <ChevronLeft size={24} />
      </button>
      <h3 className="mb-0 text-white">Profile</h3>
    </div>
  );
};

export default ProfileHeader;
