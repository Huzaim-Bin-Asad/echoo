import React from 'react';
import styles from './styles';

const DrawingTools = ({ drawingThickness, setDrawingThickness, THICKNESS }) => {
  return (
    <div style={styles.drawingTools}>
      <div style={styles.thicknessSelector}>
        {THICKNESS.map((t) => (
          <button
            key={t}
            onClick={() => setDrawingThickness(t)}
            style={{
              ...styles.thicknessBtn,
              backgroundColor: drawingThickness === t ? '#4cff4c' : 'transparent',
              padding: '5px 15px',
              borderRadius: '5px',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              width: '60px',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={16 + t * 2}
              height={16 + t * 2}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-paintbrush-vertical"
            >
              <path d="M10 2v2" />
              <path d="M14 2v4" />
              <path d="M17 2a1 1 0 0 1 1 1v9H6V3a1 1 0 0 1 1-1z" />
              <path d="M6 12a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v2.9a2 2 0 1 0 4 0V17a1 1 0 0 1 1-1h2a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DrawingTools;