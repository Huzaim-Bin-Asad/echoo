import React, { useEffect, useState, useRef } from "react";
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
  userId,
}) => {
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(false);

  // refs to store previous values to detect changes
  const prevStartProgress = useRef(startProgress);
  const prevProgressIndex = useRef(progressIndex);

  useEffect(() => {
  }, [userId]);

  useEffect(() => {
    const shouldStartProgress =
      startProgress && (mediaType === "image" || videoStarted);

    // Only proceed if startProgress changed from false → true
    // OR progressIndex changed
    const startProgressChanged =
      startProgress && !prevStartProgress.current;
    const progressIndexChanged = progressIndex !== prevProgressIndex.current;

    if (!shouldStartProgress) {
      setProgress(0);
      setAnimating(false);
      prevStartProgress.current = startProgress;
      prevProgressIndex.current = progressIndex;
      return;
    }

    if (!startProgressChanged && !progressIndexChanged) {
      // No meaningful change, do nothing
      return;
    }

    console.log("▶️ Starting progress animation");

    setProgress(0);
    setAnimating(true);

    const triggerTimeout = setTimeout(() => {
      setProgress(100);
      console.log("➡️ Progress set to 100%");
    }, 50);

    const endTimeout = setTimeout(() => {
      setAnimating(false);
      console.log(
        `✅ Progress reached 100% for index ${progressIndex}, signaling parent.`
      );
      if (onProgressComplete) {
        onProgressComplete("mediaComplete");
      }
    }, mediaDuration + 60);

    // Update refs after starting timers
    prevStartProgress.current = startProgress;
    prevProgressIndex.current = progressIndex;

    return () => {
      clearTimeout(triggerTimeout);
      clearTimeout(endTimeout);
      console.log("🔄 Cleanup progress timers");
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
