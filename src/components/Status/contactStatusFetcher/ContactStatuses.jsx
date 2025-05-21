import { useEffect, useState } from "react";

const CACHE_KEY = "contactedStatusesCache";
const EXPIRY_MS = 10000; // 10 seconds

const ContactStatuses = ({ onStatusesUpdate }) => {
  // eslint-disable-next-line
  const [statuses, setStatuses] = useState([]);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;

    const saveCache = (key, data) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`[Cache] Saved ${data.statuses.length} statuses to cache.`);
      } catch (e) {
        console.error("[Cache] Failed to save cache:", e);
      }
    };

    const loadCacheAndUpdateUI = () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const isExpired = Date.now() - parsed.timestamp > EXPIRY_MS;

          if (
            !isExpired &&
            Array.isArray(parsed.statuses) &&
            parsed.statuses.every((s) => s.status_id)
          ) {
            console.log(`[Cache] Loaded valid cache (${parsed.statuses.length} statuses).`);
            setStatuses(parsed.statuses);
            onStatusesUpdate?.(parsed.statuses);
            setLoading(false);
            return true;
          } else {
            console.warn("[Cache] Cache expired or invalid. Clearing.");
            localStorage.removeItem(CACHE_KEY);
          }
        } catch (e) {
          console.error("[Cache] Error parsing cache:", e);
          localStorage.removeItem(CACHE_KEY);
        }
      }
      return false;
    };

    const fetchStatuses = async () => {
      try {
        const userRaw = localStorage.getItem("user");
        if (!userRaw) {
          console.warn("[Fetch] No user found in localStorage.");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userRaw);
        if (!user.user_id) {
          console.warn("[Fetch] Missing user_id in user object.");
          setLoading(false);
          return;
        }

        // Load cached media urls + thumbnails
        const cached = localStorage.getItem(CACHE_KEY);
        const cachedThumbs = {};
        const cachedMediaUrls = [];

        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            parsed.statuses.forEach((s) => {
              if (s.thumbnail && s.media_url) {
                cachedThumbs[s.media_url] = s.thumbnail;
                cachedMediaUrls.push(s.media_url);
              }
            });
            console.log(`[Cache] Loaded ${cachedMediaUrls.length} cachedMediaUrls from cache.`);
          } catch (e) {
            console.warn("[Cache] Failed to parse cachedMediaUrls:", e);
          }
        }

        console.log("[Fetch] Sending request to backend with payload:", {
          user_id: user.user_id,
          cachedMediaUrls,
        });

        const response = await fetch("http://localhost:5000/api/get-contacts-statuses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token ? `Bearer ${user.token}` : undefined,
          },
          body: JSON.stringify({ user_id: user.user_id, cachedMediaUrls }),
        });

        if (!response.ok) {
          console.error("[Fetch] Backend error:", response.status, response.statusText);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (!Array.isArray(data.statuses)) {
          console.error("[Fetch] Invalid response format. Expected statuses array.");
          setLoading(false);
          return;
        }

        console.log(`[Fetch] Received ${data.statuses.length} statuses from backend.`);

        const enrichedStatuses = await Promise.all(
          data.statuses.map(async (status) => {
            const { media_url } = status;

            if (!media_url) return { ...status, thumbnail: null };

            if (cachedThumbs[media_url]) {
              console.log(`[Thumbnail] Using cached thumbnail for: ${media_url}`);
              return { ...status, thumbnail: cachedThumbs[media_url] };
            }

            try {
              const blobRes = await fetch(media_url, {
                headers: {
                  Authorization: user.token ? `Bearer ${user.token}` : undefined,
                },
              });

              if (!blobRes.ok) {
                throw new Error(`HTTP ${blobRes.status}: ${blobRes.statusText}`);
              }

              const blob = await blobRes.blob();
              if (blob.size === 0) throw new Error("Blob size is 0");

              const blobUrl = URL.createObjectURL(blob);
              const contentType = blob.type || blobRes.headers.get("Content-Type") || "unknown";
              const thumbnail = await generateThumbnail(blobUrl, contentType);
              URL.revokeObjectURL(blobUrl);

              console.log(`[Thumbnail] Generated thumbnail for: ${media_url}`);
              return { ...status, thumbnail };
            } catch (err) {
              console.warn(`[Thumbnail] Failed to generate for ${media_url}:`, err.message);
              return { ...status, thumbnail: null };
            }
          })
        );

        const cacheToStore = {
          timestamp: Date.now(),
          statuses: enrichedStatuses.map(
            ({ status_id, contactName, caption, timestamp, media_url, thumbnail }) => ({
              status_id,
              contactName,
              caption,
              timestamp,
              media_url,
              thumbnail,
            })
          ),
        };

        saveCache(CACHE_KEY, cacheToStore);
        setStatuses(enrichedStatuses);
        onStatusesUpdate?.(enrichedStatuses);
        setLoading(false);
      } catch (err) {
        console.error("[Fetch] Unexpected error during fetchStatuses:", err);
        setLoading(false);
      }
    };

    const hasValidCache = loadCacheAndUpdateUI();
    if (!hasValidCache) fetchStatuses();

    intervalId = setInterval(fetchStatuses, 5000);
    return () => clearInterval(intervalId);
  }, [onStatusesUpdate]);

  return null;
};

export default ContactStatuses;

// Thumbnail generation
function generateThumbnail(src, type) {
  return new Promise((resolve) => {
    if (type.startsWith("image")) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxSize = 150;
        let { width, height } = img;

        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > width && height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };

      img.onerror = (e) => {
        console.error("[Thumbnail] Image error:", e);
        resolve(null);
      };
    } else if (type.startsWith("video")) {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.src = src;
      video.preload = "auto";

      video.onloadeddata = () => {
        video.currentTime = 0.1;
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxSize = 150;
          let width = video.videoWidth;
          let height = video.videoHeight;

          if (width > height && width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          } else if (height > width && height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(video, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        } catch (e) {
          console.error("[Thumbnail] Video draw error:", e);
          resolve(null);
        }
      };

      video.onerror = (e) => {
        console.error("[Thumbnail] Video load error:", e);
        resolve(null);
      };
    } else {
      console.warn("[Thumbnail] Unsupported type:", type);
      resolve(null);
    }
  });
}
