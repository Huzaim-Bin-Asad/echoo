import { useEffect, useState, useRef } from "react";

const CACHE_KEY = "contactedStatusesCache";
const EXPIRY_MS = 10000; // 10 seconds

const ContactStatuses = ({ onStatusesUpdate }) => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // In-memory cache of blob URLs keyed by original media_url
  const blobUrlCache = useRef({});

  useEffect(() => {
    let intervalId;

    const saveCache = (key, data) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
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
            // On reload blob URLs are invalid, clear media_url here so fetch recreates blobs
            const statusesWithMediaUrlCleared = parsed.statuses.map((status) => ({
              ...status,
              media_url: null,
            }));

            setStatuses(statusesWithMediaUrlCleared);
            onStatusesUpdate?.(statusesWithMediaUrlCleared);
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

    const revokeBlobUrls = () => {
      Object.values(blobUrlCache.current).forEach((url) => {
        URL.revokeObjectURL(url);
      });
      blobUrlCache.current = {};
    };

    const fetchBlobAndCache = async (media_url, token) => {
      // Check in-memory cache first
      if (blobUrlCache.current[media_url]) {
        return blobUrlCache.current[media_url];
      }
      try {
        const blobRes = await fetch(media_url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        if (!blobRes.ok) {
          throw new Error(`HTTP ${blobRes.status}: ${blobRes.statusText}`);
        }

        const blob = await blobRes.blob();
        if (blob.size === 0) throw new Error("Blob size is 0");

        const blobUrl = URL.createObjectURL(blob);
        blobUrlCache.current[media_url] = blobUrl;
        return blobUrl;
      } catch (err) {
        console.warn(`[Blob] Failed to fetch blob for ${media_url}:`, err.message);
        return null;
      }
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

        const response = await fetch("http://localhost:5000/api/get-contacts-statuses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token ? `Bearer ${user.token}` : undefined,
          },
          body: JSON.stringify({ user_id: user.user_id }),
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

        // For each status, reuse cached blobUrl or fetch + create it
        const enrichedStatuses = await Promise.all(
          data.statuses.map(async (status) => {
            const { media_url } = status;
            if (!media_url) return { ...status, media_url: null, thumbnail: null };

            let blobUrl = blobUrlCache.current[media_url];
            if (!blobUrl) {
              blobUrl = await fetchBlobAndCache(media_url, user.token);
            }

            if (!blobUrl) {
              return { ...status, media_url: null, thumbnail: null };
            }

            const contentType = blobUrl ? (await fetch(media_url).then(res => res.headers.get("Content-Type")).catch(() => "unknown")) : "unknown";
            const thumbnail = await generateThumbnail(blobUrl, contentType);

            return { ...status, media_url: blobUrl, thumbnail };
          })
        );

        const cacheToStore = {
          timestamp: Date.now(),
          // Save all info except media_url is saved as original url (not blobUrl) to avoid stale blob URLs
          statuses: enrichedStatuses.map(
            ({ status_id, user_id, contactName, caption, timestamp, media_url, thumbnail }) => ({
              status_id,
              user_id,
              contactName,
              caption,
              timestamp,
              // Save original media_url (not blobUrl) in cache for reload & refetch
              media_url: data.statuses.find(s => s.status_id === status_id)?.media_url || null,
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

    return () => {
      clearInterval(intervalId);
      revokeBlobUrls();
    };
  }, [onStatusesUpdate]);

  return null;
};

export default ContactStatuses;

// Thumbnail generation function unchanged
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
