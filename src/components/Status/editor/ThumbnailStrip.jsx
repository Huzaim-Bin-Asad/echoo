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
    <div style={{ position: 'relative' }}>
      <div ref={topRef} style={styles.topLine} />
      <div
        ref={stripRef}
        style={styles.thumbnailStrip}
        onMouseDown={startScrub}
        onMouseMove={scrub}
        onTouchStart={startScrub}
        onTouchMove={scrub}
      >
        {thumbnails.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`thumb-${i}`}
            style={{ width: thumbWidth, height: 50, objectFit: 'cover' }}
          />
        ))}
        <div ref={scrubberRef} style={styles.scrubberLine} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default ThumbnailStrip;