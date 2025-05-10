import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './styles';

const CaptionArea = ({ caption, setCaption, closeEditor, onSave }) => {
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
        onClick={async () => {
          console.log('Sending:', caption);
          if (onSave) {
            try {
              await onSave(); // Ensure async execution
              console.log('Image saved successfully');
            } catch (error) {
              console.error('Failed to save image:', error);
            }
          }
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