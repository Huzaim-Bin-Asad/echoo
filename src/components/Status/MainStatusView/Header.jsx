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
  userId, // ✅ Add userId to props
}) => {
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
  
  }, [mediaType, mediaDuration]);

  useEffect(() => {
    console.log("👤 Header received userId:", userId); // ✅ Log userId on change
  }, [userId]);

  useEffect(() => {
    const shouldStartProgress =
      startProgress && (mediaType === "image" || videoStarted);

    if (!shouldStartProgress) {
      setProgress(0);
      setAnimating(false);
      return;
    }

    setProgress(0);
    setAnimating(true);

    const triggerTimeout = setTimeout(() => {
      setProgress(100);
    }, 50);

    const endTimeout = setTimeout(() => {
      setAnimating(false);
      if (onProgressComplete) {
        onProgressComplete("mediaComplete");
      }
    }, mediaDuration);

    return () => {
      clearTimeout(triggerTimeout);
      clearTimeout(endTimeout);
    };
  }, [
    progressIndex,
    startProgress,
    videoStarted,
    mediaDuration,
    mediaType,
    onProgressComplete,
  ]);

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
            transitionStyle = animating
              ? `width ${mediaDuration}ms linear`
              : "none";
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
                  backgroundImage:
                    "linear-gradient(to right, #f8d7da, #c8a2c8)",
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
          <div style={{ display: "none" }}>{userId}</div>

        <MoreVertical color="white" />
      </div>
    </div>
  );
};

export default Header;
