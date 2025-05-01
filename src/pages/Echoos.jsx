import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OpeningChat from "../components/OpeningChat/main/OpeningChat";
import LinkedDevices from "../components/OpeningChat/linkedDevices/LinkedDevices";
import StarredMessages from "../components/OpeningChat/StarredMessages";
import Chat from "../components/Chat/Chat";

const Echoo = () => {
  const navigate = useNavigate(); 
  const storedView = localStorage.getItem("echoo_active_view");
  const [activeView, setActiveView] = useState(storedView || "main");
  const [scrollTrigger, setScrollTrigger] = useState(0); // trigger scroll

  useEffect(() => {
    if (storedView === "chat") {
      setScrollTrigger(Date.now()); // scroll chat to bottom
      localStorage.removeItem("echoo_active_view"); // prevent chat from showing on refresh
    }
  }, [storedView]);

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

  // Expose globally for debugging or navigation
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
      {activeView === "chat" && (
        <Chat goBack={goBack} scrollToBottomTrigger={scrollTrigger} />
      )}
    </div>
  );
};

export default Echoo;
