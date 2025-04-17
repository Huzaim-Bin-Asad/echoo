import React from 'react';
import { User } from 'lucide-react';  // This is the standard User icon
import { SwitchCamera } from 'lucide-react';  // This is the SwitchCamera icon

const ProfileImage = () => {
  return (
    <div className="position-relative d-flex justify-content-center mb-4">
      {/* Large Circular User Icon */}
      <User
        size={120}
        className="rounded-circle text-white"
        style={{
          backgroundColor: 'grey',
          padding: '10px',
          display: 'inline-block',
        }}
      />
      {/* Small Circular SwitchCamera Icon */}
      <div
        className="position-absolute bottom-0 bg-white rounded-circle d-flex justify-content-center align-items-center"
        style={{
          height: '34px',
          width: '34px',
          marginBottom: '5px',  // Adjusted for small spacing
          left: '60%',  // Adjusted to move the icon even more to the right
          zIndex: '1',
        }}
      >
        <SwitchCamera size={20} color="#121B22" />
      </div>
    </div>
  );
};

export default ProfileImage;
