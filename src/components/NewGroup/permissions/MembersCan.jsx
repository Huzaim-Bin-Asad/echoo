import React from "react";
import { Pencil, MessageCircleMore, UserPlus } from "lucide-react";

const SwitchOption = ({ label, description, Icon }) => {
  return (
    <div
      className="form-check form-switch d-flex mb-4"
      style={{
        position: "relative",  // enable absolute positioning of toggle
        paddingLeft: 0,
        paddingRight: 16,
        alignItems: "flex-start",
        width: "100%",
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      <div
        className="d-flex align-items-center"
        style={{
          gap: 18,
          flex: 1,
          maxWidth: "80%",
          marginLeft: -12,
        }}
      >
        {Icon && (
          <Icon
            size={23}
            style={{
              color: "#A78BFA",
              minWidth: 28,
              minHeight: 28,
              marginLeft: 0,
            }}
          />
        )}
        <div>
          <label
            className="form-check-label fw-bold"
            style={{ color: "#ffffff", cursor: "pointer", fontSize: "1.05rem" }}
          >
            {label}
          </label>
          {description && (
            <div
              className="small"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.8em",
                marginTop: 3,
                maxWidth: 370,
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
      <input
        className="form-check-input"
        type="checkbox"
        defaultChecked
        style={{
          position: "absolute",
          top: "50%",
          right: -16,
          transform: "translateY(-50%) scale(1.4)",
          cursor: "pointer",
        }}
      />
    </div>
  );
};


const MembersCan = () => {
  return (
    <div
      className="p-3 mb-4 rounded"
      style={{
        backgroundColor: "#1e1b24",
        color: "#ffffff",
        width: "100%",
        maxWidth: "200vh",       // slightly wider container
        margin: "0 auto",
      }}
    >
      <h6
        className="mb-3"
        style={{
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: "0.95rem",
          fontWeight: "600",
          marginLeft: 2,     // tiny left offset for heading
        }}
      >
        Members can:
      </h6>

      <SwitchOption
        label="Edit group settings"
        description="This includes the name, icon, description, disappearing message timer, and the ability to pin, keep or unkeep messages."
        Icon={Pencil}
      />
      <SwitchOption label="Send messages" description="" Icon={MessageCircleMore} />
      <SwitchOption label="Add other members" description="" Icon={UserPlus} />
    </div>
  );
};

export default MembersCan;
