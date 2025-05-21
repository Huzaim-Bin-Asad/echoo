import React, { useEffect, useState } from "react";
import { User } from "lucide-react";

const CACHE_KEY = "contactedStatusesCache";

const RecentUpdates = ({ onStatusClick }) => {
  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now - past) / 1000);

    const timeString = past.toLocaleTimeString([], {
      hour: "numeric",
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

  // Group statuses by contactName and get all statuses for each contact
  const getStatusesGroupedByContact = (allStatuses) => {
    const grouped = {};
    allStatuses.forEach((status) => {
      const key = status.contactName || status.user_id || status.status_id || "unknown";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(status);
    });
    return grouped;
  };

  // Get latest status per contact (most recent timestamp)
  const getLatestStatusPerContact = (allStatuses) => {
    const grouped = getStatusesGroupedByContact(allStatuses);
    return Object.entries(grouped).map(([contactName, statuses]) => {
      const latestStatus = statuses.reduce((latest, current) =>
        new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
      );
      return {
        contactName,
        statuses, // all statuses for ring count
        latestStatus,
      };
    });
  };

  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const groupedLatestStatuses = getLatestStatusPerContact(cachedStatuses);
    setStatuses(groupedLatestStatuses);
    setLoading(false);
  }, []);

  const getGradientForCount = (count) => {
    const gap = 4; // degrees gap between arcs
    if (count <= 1) {
      return "conic-gradient(#8e5db1 0deg 360deg, #9b6ea9 360deg 360deg)";
    }
    const degreesPerArc = 360 / count;
    const arcs = [];
    for (let i = 0; i < count; i++) {
      const start = i * degreesPerArc;
      const end = start + degreesPerArc - gap;
      arcs.push(`#8e5db1 ${start}deg ${end}deg`);
      arcs.push(`transparent ${end}deg ${start + degreesPerArc}deg`);
    }
    return `conic-gradient(${arcs.join(", ")})`;
  };

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
        statuses.map(({ contactName, statuses: allStatuses, latestStatus }) => {
          const statusCount = allStatuses.length;
          // Extract user_id from the latestStatus or allStatuses (assuming same user_id)
          const userId = latestStatus.user_id || (allStatuses[0] && allStatuses[0].user_id) || "unknown";

          return (
            <div
              key={latestStatus.status_id || latestStatus.id}
              className="mb-3"
onClick={() => {
  if (onStatusClick) {
    const userId =
      latestStatus.user_id ||
      (allStatuses[0] && allStatuses[0].user_id) ||
      "unknown";

    const mediaUrls = allStatuses.map((s) => s.media_url).filter(Boolean);

    const clickData = {
      contactName,
      statuses: allStatuses,
      latestStatus,
      userId,
      mediaUrls,
    };


    onStatusClick(clickData);
  }
}}

              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center">
                <div className="position-relative" style={{ width: 52, height: 52 }}>
                  <div
                    className="position-absolute top-0 start-0 rounded-circle"
                    style={{
                      width: 52,
                      height: 52,
                      background: getGradientForCount(statusCount),
                      clipPath: "circle(50% at center)",
                    }}
                  ></div>

                  <div
                    className="position-absolute top-50 start-50 translate-middle bg-white rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: 46,
                      height: 46,
                      overflow: "hidden",
                      borderRadius: "50%",
                    }}
                  >
                    {latestStatus.thumbnail ? (
                      <img
                        src={latestStatus.thumbnail}
                        alt={`${contactName} status thumbnail`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <User size={24} color="#6c757d" />
                    )}
                  </div>
                </div>

                <div className="ms-3 flex-grow-1">
                  <strong style={{ fontSize: "0.95rem" }}>{contactName}</strong>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                    {timeAgo(latestStatus.timestamp)}
                  </p>
                  {latestStatus.caption && (
                    <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
                      {latestStatus.caption}
                    </p>
                  )}
                </div>
              </div>

              {/* Hidden DOM data container */}
              <div style={{ display: "none" }} className="hidden-status-data">
                {/* user_id */}
                <span className="user-id">{userId}</span>
                {/* All media_url */}
                {allStatuses.map((status, i) => (
                  <span key={i} className="media-url">
                    {status.media_url}
                  </span>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default RecentUpdates;
