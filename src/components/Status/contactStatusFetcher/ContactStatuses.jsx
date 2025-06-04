import { useEffect, useState, useRef } from "react";
import { getBlobFromDB, saveBlobToDB } from "../MyStatusView/blobUrlDB";

const CACHE_KEY = "contactedStatusesCache";
const EXPIRY_MS = 10000;

const ContactStatuses = ({ onStatusesUpdate }) => {
  // eslint-disable-next-line no-unused-vars
  const [statuses, setStatuses] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const objectUrlMap = useRef({}); // map: status_id => blob URL

  // Save only metadata (no blob URLs) to localStorage cache
  const saveCache = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("[Cache] Failed to save cache:", e);
    }
  };

  // Revoke all blob URLs on unmount or refresh to avoid memory leaks
  const revokeBlobUrls = () => {
    Object.values(objectUrlMap.current).forEach(URL.revokeObjectURL);
    objectUrlMap.current = {};
  };

  // Given a status_id, get Blob from IndexedDB and create blob URL
  const createBlobUrlFromDB = async (status_id) => {
    try {
      const blob = await getBlobFromDB(status_id);
      if (!blob) return null;
      const url = URL.createObjectURL(blob);
      objectUrlMap.current[status_id] = url;
      return url;
    } catch (e) {
      console.warn(
        `[Blob] Failed to get blob from DB for status_id=${status_id}`,
        e
      );
      return null;
    }
  };

  // Load cached statuses metadata from localStorage,
  // create blob URLs from IndexedDB blobs asynchronously,
  // then update statuses state with blob URLs and thumbnails.
  const loadCacheAndUpdateUI = async () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const isExpired = Date.now() - parsed.timestamp > EXPIRY_MS;

        if (
          !isExpired &&
          Array.isArray(parsed.statuses) &&
          parsed.statuses.every((s) => s.status_id && s.media_url_original)
        ) {
          // statusesMeta holds metadata + original media_url (the fetch URL)
          const statusesMeta = parsed.statuses.map((status) => ({
            ...status,
            // We keep media_url_original as the original remote URL for refetch/fallback
          }));

          // Create blob URLs and generate thumbnails for cached statuses that have media
          const enrichedStatuses = await Promise.all(
            statusesMeta.map(async (status) => {
              if (!status.status_id)
                return { ...status, media_url: null, thumbnail: null };

              const blobUrl = await createBlobUrlFromDB(status.status_id);
              if (!blobUrl)
                return { ...status, media_url: null, thumbnail: null };

              // Detect contentType by HEAD request to original media_url
              let contentType = "unknown";
              try {
                const headRes = await fetch(status.media_url_original, {
                  method: "HEAD",
                });
                if (headRes.ok) {
                  contentType =
                    headRes.headers.get("Content-Type") || "unknown";
                }
              } catch {
                console.warn(
                  `[HEAD] Failed to fetch content type for ${status.media_url_original}`
                );
              }

              const thumbnail = await generateThumbnail(blobUrl, contentType);

              return { ...status, media_url: blobUrl, thumbnail };
            })
          );

          setStatuses(enrichedStatuses);
          onStatusesUpdate?.(enrichedStatuses);
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

  // Fetch media blob and cache it in IndexedDB keyed by status_id; return blob URL
  const fetchBlobAndCache = async (status_id, media_url, token) => {
    try {
      // Check IndexedDB first by status_id
      let blob = await getBlobFromDB(status_id);
      if (!blob) {
        // Fetch from network if not cached
        const blobRes = await fetch(media_url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        if (!blobRes.ok) {
          throw new Error(`HTTP ${blobRes.status}: ${blobRes.statusText}`);
        }

        blob = await blobRes.blob();
        if (blob.size === 0) throw new Error("Blob size is 0");

        // Save to IndexedDB by status_id
        await saveBlobToDB(status_id, blob);
      }

      // Create a blob URL from Blob
      const blobUrl = URL.createObjectURL(blob);
      objectUrlMap.current[status_id] = blobUrl;

      return blobUrl;
    } catch (err) {
      console.warn(
        `[Blob] Failed to fetch or cache blob for status_id=${status_id}:`,
        err.message
      );
      return null;
    }
  };

  // Fetch statuses from backend, fetch blobs and cache by status_id, generate thumbnails
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

      const requestBody = JSON.stringify({ user_id: user.user_id });
      const requestHeaders = {
        "Content-Type": "application/json",
        Authorization: user.token ? `Bearer ${user.token}` : undefined,
      };

      const response = await fetch(
        "http://localhost:5000/api/get-contacts-statuses",
        {
          method: "POST",
          headers: requestHeaders,
          body: requestBody,
        }
      );

      if (!response.ok) {
        console.error(
          "[API] Backend error:",
          response.status,
          response.statusText
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (!Array.isArray(data.statuses)) {
        console.error(
          "[API] Invalid response format. Expected statuses array."
        );
        setLoading(false);
        return;
      }

      // For each status, fetch or get blob from DB keyed by status_id, create blob URL, generate thumbnail
      const enrichedStatuses = await Promise.all(
        data.statuses.map(async (status) => {
          const { status_id, media_url } = status;
          if (!media_url || !status_id)
            return { ...status, media_url: null, thumbnail: null };

          const blobUrl = await fetchBlobAndCache(
            status_id,
            media_url,
            user.token
          );
          if (!blobUrl) return { ...status, media_url: null, thumbnail: null };

          let contentType = "unknown";
          try {
            const headRes = await fetch(media_url, { method: "HEAD" });
            if (headRes.ok) {
              contentType = headRes.headers.get("Content-Type") || "unknown";
            }
          } catch {
            console.warn(
              `[HEAD] Failed to fetch content type for ${media_url}`
            );
          }

          const thumbnail = await generateThumbnail(blobUrl, contentType);

          return {
            ...status,
            media_url: blobUrl,
            thumbnail,
            media_url_original: media_url,
          };
        })
      );

      // Save metadata cache with media_url_original (original remote URL)
      const cacheToStore = {
        timestamp: Date.now(),
        statuses: enrichedStatuses.map(
          ({
            status_id,
            user_id,
            contactName,
            caption,
            timestamp,
            media_url_original,
            thumbnail,
          }) => ({
            status_id,
            user_id,
            contactName,
            caption,
            timestamp,
            media_url_original, // remote URL (for re-fetch if needed)
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

  useEffect(() => {
    let intervalId;

    (async () => {
      const hasValidCache = await loadCacheAndUpdateUI();
      if (!hasValidCache) fetchStatuses();

      intervalId = setInterval(fetchStatuses, 5000);
    })();

    return () => {
      clearInterval(intervalId);
      revokeBlobUrls();
    };
  }, [onStatusesUpdate]);

  return null;
};

export default ContactStatuses;
function generateThumbnail(src, type) {
  return new Promise((resolve) => {
    const maxSize = 150;

    // Normalize content type
    const normalizedType = (type || "").toLowerCase().trim();

    if (normalizedType.startsWith("image/")) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

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
        } catch (e) {
          console.error("[Thumbnail] Image draw error:", e);
          resolve(null);
        }
      };

      img.onerror = (e) => {
        console.error("[Thumbnail] Image load error:", e);
        resolve(null);
      };
    } else if (
      normalizedType.startsWith("video/") ||
      normalizedType === "application/mp4" ||
      normalizedType === "video/mp4"
    ) {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.src = src;
      video.preload = "auto";

      const handleError = (e) => {
        console.error("[Thumbnail] Video load error:", e);
        resolve(null);
      };

      video.onerror = handleError;

      video.onloadeddata = () => {
        // Safely attempt seek
        const seekTo = Math.min(0.1, video.duration || 1);
        video.currentTime = seekTo;
      };

      const onSeeked = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
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

      video.onseeked = onSeeked;

      // Timeout fallback if onseeked never triggers
      setTimeout(() => {
        if (video.readyState >= 2 && !video.seeking) {
          onSeeked();
        }
      }, 3000);
    } else {
      console.warn("[Thumbnail] Unsupported type:", type);
      resolve(null);
    }
  });
}
