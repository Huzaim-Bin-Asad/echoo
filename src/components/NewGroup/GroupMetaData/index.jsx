import React, { useState, useEffect, useRef } from "react";
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
  onDisappearingDurationChange,
}) {
  const groupMetaRef = useRef(null);

  // Clear stored sessionStorage on mount (page refresh)
  useEffect(() => {
    sessionStorage.removeItem("groupMetaData");
    sessionStorage.removeItem("disappearingDisplayText");
  }, []);

  // Initialize metaData from sessionStorage or defaults
  const [metaData, setMetaData] = useState(() => {
    const saved = sessionStorage.getItem("groupMetaData");
    if (saved) {
      return JSON.parse(saved);
    }
    return { groupImage: null, groupName: "", disappearingDuration: disappearingDuration || "off" };
  });

  // Initialize currentDuration from metaData or props
  const [currentDuration, setCurrentDuration] = useState(metaData.disappearingDuration || "off");
  const [showDisappearingMessages, setShowDisappearingMessages] = useState(false);

  // When currentDuration changes, update metaData & sessionStorage
  const handleDisappearingDurationChange = (value) => {
    console.log("GroupScreen received disappearingDuration:", value);

    if (value === currentDuration) return; // Avoid unnecessary updates

    setCurrentDuration(value);

    const durationMap = {
      off: "None",
      "24h": "24 hours",
      "7d": "7 days",
      "90d": "90 days",
    };
    const displayText = durationMap[value] || "None";

    sessionStorage.setItem("disappearingDisplayText", displayText);

    // Update metaData with disappearingDuration and persist
    setMetaData((prev) => {
      const updated = { ...prev, disappearingDuration: value };
      sessionStorage.setItem("groupMetaData", JSON.stringify(updated));
      return updated;
    });

    if (onDisappearingDurationChange) {
      onDisappearingDurationChange(value);
    }
  };

  const handleClick = () => {
    alert("Group created!");
  };

  const openDisappearingMessages = () => {
    setShowDisappearingMessages(true);
  };

  const handleGroupSettingAction = async (source, displayText) => {
    console.log("GroupSettingAction Triggered:");
    console.log("Source:", source);
    console.log("Disappearing Message Display Text:", displayText);

    if (groupMetaRef.current && typeof groupMetaRef.current.getGroupMetaData === "function") {
      const groupMeta = await groupMetaRef.current.getGroupMetaData();
      console.log("GroupMetaData returned:", groupMeta);
    }

    if (onGroupSettingAction) {
      onGroupSettingAction(source, displayText);
    }
  };

  const handleMetaDataChange = (data) => {
    console.log("MetaData changed:", data);
    setMetaData((prev) => {
      const updated = { ...prev, ...data };
      sessionStorage.setItem("groupMetaData", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-vh-100 text-white position-relative" style={{ backgroundColor: "#3c324f" }}>
      <GroupHeader />
      <GroupMetaData ref={groupMetaRef} onMetaDataChange={handleMetaDataChange} />

      <GroupSetting
        onOpenDisappearingMessages={openDisappearingMessages}
        onOpenGroupPermissions={handleGroupSettingAction}
        disappearingDuration={currentDuration}
        onDisappearingDurationChange={handleDisappearingDurationChange}
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

      <ChevronButton onClick={handleClick} backgroundColor="#A78BFA" color="#1E1B24">
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
            value={currentDuration}
            onSelect={(value) => {
              handleDisappearingDurationChange(value);
              setTimeout(() => setShowDisappearingMessages(false), 80);
            }}
          />
        </div>
      )}
    </div>
  );
}
