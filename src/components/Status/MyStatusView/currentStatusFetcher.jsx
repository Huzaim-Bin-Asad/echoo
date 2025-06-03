let intervalId = null;
const CACHE_KEY = "myStatusCache";
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// In-memory cache for thumbnails keyed by blob URL
const thumbnailCache = {};

export const startCurrentStatusFetcher = (setStatusPreview) => {
  if (intervalId !== null) {
    return;
  }

  let lastBlobUrl = null;
  let lastStatusTimestamp = null;
  let lastOriginalMediaUrl = null;

  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > EXPIRY_MS;

      if (isExpired) {
        localStorage.removeItem(CACHE_KEY);
      } else {
        setStatusPreview({
          mediaUrl: parsed.mediaUrl,
          thumbnail: parsed.thumbnail,
          type: parsed.type,
          timestamp: parsed.timestamp,
        });
        lastStatusTimestamp = parsed.timestamp;
        lastBlobUrl = parsed.mediaUrl;
        lastOriginalMediaUrl = parsed.originalMediaUrl;
        thumbnailCache[lastBlobUrl] = parsed.thumbnail;
      }
    } catch (err) {
      console.warn(
        "[StatusFetcher] Error parsing cached status. Removing.",
        err
      );
      localStorage.removeItem(CACHE_KEY);
    }
  }

  async function fetchAndCacheStatus() {
    const raw = localStorage.getItem("user");
    if (!raw) {
      console.warn("[StatusFetcher] No user found in localStorage.");
      return;
    }

    let user;
    try {
      user = JSON.parse(raw);
    } catch (err) {
      console.warn("[StatusFetcher] Failed to parse user JSON.", err);
      return;
    }

    const userId = user.user_id;
    if (!userId) {
      console.warn("[StatusFetcher] No user_id found.");
      return;
    }

    try {
      const response = await fetch(
        "https://echoo-backend.vercel.app/api/getCurrentStatus",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            originalMediaUrl: lastOriginalMediaUrl || null,
            isCached: !!lastOriginalMediaUrl,
          }),
        }
      );

      if (response.status === 204) {
        return;
      }

      if (response.status === 404) {
        setStatusPreview(null);
        localStorage.removeItem(CACHE_KEY);

        if (lastBlobUrl) {
          URL.revokeObjectURL(lastBlobUrl);
          lastBlobUrl = null;
        }

        lastStatusTimestamp = null;
        lastOriginalMediaUrl = null;
        return;
      }

      if (!response.ok) {
        console.error(
          "[StatusFetcher] Failed to fetch status:",
          response.statusText
        );
        return;
      }

      const timestampHeader = response.headers.get("x-status-timestamp");
      const originalMediaUrl = response.headers.get("x-status-mediaurl");
      const serverTimestamp = Number(timestampHeader);

      if (!serverTimestamp || !originalMediaUrl) {
        console.warn("[StatusFetcher] Missing required headers.");
        return;
      }

      if (
        serverTimestamp === lastStatusTimestamp &&
        originalMediaUrl === lastOriginalMediaUrl
      ) {
        return;
      }

      lastStatusTimestamp = serverTimestamp;
      lastOriginalMediaUrl = originalMediaUrl;

      const mediaBlob = await response.blob();

      if (lastBlobUrl) {
        URL.revokeObjectURL(lastBlobUrl);
      }

      lastBlobUrl = URL.createObjectURL(mediaBlob);

      if (thumbnailCache[lastBlobUrl]) {
        setStatusPreview({
          mediaUrl: lastBlobUrl,
          thumbnail: thumbnailCache[lastBlobUrl],
          type: mediaBlob.type,
          timestamp: serverTimestamp,
        });
        return;
      }

      generateThumbnail(lastBlobUrl, mediaBlob.type, (thumbnail) => {
        if (!thumbnail) {
          console.error("[StatusFetcher] Failed to generate thumbnail.");
          return;
        }

        thumbnailCache[lastBlobUrl] = thumbnail;

        const preview = {
          mediaUrl: lastBlobUrl,
          thumbnail,
          type: mediaBlob.type,
          timestamp: serverTimestamp,
        };

        setStatusPreview(preview);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            ...preview,
            originalMediaUrl,
          })
        );
      });
    } catch (err) {
      console.error("[StatusFetcher] Fetch error:", err);
    }
  }

  fetchAndCacheStatus();
  intervalId = setInterval(fetchAndCacheStatus, 1000);
};

export const stopCurrentStatusFetcher = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const generateThumbnail = (src, type, callback) => {
  const maxSize = 150;
  const normalizedType = (type || "").toLowerCase().trim();

  if (normalizedType.startsWith("image/")) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height >= width && height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const thumbnail = canvas.toDataURL("image/jpeg", 0.7);
        callback(thumbnail);
      } catch (e) {
        console.error("[ThumbnailGenerator] Image processing error:", e);
        callback(null);
      }
    };

    img.onerror = (e) => {
      console.error("[ThumbnailGenerator] Image load error for:", src, e);
      callback(null);
    };
  } else if (
    normalizedType.startsWith("video/") ||
    normalizedType === "video/mp4"
  ) {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const fallback = () => {
      console.warn("[ThumbnailGenerator] Video seek fallback triggered");
      if (video.readyState >= 2 && !video.seeking) {
        handleSeek();
      } else {
        callback(null);
      }
    };

    const handleSeek = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = video.videoWidth;
        let height = video.videoHeight;

        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height >= width && height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(video, 0, 0, width, height);

        const thumbnail = canvas.toDataURL("image/jpeg", 0.7);
        callback(thumbnail);
      } catch (e) {
        console.error("[ThumbnailGenerator] Video draw error:", e);
        callback(null);
      }
    };

    video.onloadeddata = () => {
      try {
        video.currentTime = Math.min(0.1, video.duration || 1);
      } catch (e) {
        console.error("[ThumbnailGenerator] Seek error:", e);
        callback(null);
      }
    };

    video.onseeked = handleSeek;

    video.onerror = (e) => {
      console.error("[ThumbnailGenerator] Video load error for:", src, e);
      callback(null);
    };

    // Timeout fallback in case onseeked doesn't trigger
    setTimeout(fallback, 3000);
  } else {
    console.warn("[ThumbnailGenerator] Unsupported media type:", type);
    callback(null);
  }
};
