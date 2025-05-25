import React from 'react';
import styles from './styles';

const ThumbnailStrip = ({
  thumbnails,
  thumbWidth,
  stripRef,
  scrubberRef,
  topRef,
  canvasRef,
  startScrub,
  scrub,
}) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div ref={topRef} style={styles.topLine} />
      <div
        ref={stripRef}
        style={styles.thumbnailStrip}
        onMouseDown={startScrub}
        onMouseMove={scrub}
        onTouchStart={startScrub}
        onTouchMove={scrub}
      >
        {thumbnails.length > 0 ? (
          thumbnails.map((thumb, i) => (
            <img
              key={i}
              src={thumb.dataUrl}
              alt={`thumb-${i}`}
              style={{
                width: thumbWidth,
                height: 50,
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
          ))
        ) : (
          <div style={{ color: '#fff', padding: '10px' }}>Loading thumbnails...</div>
        )}
        <div ref={scrubberRef} style={styles.scrubberLine} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default ThumbnailStrip;