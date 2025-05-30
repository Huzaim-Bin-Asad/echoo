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
  mediaDuration = 5000,
  mediaType = null,
  userId,
}) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const observerRef = useRef(null);
  const containerRef = useRef(null);
  const progressLockedRef = useRef(false);
  const startingProgressRef = useRef(false); // new flag
  const startTimeRef = useRef(null);
  const lastProgressRef = useRef(0);
  const restartTimeoutRef = useRef(null);

  // Clear interval and reset lock safely
  const clearProgressInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } 
    progressLockedRef.current = false;
  };

  // Start progress interval, clearing old one first and preventing overlap
  const startProgressInterval = () => {
    if (startingProgressRef.current) {
      return; // prevent overlapping starts
    }

    startingProgressRef.current = true;

    // Clear any existing restart timeout (debounce)
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    // Clear existing interval before starting new one
    clearProgressInterval();

    progressLockedRef.current = true;
    startTimeRef.current = Date.now();
    lastProgressRef.current = 0;
    setProgress(0);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const percent = Math.min((elapsed / mediaDuration) * 100, 100);

      // Only update progress if changed meaningfully
      if (percent - lastProgressRef.current >= 0.5 || percent === 100) {
        setProgress(percent);
        lastProgressRef.current = percent;
      }

      if (percent >= 100) {
        clearProgressInterval();
        if (onProgressComplete) onProgressComplete("mediaComplete");
        startingProgressRef.current = false; // allow future starts
      }
    }, 50);

    // Release lock immediately after setting interval
    startingProgressRef.current = false;
  };

  // Effect: start or stop progress on relevant prop changes
  useEffect(() => {
    const shouldStart = startProgress && (mediaType === "image" || videoStarted);
    if (!shouldStart) {
      clearProgressInterval();
      return;
    }

    if (!progressLockedRef.current) {
      startProgressInterval();
    }
  }, [startProgress, mediaType, videoStarted, mediaDuration, progressIndex, onProgressComplete]);

  // MutationObserver to detect meaningful container changes and debounce restart
  useEffect(() => {
    if (!containerRef.current) return;

    const mutationCallback = (mutations) => {
      if (!progressLockedRef.current) return; // Only restart if progress running

      // Check if any meaningful mutations happened (e.g., childList or attributes)
      const relevantMutation = mutations.some((mutation) => {
        return (
          mutation.type === "childList" ||
          mutation.type === "attributes"
        );
      });

      if (!relevantMutation) return;

      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);

      restartTimeoutRef.current = setTimeout(() => {
        startProgressInterval();
      }, 100); // debounce 100ms
    };

    observerRef.current = new MutationObserver(mutationCallback);
    observerRef.current.observe(containerRef.current, {
      attributes: true,
      childList: true,
      subtree: false,       // reduce noise, only observe direct children & attributes
      characterData: false, // ignore text changes
    });


    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
    };
  }, [containerRef.current]);

  // Observe removal of container from DOM and clear progress
  useEffect(() => {
    const removalObserver = new MutationObserver(() => {
      const exists = document.querySelector(".d-flex.align-items-center.justify-content-between");
      if (!exists) {
        clearProgressInterval();
      }
    });

    removalObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });


    return () => {
      removalObserver.disconnect();
    };
  }, []);

  return (
    <div className="p-2">
      {/* Progress Bar */}
      <div className="w-100 mb-2 d-flex gap-1">
        {[...Array(total)].map((_, idx) => {
          let width = 0;
          if (idx < progressIndex) {
            width = 100;
          } else if (idx === progressIndex) {
            width = progress;
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
                  width: `${width}%`,
                  height: "100%",
                  backgroundImage: "linear-gradient(to right, #f8d7da, #c8a2c8)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transition: "width 0.05s linear",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Header Content */}
      <div
        ref={containerRef}
        className="d-flex align-items-center justify-content-between"
      >
        <div
          className="d-flex align-items-center gap-2"
          style={{ cursor: onBack ? "pointer" : "default" }}
          onClick={onBack}
        >
          <ChevronLeft color="white" />
          <div style={{ position: "relative" }}>
            {profileImageUrl && (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="rounded-circle"
                style={{ width: 32, height: 32 }}
                onLoad={() => {
                }}
              />
            )}
          </div>
          <div>
            <strong>{title}</strong>
            <div style={{ fontSize: "0.75rem", color: "#ccc" }}>{subtitle}</div>
          </div>
        </div>

        {/* Hidden userId */}
        <div style={{ display: "none" }}>{userId}</div>
        <MoreVertical color="white" />
      </div>
    </div>
  );
};

export default Header;
