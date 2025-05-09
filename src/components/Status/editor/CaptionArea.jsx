import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './styles';

const CaptionArea = ({ caption, setCaption, closeEditor }) => {
  return (
    <div style={styles.captionArea}>
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Add a caption..."
        style={styles.input}
      />
      <button
        onClick={() => {
          console.log('Sending:', caption);
          closeEditor();
        }}
        style={styles.sendBtn}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default CaptionArea;