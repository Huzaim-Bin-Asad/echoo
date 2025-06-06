import React, { useState, useEffect } from "react";
import { Clock, Settings2 } from "lucide-react";

export default function GroupSetting({
  onOpenDisappearingMessages,
  onOpenGroupPermissions,
  disappearingDuration = "off",
  onDisappearingDurationChange,
}) {
  const [duration, setDuration] = useState(disappearingDuration);

  // Sync internal state if prop changes externally
  useEffect(() => {
    setDuration(disappearingDuration);
  }, [disappearingDuration]);

  // Notify parent when internal duration changes
  useEffect(() => {
    if (onDisappearingDurationChange) {
      onDisappearingDurationChange(duration);
    }
  }, [duration, onDisappearingDurationChange]);

  const displayTextMap = {
    off: "Off",
    "24h": "24 hours",
    "7d": "7 days",
    "90d": "90 days",
  };

  const displayText = displayTextMap[duration] || "Off";

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
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
          onClick={() => {
            onOpenDisappearingMessages?.();
            // Toggle duration for demo (replace with proper selector in production)
            const nextDuration = duration === "off" ? "24h" : "off";
            handleDurationChange(nextDuration);
          }}
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
          onClick={() => onOpenGroupPermissions?.("group-setting")}
        >
          <span>Group permissions</span>
          <Settings2 size={20} />
        </div>
      </div>
    </div>
  );
}
