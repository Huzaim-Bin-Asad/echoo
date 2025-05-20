import React, { useEffect, useState } from "react";
import { User } from "lucide-react";

const CACHE_KEY = "contactedStatusesCache";

const RecentUpdates = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get time ago string from timestamp with exact time
const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  const timeString = past.toLocaleTimeString([], {
    hour: "numeric",      // changed from '2-digit' to 'numeric'
    minute: "2-digit",
    hour12: true,
  });

  if (seconds < 60) return `${seconds} sec ago, ${timeString}`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago, ${timeString}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago, ${timeString}`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago, ${timeString}`;
};


  useEffect(() => {
    const loadCachedStatuses = () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && Array.isArray(parsed.statuses)) {
            return parsed.statuses;
          }
        }
      } catch (e) {
        console.warn("Failed to parse cached statuses:", e);
      }
      return [];
    };

    const cachedStatuses = loadCachedStatuses();
    setStatuses(cachedStatuses);
    setLoading(false);
  }, []);

  return (
    <div
      className="bg-white mt-2 px-3 py-2"
      style={{
        borderRadius: "12px",
        margin: "0 12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h6
        className="text-muted mb-3"
        style={{ fontSize: "0.85rem", fontWeight: "500" }}
      >
        RECENT UPDATES
      </h6>

      {loading ? (
        <p className="text-muted">Loading updates...</p>
      ) : statuses.length === 0 ? (
        <p className="text-muted">No recent updates</p>
      ) : (
        statuses.map((status) => (
          <div
            key={status.status_id || status.id}
            className="d-flex align-items-center mb-3"
          >
            <div
              className="position-relative"
              style={{ width: 52, height: 52 }}
            >
              <div
                className="position-absolute top-0 start-0 rounded-circle"
                style={{
                  width: 52,
                  height: 52,
                  background:
                    "conic-gradient(#28a745 0deg 80deg, transparent 80deg 280deg, #28a745 280deg 360deg)",
                  clipPath: "circle(50% at center)",
                }}
              ></div>

              <div
                className="position-absolute top-50 start-50 translate-middle bg-white rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: 44,
                  height: 44,
                  overflow: "hidden",
                  borderRadius: "50%",
                }}
              >
                {status.thumbnail ? (
                  <img
                    src={status.thumbnail}
                    alt={`${status.contactName} status thumbnail`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <User size={24} color="#6c757d" />
                )}
              </div>
            </div>

            <div className="ms-3 flex-grow-1">
              <strong style={{ fontSize: "0.95rem" }}>
                {status.contactName}
              </strong>
              <p className="mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                {timeAgo(status.timestamp)}
              </p>
              {status.caption && (
                <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
                  {status.caption}
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentUpdates;
