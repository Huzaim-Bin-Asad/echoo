import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, Text as TextIcon, Camera } from 'lucide-react';

const StatusHeader = ({ onClose }) => {
  return (
    <div className="px-4 pt-3 pb-2" style={{ background: 'transparent' }}>
      <div className="d-flex justify-content-center">
        <div
          style={{
            width: '50px',
            height: '6px',
            backgroundColor: '#888',
            borderRadius: '3px',
          }}
        />
      </div>

      <div className="d-flex align-items-center justify-content-between mt-3 mb-2">
        <button onClick={onClose} className="bg-transparent p-1 rounded border-0">
          <X size={16} />
        </button>
      </div>

      <h5 className="text-white text-center mb-2">Recent</h5>

      <div className="d-flex justify-content-center gap-3 mb-3">
        <button className="btn btn-secondary rounded-pill d-flex align-items-center gap-2 px-4 py-3">
          <TextIcon size={18} /> <span className="fs-5">Text</span>
        </button>
        <button className="btn btn-secondary rounded-pill d-flex align-items-center gap-2 px-4 py-3">
          <Mic size={18} /> <span className="fs-5">Voice</span>
        </button>
      </div>

      <div className="h-px bg-secondary mx-auto" style={{ width: '90%' }}></div>
    </div>
  );
};

const StatusBottomGrid = ({ hasGalleryPermission, mediaItems }) => {
  return (
    <div className="flex-grow-1 overflow-y-auto px-4 pb-5">
      {!hasGalleryPermission ? (
        <div className="text-center text-secondary">
          Gallery access required. Please grant permission.
        </div>
      ) : (
        <div className="row row-cols-3 g-2 mt-2">
          {/* Camera Item */}
          <div className="col position-relative">
            <div className="bg-secondary rounded overflow-hidden d-flex align-items-center justify-content-center" style={{ aspectRatio: '1/1' }}>
              <Camera size={28} className="text-white" />
            </div>
          </div>

          {/* Media Items */}
          {mediaItems.map((item) => (
            <div key={item.id} className="col position-relative">
              <div className="bg-secondary rounded overflow-hidden" style={{ aspectRatio: '1/1' }}>
                <img
                  src={item.thumbnail}
                  alt="media"
                  className="w-100 h-100 object-cover"
                />
                {item.isVideo && (
                  <span className="position-absolute bottom-0 end-0 text-xs text-white bg-dark bg-opacity-75 px-1 rounded m-1">
                    {item.duration}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatusPopup = ({ onClose }) => {
  const [translateY, setTranslateY] = useState(1000);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => setTranslateY(0));
    requestGalleryPermission();

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const requestGalleryPermission = async () => {
    try {
      setHasGalleryPermission(true);
    } catch (error) {
      console.error('Gallery permission denied:', error);
      setHasGalleryPermission(false);
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const deltaY = e.touches[0].clientY - startY.current;
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (translateY > 120) {
      setTranslateY(1000);
      setTimeout(() => onClose(), 300);
    } else {
      setTranslateY(0);
    }
  };

  const mediaItems = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    isVideo: i % 4 === 0,
    duration: ['0:11', '0:29', '0:38'][i % 3],
    thumbnail: `/placeholder/media${i % 5}.jpg`,
  }));

  return (
    <div
      className="status-popup-container"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'transparent',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        touchAction: 'none',
      }}
    >
      <div
        className="status-popup"
        style={{
          height: '85vh',
          backgroundColor: '#121212',
          color: 'white',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.4)',
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : 'transform 0.45s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <StatusHeader onClose={onClose} />
        <StatusBottomGrid hasGalleryPermission={hasGalleryPermission} mediaItems={mediaItems} />
      </div>
    </div>
  );
};

export default StatusPopup;
