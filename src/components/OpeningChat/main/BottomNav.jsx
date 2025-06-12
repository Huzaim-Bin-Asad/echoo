import React from "react";
import useNavRoute from "../../../hooks/useNavRoute"; // Custom hook
import {
  MessageCircleMore,
  CircleFadingArrowUp,
  Video,
  Phone,
  UserRoundPen,
} from "lucide-react";

const BottomNav = () => {
  const navigateTo = useNavRoute(); // Use custom hook

  return (
    <nav
      className="nav justify-content-around fixed-bottom bg-light shadow-sm border-top"
      style={{
        padding: "15px 0",
        height: "85px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {/* Messages */}
      <button
        className="nav-link text-primary border-0 bg-transparent d-flex flex-column align-items-center p-0 position-relative"
        style={{ flex: 1 }}
        id="messages"
        onClick={navigateTo("/echoo")}
      >
        <div
          style={{
            width: "60px",
            height: "35px",
            backgroundColor: "#d3d3d3",
            borderRadius: "25px",
            position: "absolute",
            top: "-5px",
            zIndex: 0,
          }}
        />
        <MessageCircleMore size={26} style={{ zIndex: 1, color: "#007bff" }} />
        <small className="text-primary" style={{ marginTop: "10px" }}>
          Messages
        </small>
      </button>

      {/* Status */}
      <button
        className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0"
        style={{ flex: 1 }}
        id="status"
        onClick={navigateTo("/status")}
      >
        <CircleFadingArrowUp size={26} />
        <small>Status</small>
      </button>

      {/* Footage */}
      <button
        className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0"
        style={{ flex: 1 }}
        id="footage"
        onClick={navigateTo("/footage")}
      >
        <Video size={26} />
        <small>Footage</small>
      </button>

      {/* Call */}
      <button
        className="nav-link text-muted border-0 bg-transparent d-flex flex-column align-items-center p-0"
        style={{ flex: 1 }}
        id="call"
        onClick={navigateTo("/call")}
      >
        <Phone size={26} />
        <small>Call</small>
      </button>


    </nav>
  );
};

export default BottomNav;
