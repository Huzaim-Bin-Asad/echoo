import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, ChevronDown, ChevronUp } from 'lucide-react';

const isMobileDevice = () => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const StatusHeader = ({
  onClose,
  folderListVisible,
  toggleFolderList,
  folders,
  selectedFolderName,
  onFolderSelect
}) => {
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

        <div
          className="d-flex align-items-center justify-content-center pe-2 pb-1"
          style={{ marginRight: '130px', cursor: 'pointer' }}
          onClick={toggleFolderList}
        >
          <h5 className="text-white bg-transparent text-center mb-0 me-1">
            {selectedFolderName}
          </h5>
          {folderListVisible ? (
            <ChevronUp size={18} className="text-white" />
          ) : (
            <ChevronDown size={18} className="text-white" />
          )}
        </div>
      </div>

      {folderListVisible && (
        <div className="mt-3 mb-2 px-3" style={{ maxHeight: '270px', overflowY: 'auto' }}>
          {folders.slice(0, 4).map((folder, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between bg-dark text-white rounded py-2 px-2 mb-2"
              style={{ height: '60px', cursor: 'pointer' }}
              onClick={() => onFolderSelect(folder.name)}
            >
              <img
                src={folder.latestImage}
                alt={folder.name}
                className="rounded"
                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
              />
              <div className="flex-grow-1 d-flex flex-column">
                <span className="fw-semibold">{folder.name}</span>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                  {folder.count} items
                </span>
              </div>
            </div>
          ))}

          {folders.length > 4 && (
            <div
              className="d-flex align-items-center justify-content-between bg-dark text-white rounded py-2 px-3 mb-2"
              style={{ height: '60px', cursor: 'pointer' }}
              onClick={() => console.log('Open full folder list')}
            >
              <div className="d-flex align-items-center">
                <Camera size={24} className="me-3 text-white" />
                <span className="fw-semibold">See More</span>
              </div>
            </div>
          )}
        </div>
      )}
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
          <div className="col position-relative">
            <div
              className="rounded overflow-hidden d-flex align-items-center justify-content-center"
              style={{
                aspectRatio: '1/1',
                backgroundColor: '#1e1e1e',
              }}
            >
              <Camera size={28} className="text-white" />
            </div>
          </div>

          {mediaItems.map((item, idx) => (
            <div key={item.id || idx} className="col position-relative">
              <div
                className="rounded overflow-hidden"
                style={{
                  aspectRatio: '1/1',
                  backgroundColor: '#1e1e1e',
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
  const [folderListVisible, setFolderListVisible] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFolderName, setSelectedFolderName] = useState('Recent');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const fileInputRef = useRef(null);

  console.log('Rendering StatusPopup, translateY:', translateY);

  const requestGalleryPermission = async () => {
    console.log('requestGalleryPermission called, isMobile:', isMobileDevice());
    if (isMobileDevice()) {
      try {
        console.log('Mobile: Setting hasGalleryPermission to true');
        setHasGalleryPermission(true);
      } catch (error) {
        console.error('Mobile gallery access error:', error);
        setHasGalleryPermission(false);
      }
    } else {
      if ('showDirectoryPicker' in window) {
        try {
          console.log('Desktop: Attempting showDirectoryPicker');
          const directoryHandle = await window.showDirectoryPicker();
          const imageFolders = [];
          const allMedia = [];

          for await (const [folderName, folderHandle] of directoryHandle.entries()) {
            const folder = { name: folderName, latestImage: '', count: 0, media: [] };
            let latestFileDate = 0;

            for await (const fileHandle of folderHandle.values()) {
              if (
                fileHandle.name.endsWith('.jpg') ||
                fileHandle.name.endsWith('.png') ||
                fileHandle.name.endsWith('.mp4')
              ) {
                const file = await fileHandle.getFile();
                const url = URL.createObjectURL(file);
                const isVideo = fileHandle.name.endsWith('.mp4');

                const mediaItem = {
                  id: fileHandle.name,
                  thumbnail: url,
                  isVideo,
                  duration: isVideo ? '0:30' : null,
                };

                folder.media.push(mediaItem);
                allMedia.push(mediaItem);

                if (file.lastModified > latestFileDate) {
                  folder.latestImage = url;
                  latestFileDate = file.lastModified;
                }

                folder.count += 1;
              }
            }

            if (folder.count > 0) imageFolders.push(folder);
          }

          console.log('Desktop: Found folders:', imageFolders);
          if (imageFolders.length > 0) {
            setFolders(imageFolders);
            setSelectedMedia(allMedia);
            setHasGalleryPermission(true);
          } else {
            setHasGalleryPermission(false);
          }
        } catch (error) {
          console.error('Desktop gallery access error:', error);
          setHasGalleryPermission(false);
        }
      } else {
        console.log('File System Access API not supported');
        setHasGalleryPermission(false);
      }
    }
  };

  const handleFileSelect = (event) => {
    console.log('handleFileSelect called');
    try {
      const files = Array.from(event.target.files);
      console.log('Selected files:', files);
      const imageFolders = [{ name: 'Recent', latestImage: '', count: 0, media: [] }];
      const allMedia = [];

      files.forEach((file) => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          const url = URL.createObjectURL(file);
          const isVideo = file.type.startsWith('video/');
          const mediaItem = {
            id: file.name,
            thumbnail: url,
            isVideo,
            duration: isVideo ? '0:30' : null,
          };

          imageFolders[0].media.push(mediaItem);
          allMedia.push(mediaItem);
          imageFolders[0].count += 1;

          if (!imageFolders[0].latestImage) {
            imageFolders[0].latestImage = url;
          }
        }
      });

      console.log('Processed folders:', imageFolders);
      if (imageFolders[0].count > 0) {
        setFolders(imageFolders);
        setSelectedMedia(allMedia);
        setHasGalleryPermission(true);
      } else {
        setHasGalleryPermission(false);
      }
    } catch (error) {
      console.error('Error processing files:', error);
      setHasGalleryPermission(false);
    }
  };

  useEffect(() => {
    setTranslateY(0); // Animate popup into view
    requestGalleryPermission();
  }, []);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const deltaY = e.touches[0].clientY - startY.current;
    if (deltaY > 0) setTranslateY(deltaY);
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

  const handleFolderSelect = (folderName) => {
    setSelectedFolderName(folderName); // Fixed syntax error
    setFolderListVisible(false);

    if (folderName === 'Recent') {
      const allMedia = folders.flatMap((f) => f.media);
      setSelectedMedia(allMedia);
    } else {
      const folder = folders.find((f) => f.name === folderName);
      setSelectedMedia(folder?.media || []);
    }
  };

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
          transition: 'transform 0.3s ease-out',
          transform: `translateY(${translateY}px)`,
          width: '100%',
          willChange: 'transform',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <StatusHeader
          onClose={onClose}
          folderListVisible={folderListVisible}
          toggleFolderList={() => setFolderListVisible(!folderListVisible)}
          folders={folders}
          selectedFolderName={selectedFolderName}
          onFolderSelect={handleFolderSelect}
        />
        <StatusBottomGrid
          hasGalleryPermission={hasGalleryPermission}
          mediaItems={selectedMedia}
        />
        {isMobileDevice() && !hasGalleryPermission && (
          <div className="text-center py-3">
            <button
              className="btn btn-primary"
              onClick={() => fileInputRef.current.click()}
            >
              Select Photos or Videos
            </button>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPopup;