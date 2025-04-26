import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OpeningChat from "../components/OpeningChat/main/OpeningChat";
import LinkedDevices from "../components/OpeningChat/linkedDevices/LinkedDevices";
import StarredMessages from "../components/OpeningChat/StarredMessages";
import Chat from "../components/Chat/Chat"; // Make sure the path is correct

const Echoo = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("main");

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
