import React, { useEffect, useState } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../services/UserContext'; // Import the custom hook to access UserContext

const Header = () => {
  const navigate = useNavigate(); // Get the navigation function
  const { user, loading } = useUser(); // Access user data from the UserContext
  const [contactCount, setContactCount] = useState(0); // Local state for contact count

  const handleBack = () => {
    navigate('/echoo'); // Navigate to /echoo when back is clicked
  };

  // Update the contact count when user data is available
  useEffect(() => {
    if (user && user.contacts) {
      setContactCount(user.contacts.length); // Set the contact count from the user's contacts
    }
  }, [user]); // Only re-run when user data changes

  return (
    <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom border-secondary bg-dark text-white position-sticky top-0 z-1">
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-link text-white p-0 m-0" onClick={handleBack}>
          <ChevronLeft size={24} />
        </button>
        <div>
          <h6 className="mb-0 fw-semibold">Select contact</h6>
          <small className="text-white" style={{ opacity: 0.75 }}>
            {loading ? "Loading..." : `${contactCount} contacts`} {/* Show loading state */}
          </small>
        </div>
      </div>
      <button className="btn btn-link text-white p-0 m-0">
        <Search size={20} />
      </button>
    </div>
  );
};

export default Header;
