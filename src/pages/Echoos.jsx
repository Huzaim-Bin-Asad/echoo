import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OpeningChat from "../components/OpeningChat/main/OpeningChat";
import LinkedDevices from "../components/OpeningChat/linkedDevices/LinkedDevices";
import StarredMessages from "../components/OpeningChat/StarredMessages";
import Chat from "../components/Chat/Chat";
import useFirstTimeReload from "../hooks/useFirstTimeReload"; // ✅ import hook

const Echoo = () => {
  useFirstTimeReload(); // ✅ run the logic on mount

  const navigate = useNavigate();
  const storedView = localStorage.getItem("echoo_active_view");
  const [activeView, setActiveView] = useState(storedView || "main");
  const [scrollTrigger, setScrollTrigger] = useState(0);

  useEffect(() => {
    if (storedView === "chat") {
      setScrollTrigger(Date.now());
      localStorage.removeItem("echoo_active_view");
    }
  }, [storedView]);

  const handleCallClick = () => navigate("/call");
  const showLinkedDevices = () => setActiveView("linked");
  const showStarredMessages = () => setActiveView("starred");
  const showChat = () => {
    setActiveView("chat");
    setScrollTrigger(Date.now());
  };
  const goBack = () => setActiveView("main");

  // Expose for debug
  window.showLinkedDevices = showLinkedDevices;
  window.showStarredMessages = showStarredMessages;
  window.showChat = showChat;

  return (
    <div className="max-w-[768px] mx-auto bg-white border border-gray-300" style={{ minHeight: "100vh" }}>
      {activeView === "main" && (
        <>
          <OpeningChat />
          <div className="flex justify-center items-center mt-5 cursor-pointer" onClick={handleCallClick}></div>
        </>
      )}
      {activeView === "linked" && <LinkedDevices goBack={goBack} />}
      {activeView === "starred" && <StarredMessages goBack={goBack} />}
      {activeView === "chat" && <Chat goBack={goBack} scrollToBottomTrigger={scrollTrigger} />}
    </div>
  );
};

export default Echoo;
