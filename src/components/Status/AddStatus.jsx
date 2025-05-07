import React from 'react';
import { User, Plus } from 'lucide-react';
import { useUser } from '../../services/UserContext'; // Adjust path as needed

const AddStatus = () => {
  const { user } = useUser(); // user.user.profile_picture is the actual image path
  const profileImageUrl = user?.user?.profile_picture;

  return (
    <div className="px-3 pt-3">
      <h5 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>Status</h5>
      <div 
        className="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm"
        style={{
          border: '1px solid rgba(0,0,0,0.05)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
      >
        <div className="position-relative">
          <div 
            className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center bg-light" 
            style={{ width: 56, height: 56 }}
          >
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt="My Status" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <div 
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #6c757d, #495057)',
                }}
              >
                <User color="white" size={28} />
              </div>
            )}
          </div>
          <div
            className="position-absolute bg-primary rounded-circle d-flex justify-content-center align-items-center shadow-sm"
            style={{ 
              width: 22, 
              height: 22, 
              bottom: 0, 
              right: 0,
              border: '2px solid white'
            }}
          >
            <Plus color="white" size={14} />
          </div>
        </div>
        <div className="ms-3">
          <strong style={{ fontSize: '0.95rem' }}>My Status</strong>
          <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>Tap to add status update</p>
        </div>
      </div>
    </div>
  );
};

export default AddStatus;
