import React, { useEffect, useState } from "react";
import { Clock, Settings2 } from "lucide-react";

export default function GroupSetting({
  onOpenDisappearingMessages,
  onOpenGroupPermissions,
  disappearingDuration = "off",
  // Remove onDisappearingDurationChange here since we won't call it internally
}) {
  const displayTextMap = {
    off: "Off",
    "24h": "24 hours",
    "7d": "7 days",
    "90d": "90 days",
  };

  // Sync local duration with prop
  const [duration, setDuration] = useState(disappearingDuration);

  useEffect(() => {
    setDuration(disappearingDuration);
  }, [disappearingDuration]);

  const displayText = displayTextMap[duration] || "Off";

  // Only open the Disappearing Messages selector
  const handleDisappearingClick = () => {
    onOpenDisappearingMessages?.();
  };

  const handleGroupPermissionsClick = () => {
    onOpenGroupPermissions?.("group-setting", displayText);
  };

  return (
    <div className="bg-dark text-white mt-3" style={{ backgroundColor: "#121212" }}>
      <div
        className="px-3 py-3"
        style={{
          backgroundColor: "#9980e3a9",
          borderBottom: "1px solid white",
          zIndex: 10,
        }}
      >
        {/* Disappearing Messages Section */}
        <div
          className="d-flex justify-content-between align-items-start mb-3"
          style={{ cursor: "pointer" }}
          onClick={handleDisappearingClick}
        >
          <div style={{ textAlign: "left" }}>
            <span>Disappearing messages</span>
            <br />
            <span className="text-muted" style={{ fontSize: "0.875rem" }}>
              {displayText}
            </span>
          </div>
          <Clock size={20} />
        </div>

        {/* Group Permissions Section */}
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ cursor: "pointer" }}
          onClick={handleGroupPermissionsClick}
        >
          <span>Group permissions</span>
          <Settings2 size={20} />
        </div>
      </div>
    </div>
  );
}
