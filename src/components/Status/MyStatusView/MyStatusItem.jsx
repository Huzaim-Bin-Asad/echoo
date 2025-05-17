import React, { useEffect, useState } from 'react';
import { MoreVertical } from 'lucide-react';

export default function MyStatusItem() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const rawUser = localStorage.getItem('user');
      if (!rawUser) return;

      let user;
      try {
        user = JSON.parse(rawUser);
      } catch {
        console.error('Invalid user JSON in localStorage');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/getCurrentStatus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.user_id }),
        });

        if (!response.ok) {
          console.error('Failed to fetch status', response.status);
          return;
        }

        const blob = await response.blob();
        const timestampHeader = response.headers.get('x-status-timestamp');
        const timestamp = timestampHeader
          ? new Date(Number(timestampHeader)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '';

        const mediaUrl = URL.createObjectURL(blob);

        setStatus({
          thumbnailUrl: mediaUrl,
          timestamp,
        });
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchStatus();
  }, []);

  if (!status)
    return (
      <p style={{ padding: '1rem', color: '#555', backgroundColor: '#f8f9fa', margin: 0 }}>
        No current status available.
      </p>
    );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        cursor: 'pointer',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        backgroundColor: '#ffffff', // light background
        userSelect: 'none',
        color: '#212529', // dark text
        borderRadius: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#e9ecef', // light gray wrapper
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <img
            src={status.thumbnailUrl}
            alt="Status Thumbnail"
            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>

        <p
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: '#212529',
            margin: 0,
            whiteSpace: 'nowrap',
          }}
        >
          Yesterday, {status.timestamp}
        </p>
      </div>

      <MoreVertical size={28} style={{ color: '#6c757d', flexShrink: 0 }} />
    </div>
  );
}
