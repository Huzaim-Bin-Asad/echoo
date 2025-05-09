import React from 'react';
import { X, Undo2, WrapText, MessageSquareDashed } from 'lucide-react';
import styles from './styles';

const TopBar = ({
  drawingMode,
  exitDrawingMode,
  closeEditor,
  setDrawingMode,
  drawingColor,
  setDrawingColor,
  undo,
  COLORS,
  captionMode,
  toggleCaptionMode,
}) => {
  return (
    <div style={styles.topBar}>
      {(drawingMode || captionMode) ? (
        <div
          onClick={drawingMode ? exitDrawingMode : toggleCaptionMode}
          style={{
            backgroundColor: '#ccc',
            color: '#000',
            borderRadius: '20px',
            padding: '5px 15px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Done
        </div>
      ) : (
        <button onClick={closeEditor} style={styles.iconBtn}>
          <X size={24} color="#fff" />
        </button>
      )}
      <div style={{ display: 'flex', gap: '10px', position: 'relative', marginLeft: 'auto' }}>
        {!drawingMode && !captionMode && (
          <button onClick={toggleCaptionMode} style={styles.iconBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 20h16"></path>
              <path d="m6 16 6-12 6 12"></path>
              <path d="M8 12h8"></path>
            </svg>
          </button>
        )}
        {captionMode && (
          <>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgb(51, 51, 51)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <WrapText size={24} color="#fff" />
            </div>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgb(51, 51, 51)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <MessageSquareDashed size={24} color="#fff" />
            </div>
          </>
        )}
        {drawingMode && (
          <button onClick={undo} style={styles.iconBtn}>
            <Undo2 size={20} color="#fff" />
          </button>
        )}
        {!captionMode && (
          <button onClick={() => setDrawingMode(true)} style={styles.iconBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={drawingMode ? drawingColor : '#fff'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-brush"
            >
              <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
              <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;