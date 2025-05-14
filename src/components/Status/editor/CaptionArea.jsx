import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './styles';

const CaptionArea = ({ caption, setCaption, closeEditor, onSend }) => {
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
          console.log('ChevronRight clicked, caption:', caption);
          try {
            if (onSend) {
              await onSend(caption); // Trigger the save action in MediaEditor
              console.log('Save action triggered successfully');
            } else {
              console.warn('onSend function not provided');
            }
            closeEditor(); // Close editor after attempting save
          } catch (error) {
            console.error('Failed to trigger save action:', error);
          }
        }}
        style={styles.sendBtn}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default CaptionArea;