const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

let cachedStatuses = null;
let cacheTimestamp = null;
let pollingIntervalId = null;
let pollingCallback = null;

// Utility: returns fixed time string for logs (ISO 8601 format)
const getFixedTime = () => new Date().toISOString();

// Initialize cache from localStorage
try {
  const savedCache = localStorage.getItem('cachedStatuses');
  const savedTimestamp = localStorage.getItem('cacheTimestamp');

  if (savedCache && savedTimestamp) {
    cachedStatuses = JSON.parse(savedCache);
    cacheTimestamp = Number(savedTimestamp);
    console.log(
      `[${getFixedTime()}][Cache Init] Loaded cache with ${cachedStatuses.length} statuses, timestamp: ${new Date(
        cacheTimestamp
      ).toISOString()}`
    );
  } else {
    console.log(`[${getFixedTime()}][Cache Init] No existing cache found in localStorage.`);
  }
} catch (e) {
  console.error(`[${getFixedTime()}][Cache Init] Failed to load cache from localStorage:`, e);
}

const saveCacheToLocalStorage = () => {
  try {
    if (!cacheTimestamp) {
      console.warn(`[${getFixedTime()}][Cache Save] No cache timestamp set, skipping save.`);
      return;
    }
    const cacheToSave = cachedStatuses?.map(({ blobUrl, ...rest }) => rest) || [];
    localStorage.setItem('cachedStatuses', JSON.stringify(cacheToSave));
    localStorage.setItem('cacheTimestamp', cacheTimestamp.toString());
    console.log(
      `[${getFixedTime()}][Cache Save] Cache saved with ${cacheToSave.length} statuses at ${new Date(
        cacheTimestamp
      ).toISOString()}`
    );
  } catch (e) {
    console.error(`[${getFixedTime()}][Cache Save] Failed to save cache to localStorage:`, e);
  }
};

const isCacheValid = () => {
  if (!cacheTimestamp) return false;
  const age = Date.now() - cacheTimestamp;
  return age < CACHE_DURATION_MS;
};

const generateThumbnail = async (mediaUrl) => {
  if (!mediaUrl) return null;

  try {
    const res = await fetch('http://localhost:5000/api/getMediaByUrl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ media_url: mediaUrl }),
    });

    if (!res.ok) {
      console.error(`[${getFixedTime()}][Thumbnail] Failed to fetch media for thumbnail. Status: ${res.status}`);
      return null;
    }

    const blob = await res.blob();
    const type = blob.type;

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result;

        if (type.startsWith('image/')) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 64, 64);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          };
          img.onerror = (err) => {
            console.error(`[${getFixedTime()}][Thumbnail] Image load error:`, err);
            reject(err);
          };
          img.src = src;
        } else if (type.startsWith('video/')) {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.muted = true;
          video.src = src;
          video.onloadeddata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, 64, 64);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          };
          video.onerror = (err) => {
            console.error(`[${getFixedTime()}][Thumbnail] Video load error:`, err);
            reject(err);
          };
        } else {
          resolve(null);
        }
      };
      reader.onerror = (err) => {
        console.error(`[${getFixedTime()}][Thumbnail] FileReader error:`, err);
        reject(err);
      };
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error(`[${getFixedTime()}][Thumbnail] Failed to generate thumbnail:`, e);
    return null;
  }
};

export const updateStatusMediaUrl = (statusId, newMediaUrl) => {
  if (!cachedStatuses) return;

  cachedStatuses = cachedStatuses.map((status) => {
    if (status.status_id === statusId) {
      if (status.media_url !== newMediaUrl) {
        console.log(`[${getFixedTime()}][updateStatusMediaUrl] Updating media_url for status_id ${statusId}`);
        return { ...status, media_url: newMediaUrl };
      }
    }
    return status;
  });

  cacheTimestamp = Date.now();
  saveCacheToLocalStorage();
};

