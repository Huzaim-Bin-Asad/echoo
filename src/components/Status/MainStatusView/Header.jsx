import React, { useEffect, useState } from "react";
import { ChevronLeft, MoreVertical } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = ({
  onBack,
  title,
  subtitle,
  profileImageUrl,
  progressIndex = 0,
  total = 1,
  startProgress = false,
  onProgressComplete,  // New prop
}) => {
  const [progress, setProgress] = useState(0);

useEffect(() => {
  if (!startProgress) {
    setProgress(0);
    return;
  }

  const duration = 5000; // total time per status
  const interval = 100;
  const startTime = Date.now();

  setProgress(0);

  const timer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const pct = Math.min((elapsed / duration) * 100, 100);
    setProgress(pct);

    if (pct >= 100) {
      clearInterval(timer);
      if (onProgressComplete) {
        if (total === 1) {
          onProgressComplete("cycleCompleted");
        } else {
          onProgressComplete(progressIndex);
        }
      }
    }
  }, interval);

  return () => clearInterval(timer);
}, [progressIndex, startProgress]);

  return (
    <div className="p-2">
      {/* Multi-step progress bar */}
      <div className="w-100 mb-2 d-flex gap-1">
        {[...Array(total)].map((_, idx) => {
          // Determine this segment's fill
          let width;
          if (idx < progressIndex) width = "100%";
          else if (idx === progressIndex) width = `${progress}%`;
          else width = "0%";

          return (
            <div
              key={idx}
              style={{
                flexGrow: 1,
                backgroundColor: "#f8d7da",
                height: 4,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width,
                  height: "100%",
                  backgroundImage:
                    "linear-gradient(to right, #f8d7da, #c8a2c8)",
                  transition: "width 0.1s linear",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Header content */}
      <div className="d-flex align-items-center justify-content-between">
        <div
          className="d-flex align-items-center gap-2"
          style={{ cursor: onBack ? "pointer" : "default" }}
          onClick={onBack}
        >
          <ChevronLeft color="white" />
          {profileImageUrl && (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="rounded-circle"
              style={{ width: 32, height: 32 }}
            />
          )}

          <div>
            <strong>{title}</strong>
            <div style={{ fontSize: "0.75rem", color: "#ccc" }}>
              {subtitle}
            </div>
          </div>
        </div>
        <MoreVertical color="white" />
      </div>
    </div>
  );
};

export default Header;
