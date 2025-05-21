import React, { useEffect, useState } from "react";
import { ChevronLeft, MoreVertical } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = ({ onBack, title = "Uzair", subtitle = "Yesterday, 5:25 PM", profileImageUrl }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!onBack) return; // no timer if no back handler

    const duration = 5000; // 10 seconds
    const interval = 100; // update every 100ms
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percentage = Math.min((elapsed / duration) * 100, 100);
      setProgress(percentage);
      if (percentage >= 100) {
        clearInterval(timer);
        onBack(); // Automatically call onBack when progress completes
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onBack]);

  return (
    <div className="p-2">
      {/* Progress bar */}
      <div className="w-100 mb-2" style={{ height: "4px", backgroundColor: "#f8d7da" }}>
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundImage: "linear-gradient(to right, #f8d7da, #c8a2c8)",
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* Header content */}
      <div
        className="d-flex align-items-center justify-content-between"
      >
        <div
          className="d-flex align-items-center gap-2"
          style={{ cursor: onBack ? "pointer" : "default" }}
          onClick={() => {
            if (onBack) onBack();
          }}
          role={onBack ? "button" : undefined}
          tabIndex={onBack ? 0 : undefined}
          onKeyDown={(e) => {
            if (onBack && (e.key === "Enter" || e.key === " ")) {
              onBack();
            }
          }}
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
            <div style={{ fontSize: "0.75rem", color: "#ccc" }}>{subtitle}</div>
          </div>
        </div>
        <MoreVertical color="white" />
      </div>
    </div>
  );
};

export default Header;
