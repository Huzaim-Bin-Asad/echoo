import React, { useState } from "react";
import { User } from "lucide-react";
import GroupHeader from "./GroupHeader";
import GroupMetaData from "./GroupMetaData";
import GroupSetting from "./GroupSetting";
import ChevronButton from "./ChevronButton";
import DisappearingMessages from "./DisappearingMessages";

export default function GroupScreen({
  members = [],
  onGroupSettingAction,
  disappearingDuration = "off",
  onDisappearingDurationChange, // <-- callback from parent
}) {
  const [showDisappearingMessages, setShowDisappearingMessages] = useState(false);

  const handleClick = () => {
    alert("Group created!");
  };

  const openDisappearingMessages = () => {
    setShowDisappearingMessages(true);
  };

  const closeDisappearingMessages = () => {
    setShowDisappearingMessages(false);
  };

  const handleGroupSettingAction = (source) => {
    if (onGroupSettingAction) {
      onGroupSettingAction(source);
    }
  };

  return (
    <div
      className="min-vh-100 text-white position-relative"
      style={{ backgroundColor: "#3c324f" }}
    >
      <GroupHeader />
      <GroupMetaData />

      <GroupSetting
        onOpenDisappearingMessages={openDisappearingMessages}
        onOpenGroupPermissions={handleGroupSettingAction}
        disappearingDuration={disappearingDuration}
        onDisappearingDurationChange={onDisappearingDurationChange}
      />

      <div className="p-3">
        <h6 className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
          Members: {members.length}
        </h6>
        <div className="d-flex flex-wrap" style={{ justifyContent: "start" }}>
          {members.map((member, idx) => (
            <div
              key={idx}
              className="d-flex flex-column align-items-center"
              style={{
                width: "25%",
                padding: "0.5rem",
                cursor: "default",
                boxSizing: "border-box",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div
                className="rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "rgba(167, 139, 250, 0.3)",
                  overflow: "hidden",
                  boxShadow: "0 0 6px rgba(167, 139, 250, 0.4)",
                }}
              >
                {member.profilePicture ? (
                  <img
                    src={member.profilePicture}
                    alt={member.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <User color="rgba(255,255,255,0.7)" size={28} />
                )}
              </div>
              <span
                className="mt-1 text-center text-truncate"
                style={{
                  maxWidth: "100%",
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.75)",
                  userSelect: "none",
                }}
                title={member.name}
              >
                {member.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ChevronButton
        onClick={handleClick}
        backgroundColor="#A78BFA"
        color="#1E1B24"
      >
        ✓
      </ChevronButton>

      {showDisappearingMessages && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            width: "90%",
            maxWidth: 400,
            borderRadius: 100,
            backgroundColor: "transparent",
          }}
        >
          <DisappearingMessages
            onSelect={(value) => {
              onDisappearingDurationChange?.(value);
              setTimeout(() => {
                setShowDisappearingMessages(false);
              }, 80);
            }}
          />
        </div>
      )}
    </div>
  );
}
