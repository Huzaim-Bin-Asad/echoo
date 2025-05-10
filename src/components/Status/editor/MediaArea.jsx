import React from 'react';
import styles from './styles';

const MediaArea = ({
  isVideo,
  fileUrl,
  videoRef,
  drawingRef,
  mediaStyle,
  handleStart,
  handleMove,
  handleEnd,
}) => {
  return (
    <div style={styles.mediaArea}>
      {isVideo ? (
        <video ref={videoRef} src={fileUrl} style={mediaStyle} playsInline />
      ) : (
        <img src={fileUrl} alt="preview" style={mediaStyle} />
      )}
      <canvas
        ref={drawingRef}
        style={{
          ...styles.drawingCanvas,
          width: '100%',
          height: isVideo ? videoRef.current?.offsetHeight : '86vh',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />
    </div>
  );
};

export default MediaArea;