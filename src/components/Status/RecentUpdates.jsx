import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { getBlobFromDB, saveBlobToDB } from "./MyStatusView/blobUrlDB";

const CACHE_KEY = "contactedStatusesCache";

const RecentUpdates = ({ onStatusClick }) => {
  const [statuses, setStatuses] = useState([]);
  const [statusMetaMap, setStatusMetaMap] = useState({});
  const [loading, setLoading] = useState(true);

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
    if (hours < 24)
      return `${hours} hr${hours > 1 ? "s" : ""} ago, ${timeString}`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago, ${timeString}`;
  };

  const getStatusesGroupedByContact = (allStatuses) => {
    const grouped = {};
    allStatuses.forEach((status) => {
      const key = status.contactName || status.user_id || "unknown";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(status);
    });
    return grouped;
  };

  const getLatestStatusPerContact = (allStatuses) => {
    const grouped = getStatusesGroupedByContact(allStatuses);
    const metaMap = {};

    const latest = Object.entries(grouped).map(([contactName, statuses]) => {
      const latestStatus = statuses.reduce((latest, current) =>
        new Date(current.timestamp) > new Date(latest.timestamp)
          ? current
          : latest
      );
      const userId = latestStatus.user_id || statuses[0].user_id || "unknown";
      const statusIds = statuses.map((s) => s.status_id);

      metaMap[contactName] = { userId, statusIds };

      return {
        contactName,
        statuses,
        latestStatus,
      };
    });

    return { latest, metaMap };
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
    const { latest, metaMap } = getLatestStatusPerContact(cachedStatuses);

    setStatuses(latest);
    setStatusMetaMap(metaMap);
    setLoading(false);
  }, []);

  const getGradientForCount = (count) => {
    const gap = 4;
    if (count <= 1)
      return "conic-gradient(#8e5db1 0deg 360deg, #9b6ea9 360deg 360deg)";
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

  const handleStatusClick = async (
    contactName,
    allStatuses,
    latestStatus,
    meta
  ) => {
    const cachedStatuses =
      JSON.parse(localStorage.getItem(CACHE_KEY))?.statuses || [];
    const matchingStatuses = cachedStatuses.filter((status) =>
      meta.statusIds.includes(status.status_id)
    );

    const mediaItems = [];

    for (const statusId of meta.statusIds) {
      try {
        let blob = await getBlobFromDB(statusId);
        let blobUrl = null;
        let duration = 5000;

        if (!blob) {
          const statusObj = matchingStatuses.find(
            (s) => s.status_id === statusId
          );

          if (statusObj?.original_media_url) {
            const mediaRes = await fetch(
              "https://echoo-backend.vercel.app/api/getMediaByUrl",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  media_url: statusObj.original_media_url,
                }),
              }
            );

            if (mediaRes.ok) {
              blob = await mediaRes.blob();
              await saveBlobToDB(statusId, blob);
            } else {
              console.warn(`❌ Failed to fetch blob for status_id=${statusId}`);
            }
          } else {
            console.warn(
              `⚠️ No original_media_url found for status_id=${statusId}`
            );
          }
        }

        if (blob) {
          blobUrl = URL.createObjectURL(blob);

          if (blob.type.startsWith("video/")) {
            const video = document.createElement("video");
            video.src = blobUrl;

            duration = await new Promise((resolve) => {
              video.onloadedmetadata = () => resolve(video.duration * 1000);
              video.onerror = () => {
                console.warn(
                  `⚠️ Failed to load metadata for video ${statusId}`
                );
                resolve(5000);
              };
            });
          }
        }

        const matched = matchingStatuses.find((s) => s.status_id === statusId);
        const timestamp = matched?.timestamp || null;

        mediaItems.push({ statusId, blobUrl, timestamp, duration });
      } catch (err) {
        console.error(`🚨 Error handling status ID ${statusId}:`, err);
        mediaItems.push({
          statusId,
          blobUrl: null,
          timestamp: null,
          duration: 5000,
        });
      }
    }

    const clickData = {
      contactName,
      statuses: allStatuses,
      latestStatus,
      userId: meta.userId,
      statusIds: meta.statusIds,
      mediaItems,
    };

    if (onStatusClick) {
      onStatusClick(clickData);
    }
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
          const meta = statusMetaMap[contactName] || {
            userId: "unknown",
            statusIds: [],
          };

          return (
            <div
              key={latestStatus.status_id || latestStatus.id}
              className="mb-3"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleStatusClick(contactName, allStatuses, latestStatus, meta)
              }
            >
              <div className="d-flex align-items-center">
                <div
                  className="position-relative"
                  style={{ width: 52, height: 52 }}
                >
                  <div
                    className="position-absolute top-0 start-0 rounded-circle"
                    style={{
                      width: 52,
                      height: 52,
                      background: getGradientForCount(allStatuses.length),
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
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
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
                    <p
                      className="mb-0 text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {latestStatus.caption}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default RecentUpdates;
