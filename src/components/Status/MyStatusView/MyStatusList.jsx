import React from "react";
import { MoreVertical } from "lucide-react";
import { getBlobFromDB } from "./blobUrlDB"; // Use your proper path

function formatTimestamp(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

async function getStatusBlobUrl(status_id) {
  const blob = await getBlobFromDB(status_id);
  if (blob) {
    return { blob, blobUrl: URL.createObjectURL(blob) };
  }
  throw new Error("Status not found in IndexedDB");
}

export default function MyStatusesList({ statuses, onStatusSelect }) {
  const cachedStatuses =
    !statuses || statuses.length === 0
      ? JSON.parse(localStorage.getItem("cachedStatuses") || "[]")
      : statuses;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const user_id = user?.user_id || "unknown";

  if (!cachedStatuses.length) {
    return (
      <p
        style={{
          padding: "1rem",
          color: "#555",
          backgroundColor: "#f8f9fa",
          margin: 0,
        }}
      >
        No current status available.
      </p>
    );
  }

  const handleClick = async (e, status_id) => {
    try {
      const { blob, blobUrl } = await getStatusBlobUrl(status_id);

      const isVideo = blob.type.startsWith("video/");
      let duration = 5000; // Default 5s for images

      if (isVideo) {
        duration = await new Promise((resolve, reject) => {
          const video = document.createElement("video");
          video.preload = "metadata";
          video.src = blobUrl;
          video.onloadedmetadata = () => {
            const durationMs = video.duration * 1000;
            resolve(durationMs);
          };
          video.onerror = (err) => {
            console.warn("⚠️ Failed to load video metadata:", err);
            resolve(5000); // Fallback
          };
        });
      }

      if (onStatusSelect) {
  
        onStatusSelect(blobUrl, user_id, duration);
      } else {
        console.warn("⚠️ onStatusSelect not provided.");
      }
    } catch (err) {
      console.error("❌ Failed to fetch status from IndexedDB:", err);
    }
  };

  return (
    <div
      className="flex flex-col divide-y"
      style={{ maxWidth: 480, margin: "0 auto" }}
    >
      {cachedStatuses.map(({ status_id, timestamp, thumbnail }) => (
        <div
          key={status_id}
          data-status-id={status_id}
          data-user-id={user_id}
          onClick={(e) => handleClick(e, status_id)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            cursor: "pointer",
            width: "100%",
            backgroundColor: "#ffffff",
            userSelect: "none",
            color: "#212529",
            borderRadius: 0,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#e9ecef",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="Status Thumbnail"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "#ccc",
                  }}
                />
              )}
            </div>

            <p
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: "#212529",
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              {formatTimestamp(timestamp)}
            </p>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{ flexShrink: 0 }}
          >
            <MoreVertical size={28} style={{ color: "#6c757d" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
