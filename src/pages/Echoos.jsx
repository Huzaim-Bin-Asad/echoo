import React, {useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OpeningChat from "../components/OpeningChat/main/OpeningChat";
import LinkedDevices from "../components/OpeningChat/linkedDevices/LinkedDevices";
import StarredMessages from "../components/OpeningChat/StarredMessages";
import Chat from "../components/Chat/Chat";

const Echoo = () => {
  const navigate = useNavigate(); 
  const location = useLocation();

  const initialView = location.state?.openChat ? "chat" : "main";
  const [activeView, setActiveView] = useState(initialView);
  const [scrollTrigger, setScrollTrigger] = useState(0); // trigger scroll

  const handleCallClick = () => {
    navigate("/call");
  };

  const showLinkedDevices = () => setActiveView("linked");
  const showStarredMessages = () => setActiveView("starred");

  const showChat = () => {
    setActiveView("chat");
    setScrollTrigger(Date.now()); // force scroll
  };

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
            {/* Optional call-to-action */}
          </div>
        </>
      )}

      {activeView === "linked" && <LinkedDevices goBack={goBack} />}
      {activeView === "starred" && <StarredMessages goBack={goBack} />}
      {activeView === "chat" && <Chat goBack={goBack} scrollToBottomTrigger={scrollTrigger} />}
    </div>
  );
};

export default Echoo;
