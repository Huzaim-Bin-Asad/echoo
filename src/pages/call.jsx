import React from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate for routing
import CallHeader from "../components/Call/CallHeader";
import CallList from "../components/Call/CallList";
import BottomNav from "../components/Call/BottomNav";

const Call = () => {
  const navigate = useNavigate();  // Initialize the navigate function

  // Handle navigation when the "Messages" icon is clicked
  const handleMessagesClick = () => {
    navigate("/echoo");  // Redirect to the /echoo page
  };

  console.log("Call component loaded");  // Check if the Call component is rendered

  return (
    <div className="bg-white text-light min-vh-100 d-flex flex-column justify-content-between">
      <div>
        <CallHeader />
        <CallList />
      </div>
      
      {/* Pass the handleMessagesClick function to the BottomNav component */}
      <BottomNav onMessagesClick={handleMessagesClick} />
    </div>
  );
};

export default Call;
