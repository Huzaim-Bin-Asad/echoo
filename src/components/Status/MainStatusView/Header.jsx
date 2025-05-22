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
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // reset & animate for each new status
    const duration = 5000;
    const interval = 100;
    const startTime = Date.now();
    setProgress(0);

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct === 100) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [progressIndex]);

  return (
    <div className="p-2">
      {/* Multi-step progress bar */}
      <div className="w-100 mb-2 d-flex gap-1">
        {[...Array(total)].map((_, idx) => {
          // determine this segment's fill
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
                  backgroundImage: "linear-gradient(to right, #f8d7da, #c8a2c8)",
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
          <img
            src={profileImageUrl || "https://via.placeholder.com/32"}
            alt="Profile"
            className="rounded-circle"
            style={{ width: 32, height: 32 }}
          />
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
