let intervalId = null;
const CACHE_KEY = 'myStatusCache';
const EXPIRY_MS = 1 * 60 * 60 * 1000; // 24 hours

export const startCurrentStatusFetcher = (setStatusPreview) => {
  if (intervalId !== null) {
    console.log('[Fetcher] Already running');
    return;
  }

  let lastBlobUrl = null;
  let lastStatusTimestamp = null;

  // 🧹 Cleanup expired cache
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > EXPIRY_MS;

      if (isExpired) {
        console.log('[Fetcher] Cached status expired — clearing');
        localStorage.removeItem(CACHE_KEY);
      } else {
  setStatusPreview({
  mediaUrl: parsed.mediaUrl,
  thumbnail: parsed.thumbnail,
  type: parsed.type,
  timestamp: parsed.timestamp, // ✅ added
});

        lastStatusTimestamp = parsed.timestamp;
        lastBlobUrl = parsed.mediaUrl;
        console.log('[Fetcher] Loaded status from cache');
      }
    } catch (e) {
      console.warn('[Fetcher] Error parsing cached status — clearing');
      localStorage.removeItem(CACHE_KEY);
    }
  }

async function fetchAndCacheStatus() {
  const raw = localStorage.getItem('user');
  if (!raw) return;

  let user;
  try {
    user = JSON.parse(raw);
  } catch {
    console.error('[Fetcher] Invalid user JSON');
    return;
  }

  const userId = user.user_id;
  if (!userId) return;

  try {
    const response = await fetch('http://localhost:5000/api/getCurrentStatus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) return;

    const mediaBlob = await response.blob();
    const timestampHeader = response.headers.get('x-status-timestamp');
    const serverTimestamp = Number(timestampHeader);

    if (!serverTimestamp) {
      console.warn('[Fetcher] Missing or invalid timestamp header, ignoring update');
      return;
    }

    // Only update if new
    if (serverTimestamp === lastStatusTimestamp) return;

    lastStatusTimestamp = serverTimestamp;

    if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl);
    lastBlobUrl = URL.createObjectURL(mediaBlob);

    generateThumbnail(lastBlobUrl, mediaBlob.type, (thumbnail) => {
      if (!thumbnail) return;

      setStatusPreview({
        mediaUrl: lastBlobUrl,
        thumbnail,
        type: mediaBlob.type,
        timestamp: serverTimestamp, // << Include timestamp here
      });

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          mediaUrl: lastBlobUrl,
          thumbnail,
          type: mediaBlob.type,
          timestamp: serverTimestamp,
        })
      );
    });
  } catch (err) {
    console.error('[Fetcher] Error:', err);
  }
}

  fetchAndCacheStatus();
  intervalId = setInterval(fetchAndCacheStatus, 1000);
  console.log('[Fetcher] Started interval');
};

export const stopCurrentStatusFetcher = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('[Fetcher] Stopped interval');
  }
};

const generateThumbnail = (src, type, callback) => {
  const done = (thumb) => callback(thumb);

  if (type.startsWith('video')) {
    const video = document.createElement('video');
    video.src = src;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.currentTime = 0.5;

    video.addEventListener('loadeddata', () => {
      const c = document.createElement('canvas');
      c.width = c.height = 100;
      c.getContext('2d').drawImage(video, 0, 0, 100, 100);
      done(c.toDataURL());
    });

    video.addEventListener('error', (e) => {
      console.error('[Thumbnail] Video error', e);
      done(null);
    });
  } else {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 100;
      c.getContext('2d').drawImage(img, 0, 0, 100, 100);
      done(c.toDataURL());
    };
    img.onerror = (e) => {
      console.error('[Thumbnail] Image error', e);
      done(null);
    };
  }
};