export const fetchAllStatuses = async () => {
  try {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      console.warn(`[${getFixedTime()}][fetchAllStatuses] No user found in localStorage. Returning cached or empty array.`);
      return cachedStatuses || [];
    }

    let user;
    try {
      user = JSON.parse(rawUser);
      console.log(`[${getFixedTime()}][fetchAllStatuses] Loaded user_id: ${user.user_id}`);
    } catch {
      console.error(`[${getFixedTime()}][fetchAllStatuses] Failed to parse user from localStorage.`);
      return cachedStatuses || [];
    }

    // If cache valid, return immediately
    if (cachedStatuses && isCacheValid()) {
      console.log(`[${getFixedTime()}][fetchAllStatuses] Returning valid cached data immediately.`);
      return cachedStatuses;
    }

    // Cache not valid or empty, fetch fresh
    const freshData = await refreshStatusesFromBackend(user.user_id);
    return freshData;
  } catch (e) {
    console.error(`[${getFixedTime()}][fetchAllStatuses] Unexpected error:`, e);
    return cachedStatuses || [];
  }
};

const refreshStatusesFromBackend = async (user_id) => {
  try {
    console.log(`[${getFixedTime()}][refreshStatusesFromBackend] Fetching statuses for user_id:`, user_id);

    const res = await fetch('http://localhost:5000/api/getAllStatuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id }),
    });

    if (!res.ok) {
      console.error(`[${getFixedTime()}][refreshStatusesFromBackend] Failed to fetch statuses. Status: ${res.status}`);
      return cachedStatuses || [];
    }

    const data = await res.json();
    console.log(`[${getFixedTime()}][refreshStatusesFromBackend] Received ${data.statuses.length} statuses from server.`);

    const statusesWithThumbnails = await Promise.all(
      data.statuses.map(async (status) => {
        const thumbnail = await generateThumbnail(status.media_url);
        return { ...status, thumbnail };
      })
    );

    cachedStatuses = statusesWithThumbnails;
    cacheTimestamp = Date.now();
    saveCacheToLocalStorage();
    console.log(`[${getFixedTime()}][refreshStatusesFromBackend] Cache updated with latest data and thumbnails.`);

    // Notify any polling subscriber about new data
    if (pollingCallback) pollingCallback(cachedStatuses);

    return cachedStatuses;
  } catch (e) {
    console.error(`[${getFixedTime()}][refreshStatusesFromBackend] Unexpected error:`, e);
    return cachedStatuses || [];
  }
};

export const getCachedStatuses = () => cachedStatuses;

export const clearStatusCache = () => {
  cachedStatuses = null;
  cacheTimestamp = null;
  localStorage.removeItem('cachedStatuses');
  localStorage.removeItem('cacheTimestamp');
  console.log(`[${getFixedTime()}][Cache Clear] Cache cleared.`);
};

export const startPollingStatuses = (onUpdate) => {
  if (pollingIntervalId !== null) {
    console.log(`[${getFixedTime()}][Polling] Polling already started.`);
    return () => {}; // Return noop unsubscribe if already started
  }

  pollingCallback = onUpdate;

  console.log(`[${getFixedTime()}][Polling] Starting polling immediately.`);

  // Call fetchAllStatuses once so caller gets cached data immediately if valid
  fetchAllStatuses().then((data) => {
    if (onUpdate) onUpdate(data);
  });

  pollingIntervalId = setInterval(async () => {
    console.log(`[${getFixedTime()}][Polling] Polling triggered.`);

    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      console.warn(`[${getFixedTime()}][Polling] No user found in localStorage during polling.`);
      return;
    }

    let user;
    try {
      user = JSON.parse(rawUser);
    } catch {
      console.error(`[${getFixedTime()}][Polling] Failed to parse user during polling.`);
      return;
    }

    // Always fetch fresh data from backend during polling
    const freshData = await refreshStatusesFromBackend(user.user_id);
    if (onUpdate) onUpdate(freshData);

  }, 5 * 1000); // Poll every 5 seconds

  // Return unsubscribe function to stop polling
  return () => {
    if (pollingIntervalId !== null) {
      clearInterval(pollingIntervalId);
      pollingIntervalId = null;
      console.log(`[${getFixedTime()}][Polling] Polling stopped.`);
    }
  };
};

export const stopPollingStatuses = () => {
  if (pollingIntervalId !== null) {
    clearInterval(pollingIntervalId);
    pollingIntervalId = null;
    console.log(`[${getFixedTime()}][Polling] Polling stopped.`);
  } else {
    console.log(`[${getFixedTime()}][Polling] Polling was not running.`);
  }
};
