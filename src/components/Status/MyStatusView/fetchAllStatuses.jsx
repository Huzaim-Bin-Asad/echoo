const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

let cachedStatuses = null;
let cacheTimestamp = null;
let pollingIntervalId = null;
let pollingCallback = null;

const getFixedTime = () => new Date().toISOString();

// Initialize cache from localStorage if available
try {
  const savedCache = localStorage.getItem('cachedStatuses');
  const savedTimestamp = localStorage.getItem('cacheTimestamp');

  if (savedCache && savedTimestamp) {
    cachedStatuses = JSON.parse(savedCache);
    cacheTimestamp = Number(savedTimestamp);
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
    // Strip out blobUrl before saving cache (blob URLs are runtime only)
    const cacheToSave = cachedStatuses?.map(({ blobUrl, ...rest }) => rest) || [];
    localStorage.setItem('cachedStatuses', JSON.stringify(cacheToSave));
    localStorage.setItem('cacheTimestamp', cacheTimestamp.toString());
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
    } catch {
      console.error(`[${getFixedTime()}][fetchAllStatuses] Failed to parse user from localStorage.`);
      return cachedStatuses || [];
    }

    if (cachedStatuses && isCacheValid()) {
      return cachedStatuses;
    }

    const freshData = await refreshStatusesFromBackend(user.user_id);
    return freshData;
  } catch (e) {
    console.error(`[${getFixedTime()}][fetchAllStatuses] Unexpected error:`, e);
    return cachedStatuses || [];
  }
};

const refreshStatusesFromBackend = async (user_id) => {
  try {
    // Prepare cached statuses without blobUrl for sending
    const cachedToSend = (cachedStatuses || []).map(({ blobUrl, ...rest }) => rest);

    const res = await fetch('http://localhost:5000/api/getAllStatuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id,
        cached_statuses: cachedToSend, // send cached statuses to backend for optimization
      }),
    });

    if (!res.ok) {
      console.error(`[${getFixedTime()}][refreshStatusesFromBackend] Failed to fetch statuses. Status: ${res.status}`);
      return cachedStatuses || [];
    }

    const data = await res.json();

    // Remove invalid cached statuses reported by backend
    if (data.invalid_caches && data.invalid_caches.length > 0) {
      const invalidIds = new Set(data.invalid_caches.map(s => s.status_id));
      cachedStatuses = (cachedStatuses || []).filter(status => !invalidIds.has(status.status_id));
      cacheTimestamp = Date.now();
      saveCacheToLocalStorage();
      console.info(`[${getFixedTime()}][Cache Cleanup] Removed invalid caches:`, invalidIds);
    }

    // For each status, keep cached thumbnail and blobUrl if is_cached is true, else generate new thumbnail
    const statusesWithThumbnails = await Promise.all(
      data.statuses.map(async (status) => {
        if (status.is_cached) {
          const cachedEntry = (cachedStatuses || []).find(s => s.status_id === status.status_id);
          if (cachedEntry) {
            return { ...status, thumbnail: cachedEntry.thumbnail || null, blobUrl: cachedEntry.blobUrl || null };
          }
        }
        const thumbnail = await generateThumbnail(status.media_url);
        return { ...status, thumbnail };
      })
    );

    cachedStatuses = statusesWithThumbnails;
    cacheTimestamp = Date.now();
    saveCacheToLocalStorage();

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
};

export const startPollingStatuses = (onUpdate) => {
  if (pollingIntervalId !== null) {
    return () => {};
  }

  pollingCallback = onUpdate;

  fetchAllStatuses().then((data) => {
    if (onUpdate) onUpdate(data);
  });

  pollingIntervalId = setInterval(async () => {
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

    const freshData = await refreshStatusesFromBackend(user.user_id);
    if (onUpdate) onUpdate(freshData);
  }, 5 * 1000); // Poll every 5 seconds

  return () => {
    if (pollingIntervalId !== null) {
      clearInterval(pollingIntervalId);
      pollingIntervalId = null;
    }
  };
};

export const stopPollingStatuses = () => {
  if (pollingIntervalId !== null) {
    clearInterval(pollingIntervalId);
    pollingIntervalId = null;
  }
};
