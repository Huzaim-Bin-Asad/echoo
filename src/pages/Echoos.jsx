import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OpeningChat from "../components/OpeningChat/main/OpeningChat";
import LinkedDevices from "../components/OpeningChat/linkedDevices/LinkedDevices";
import StarredMessages from "../components/OpeningChat/StarredMessages";
import Chat from "../components/Chat/Chat";

const Echoo = () => {
  const navigate = useNavigate(); 
  const location = useLocation();

  // ✅ Use location state to decide initial view
  const initialView = location.state?.openChat ? "chat" : "main";
  const [activeView, setActiveView] = useState(initialView);

  const handleCallClick = () => {
    navigate("/call");
  };

  const showLinkedDevices = () => setActiveView("linked");
  const showStarredMessages = () => setActiveView("starred");
  const showChat = () => setActiveView("chat");
  const goBack = () => setActiveView("main");

  // Expose globally
  window.showLinkedDevices = showLinkedDevices;
  window.showStarredMessages = showStarredMessages;
  window.showChat = showChat;

  return (
    <div className="max-w-[768px] mx-auto min-h-screen bg-white border border-gray-300">
      {activeView === "main" && (
        <>
          <OpeningChat />
          <div
            className="flex justify-center items-center mt-5 cursor-pointer"
            onClick={handleCallClick}
          >
            {/* Add something visual like a button/icon if needed */}
          </div>
        </>
      )}

      {activeView === "linked" && <LinkedDevices goBack={goBack} />}
      {activeView === "starred" && <StarredMessages goBack={goBack} />}
      {activeView === "chat" && <Chat goBack={goBack} />}
    </div>
  );
};

export default Echoo;
