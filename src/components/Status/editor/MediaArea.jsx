import React from 'react';
import styles from './styles';

const MediaArea = ({
  isVideo,
  fileUrl,
  videoRef,
  drawingRef,
  mediaStyle,
  paths,
  currentPath,
  drawingColor,
  drawingThickness,
}) => {
  return (
    <div style={styles.mediaArea}>
      {isVideo ? (
        <video ref={videoRef} src={fileUrl} style={mediaStyle} playsInline />
      ) : (
        <img src={fileUrl} alt="preview" style={mediaStyle} />
      )}
      <svg
        ref={drawingRef}
        style={{
          ...styles.drawingCanvas, // Reusing canvas styles, rename to drawingSvg in styles.js if needed
          width: '100%',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
          touchAction: 'none',
          zIndex: 1,
          pointerEvents: 'auto',
         }}
      >
        {/* Render saved paths */}
        {paths.map((p, index) => (
          <path
            key={index}
            d={p.points.reduce((acc, pt, i) => `${acc}${i === 0 ? 'M' : 'L'}${pt.x},${pt.y}`, '')}
            stroke={p.color}
            strokeWidth={p.thickness}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {/* Render current path */}
        {currentPath.length > 0 && (
          <path
            d={currentPath.reduce((acc, pt, i) => `${acc}${i === 0 ? 'M' : 'L'}${pt.x},${pt.y}`, '')}
            stroke={drawingColor}
            strokeWidth={drawingThickness}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

      </svg>
    </div>
  );
};

export default MediaArea;