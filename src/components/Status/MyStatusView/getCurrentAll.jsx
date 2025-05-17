import React, { useEffect, useState } from 'react';

export default function AllStatuses() {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      console.log('[AllStatuses] Starting to fetch statuses...');
      
      const rawUser = localStorage.getItem('user');
      if (!rawUser) {
        console.warn('[AllStatuses] No user found in localStorage.');
        return;
      }

      let user;
      try {
        user = JSON.parse(rawUser);
        console.log('[AllStatuses] Parsed user from localStorage:', user);
      } catch (err) {
        console.error('[AllStatuses] Invalid user JSON in localStorage:', err);
        return;
      }

      try {
        console.log('[AllStatuses] Sending request to backend at /api/getAllStatuses');
        const res = await fetch('http://localhost:5000/api/getAllStatuses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.user_id }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error('[AllStatuses] Backend responded with error:', data.message);
          throw new Error(data.message);
        }

        console.log(`[AllStatuses] Received ${data.statuses.length} statuses from backend.`);

        // Fetch media blobs for each status
        const enrichedStatuses = await Promise.all(
          data.statuses.map(async (status, idx) => {
            console.log(`[AllStatuses] Fetching media for status ${status.status_id} (${idx + 1}/${data.statuses.length})`);
            try {
              const mediaRes = await fetch('http://localhost:5000/api/getMediaByUrl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ media_url: status.media_url }),
              });

              if (!mediaRes.ok) {
                console.warn(`[AllStatuses] Failed to fetch media for status ${status.status_id}: HTTP ${mediaRes.status}`);
                return status; // fallback without blobUrl
              }

              const blob = await mediaRes.blob();
              const blobUrl = URL.createObjectURL(blob);

              console.log(`[AllStatuses] Successfully fetched media for status ${status.status_id}`);

              return { ...status, blobUrl };
            } catch (err) {
              console.error(`[AllStatuses] Error fetching media for status ${status.status_id}:`, err);
              return status; // fallback without blobUrl
            }
          })
        );

        console.log('[AllStatuses] Setting enriched statuses in state.');
        setStatuses(enrichedStatuses);
      } catch (err) {
        console.error('[AllStatuses] Error during fetchStatuses:', err);
      }
    };

    fetchStatuses();
  }, []);

  if (statuses.length === 0) return <p style={{ padding: 16 }}>No statuses found.</p>;

  return (
    <div style={{ padding: 16, maxWidth: 500, margin: '0 auto' }}>
      {statuses.map((status) => (
        <div
          key={status.status_id}
          style={{
            backgroundColor: '#f1f1f1',
            marginBottom: 16,
            padding: 12,
            borderRadius: 8,
          }}
        >
          <p style={{ fontWeight: 'bold', marginBottom: 8 }}>
            {new Date(status.timestamp).toLocaleString()}
          </p>
          {status.blobUrl && status.blobUrl.includes('video') ? (
            <video
              src={status.blobUrl}
              controls
              style={{ maxWidth: '100%', borderRadius: 6 }}
            />
          ) : (
            <img
              src={status.blobUrl}
              alt="status"
              style={{ maxWidth: '100%', borderRadius: 6 }}
            />
          )}
          <p style={{ marginTop: 8 }}>{status.caption || 'No caption'}</p>
        </div>
      ))}
    </div>
  );
}
