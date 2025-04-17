import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OpeningChat from "../components/OpeningChat/main/OpeningChat";
import LinkedDevices from "../components/OpeningChat/linkedDevices/LinkedDevices";
import StarredMessages from "../components/OpeningChat/StarredMessages/index";

const Echoo = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("main"); // 'main', 'linked', 'starred'

  const handleCallClick = () => {
    navigate("/call");
  };

  const showLinkedDevices = () => setActiveView("linked");
  const showStarredMessages = () => setActiveView("starred");
  const goBack = () => setActiveView("main");

  // Expose globally (if needed from other components)
  window.showLinkedDevices = showLinkedDevices;
  window.showStarredMessages = showStarredMessages;

  return (
    <div
      className="bg-white container-fluid p-0"
      style={{
        maxWidth: "768px",
        margin: "0 auto",
        height: "120vh",
        border: "1px solid #ccc",
        overflow: "hidden",
      }}
    >
      {activeView === "main" && (
        <>
          <OpeningChat />
          <div
            className="d-flex justify-content-center align-items-center"
            onClick={handleCallClick}
            style={{ cursor: "pointer", marginTop: "20px" }}
          ></div>
        </>
      )}

      {activeView === "linked" && <LinkedDevices goBack={goBack} />}
      {activeView === "starred" && <StarredMessages goBack={goBack} />}
    </div>
  );
};

export default Echoo;
