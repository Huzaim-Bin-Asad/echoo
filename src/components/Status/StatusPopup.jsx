import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, Text as TextIcon, Camera, ChevronDown } from 'lucide-react';

const StatusHeader = ({ onClose }) => {
  return (
    <div className="px-4 pt-4 pb-3" style={{ background: 'transparent' }}>
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

      <div className="d-flex align-items-center justify-content-between mt-3">
        <button onClick={onClose} className="bg-transparent p-2 rounded border-0 mt-1">
          <X size={20} className="text-white" />
        </button>

        <div className="d-flex align-items-center justify-content-center pe-2 pb-1" 
        style={{ marginRight: "130px"}}
        >
          <h5 className="text-white text-center mb-0 me-1">Recent</h5>
          <ChevronDown size={18} className="text-white" />
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3 mt-3 mb-3">
        <button
          className="btn btn-secondary d-flex align-items-center gap-2 px-4 py-3"
          style={{ borderRadius: '13px' }}
        >
          <TextIcon size={28} /> <span className="fs-5 fw-semibold">Text</span>
        </button>
        <button
          className="btn btn-secondary d-flex align-items-center gap-2 px-4 py-3"
          style={{ borderRadius: '13px' }}
        >
          <Mic size={28} /> <span className="fs-5 fw-semibold">Voice</span>
        </button>
      </div>
      <hr className="border-light my-1" /> {/* Reduced margin after Read receipts */}

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
            <div
              className="bg-secondary rounded overflow-hidden d-flex align-items-center justify-content-center"
              style={{ aspectRatio: '1/1' }}
            >
              <Camera size={28} className="text-white" />
            </div>
          </div>

          {/* Media Items */}
          {mediaItems.map((item, idx) => (
            <div key={item.id} className="col position-relative">
              <div
                className="bg-secondary rounded overflow-hidden"
                style={{
                  aspectRatio: '1/1',
                  border: (idx + 1) % 5 === 0 ? '2px solid #555' : 'none',
                }}
              >
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
          height: '95vh',
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
