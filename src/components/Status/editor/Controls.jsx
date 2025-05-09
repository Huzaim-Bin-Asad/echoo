import React from 'react';
import { Play } from 'lucide-react';
import styles from './styles';

const Controls = ({ isPlaying, togglePlay }) => {
  return (
    <div style={styles.controls}>
      <button onClick={togglePlay} style={styles.iconBtn}>
        <Play
          size={24}
          color="#fff"
          style={{ transform: isPlaying ? 'rotate(90deg)' : 'none' }}
        />
      </button>
    </div>
  );
};

export default Controls;