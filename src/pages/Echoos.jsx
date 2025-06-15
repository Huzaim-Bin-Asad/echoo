import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OpeningChat from "../components/OpeningChat/main/OpeningChat";
import LinkedDevices from "../components/OpeningChat/linkedDevices/LinkedDevices";
import StarredMessages from "../components/OpeningChat/StarredMessages";
import Chat from "../components/Chat/Chat";
import ContactedUserProfileDetails from "../components/OpeningChat/ContactedUserProfileDetails";
import useFirstTimeReload from "../hooks/useFirstTimeReload";

const Echoo = () => {
  useFirstTimeReload();

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
    const sender_id = localStorage.getItem("sender_id");
    const receiver_id = localStorage.getItem("receiver_id");
    const contact_id = localStorage.getItem("contact_id");

   // console.log("🟢 showChat() triggered — logging stored IDs:");
    console.log("sender_id:", sender_id);
    console.log("receiver_id:", receiver_id);
    console.log("contact_id:", contact_id);

    setActiveView("chat");
    setScrollTrigger(Date.now());
  };

  const showContactedProfile = () => {
    console.log("🔁 onProfileClick received in Echoo — switching to ContactedUserProfileDetails");
    setActiveView("profile");
  };

  const goBack = () => setActiveView("main");

  // Global function assignments
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
      {activeView === "chat" && (
        <Chat
          goBack={goBack}
          onProfileClick={showContactedProfile}
          scrollToBottomTrigger={scrollTrigger}
        />
      )}
{activeView === "profile" && (
  <ContactedUserProfileDetails
    onBack={({ from }) => {
      if (from === "ContactedUserProfileData") {
        console.log("🔙 Back from profile — switching to chat view");
        setActiveView("chat");
        setScrollTrigger(Date.now()); // Optional: re-scroll to bottom
      }
    }}
  />
)}
    </div>
  );
};

export default Echoo;
