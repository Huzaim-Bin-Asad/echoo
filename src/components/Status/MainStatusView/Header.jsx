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
  videoStarted = false,
  onProgressComplete,
  mediaDuration = 5000, // ms
  mediaType = null,
}) => {
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Log mediaType and mediaDuration whenever they change
  useEffect(() => {
    console.log("📢 Header received mediaType:", mediaType, "mediaDuration (ms):", mediaDuration);
  }, [mediaType, mediaDuration]);

  useEffect(() => {
    if (!startProgress || !videoStarted) {
      setProgress(0);
      setAnimating(false);
      return;
    }

    // Start the animation: set width to 0 immediately
    setProgress(0);
    setAnimating(true);

    // After a tiny delay, set width to 100% to trigger CSS transition
    // This ensures the transition actually runs
    const triggerTimeout = setTimeout(() => {
      setProgress(100);
    }, 50);

    // After mediaDuration, end the progress
    const endTimeout = setTimeout(() => {
      setAnimating(false);
      if (onProgressComplete) {
        if (progressIndex >= total - 1) {
          onProgressComplete("cycleCompleted");
        } else {
          onProgressComplete(progressIndex);
        }
      }
    }, mediaDuration);

    return () => {
      clearTimeout(triggerTimeout);
      clearTimeout(endTimeout);
    };
  }, [progressIndex, startProgress, videoStarted, mediaDuration, total, onProgressComplete]);

  return (
    <div className="p-2">
      {/* Multi-step progress bar */}
      <div className="w-100 mb-2 d-flex gap-1">
        {[...Array(total)].map((_, idx) => {
          let width;
          let transitionStyle = "none";

          if (idx < progressIndex) {
            width = "100%";
            transitionStyle = "none";
          } else if (idx === progressIndex) {
            width = `${progress}%`;
            // Animate only when animating this segment
            transitionStyle = animating ? `width ${mediaDuration}ms linear` : "none";
          } else {
            width = "0%";
            transitionStyle = "none";
          }

          return (
            <div
              key={idx}
              style={{
                flexGrow: 1,
                backgroundColor: "#f8d7da",
                height: 4,
                position: "relative",
                overflow: "hidden",
                borderRadius: 2,
              }}
            >
              <div
                style={{
                  width,
                  height: "100%",
                  backgroundImage: "linear-gradient(to right, #f8d7da, #c8a2c8)",
                  transition: transitionStyle,
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
            <div style={{ fontSize: "0.75rem", color: "#ccc" }}>{subtitle}</div>
          </div>
        </div>
        <MoreVertical color="white" />
      </div>
    </div>
  );
};

export default Header;
