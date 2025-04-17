import React from "react";
import { useNavigate } from "react-router-dom";
import CallHeader from "../components/Call/CallHeader";
import CallList from "../components/Call/CallList";
import BottomNav from "../components/Call/BottomNav";
import DropdownMenu from "../components/Call/DropdownMenu"; // assuming it's used in Call

const Call = () => {
  const navigate = useNavigate();

  // Handle navigation when the "Messages" icon is clicked
  const handleMessagesClick = () => {
    navigate("/echoo");
  };

  // Handle navigation to settings when "Settings" dropdown is clicked
  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <div className="bg-white text-light min-vh-100 d-flex flex-column justify-content-between">
      <div>
        <CallHeader />
        <CallList />
        <DropdownMenu onSettingsClick={handleSettingsClick} />
      </div>

      <BottomNav onMessagesClick={handleMessagesClick} />
    </div>
  );
};

export default Call;
