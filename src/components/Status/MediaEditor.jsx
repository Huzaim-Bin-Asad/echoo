import React, { useState, useRef, useEffect } from 'react';
import { Play, ChevronRight, Undo2, X } from 'lucide-react';
import styles from './statusStyle';

const COLORS = [
  '#ffffff', '#000000', '#ff4c4c', '#4cff4c', '#4c4cff', '#ffff4c', 
  '#ff4cff', '#4cffff', '#ff8c00', '#8b008b', '#00ff00', '#ff0000',
  '#00ced1', '#ffd700', '#ff69b4', '#4682b4', '#9acd32', '#20b2aa'
];
const THICKNESS = [2, 4, 6];

const MediaEditor = ({ fileUrl, fileType, onClose }) => {
  const isVideo = fileType?.startsWith('video/');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const drawingRef = useRef(null);
  const stripRef = useRef(null);
  const scrubberRef = useRef(null);
  const topRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [caption, setCaption] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const [thumbWidth, setThumbWidth] = useState(50);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawingColor, setDrawingColor] = useState(COLORS[0]);
  const [drawingThickness, setDrawingThickness] = useState(THICKNESS[1]);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  // Ensure media fits the container responsively
  const mediaStyle = {
    ...styles.video,
    width: '100%',
    height: 'auto',
    maxWidth: '100%',
    objectFit: 'contain',
  };

  useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;
    const onMeta = async () => {
      setDuration(video.duration);
      await new Promise((r) => (video.readyState >= 2 ? r() : video.addEventListener('loadeddata', r, { once: true })));
      await requestAnimationFrame(() => {});
      generateThumbnails();
    };
    video.addEventListener('loadedmetadata', onMeta);
    video.ontimeupdate = () => !scrubbing && setCurrentTime(video.currentTime);

    const endScrub = () => setScrubbing(false);
    window.addEventListener('mouseup', endScrub);
    window.addEventListener('touchend', endScrub);
    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      window.removeEventListener('mouseup', endScrub);
      window.removeEventListener('touchend', endScrub);
    };
  }, [isVideo]);

  useEffect(() => {
    if (!duration) return;
    const percent = (currentTime / duration) * 100;
    [scrubberRef.current, topRef.current].forEach((ref) => {
      if (ref) ref.style.left = `${percent}%`;
    });
  }, [currentTime, duration]);

  const seekTo = (time) =>
    new Promise((res) => {
      const v = videoRef.current;
      const done = () => (v.removeEventListener('seeked', done), res());
      v.addEventListener('seeked', done);
      v.currentTime = time;
      setTimeout(done, 500);
    });

  const generateThumbnails = async () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    const s = stripRef.current;
    if (!v || !c || !s) return;

    const ctx = c.getContext('2d');
    const sw = s.offsetWidth || window.innerWidth;
    const thumbH = 50;
    const thumbW = (v.videoWidth / v.videoHeight || 16 / 9) * thumbH;
    setThumbWidth(thumbW);
    c.width = thumbW;
    c.height = thumbH;

    const count = Math.max(1, Math.floor(sw / thumbW));
    const step = duration / count;
    const result = [];

    for (let i = 0; i < count; i++) {
      try {
        await seekTo(i * step);
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(v, 0, 0, c.width, c.height);
        result.push(c.toDataURL('image/jpeg', 0.8));
      } catch {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, c.width, c.height);
        result.push(c.toDataURL());
      }
    }
    setThumbnails(result);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (isPlaying) v.pause();
    else v.play();
    setIsPlaying(!isPlaying);
  };

  const startScrub = (e) => {
    setScrubbing(true);
    scrub(e);
  };

  const scrub = (e) => {
    if (!scrubbing || !stripRef.current || !videoRef.current) return;
    const rect = stripRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const time = (x / rect.width) * duration;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleStart = (e) => {
    if (!drawingMode) return;
    const rect = drawingRef.current.getBoundingClientRect();
    const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
    const y = (e.touches?.[0]?.clientY ?? e.clientY) - rect.top;
    setCurrentPath([{ x, y }]);
  };

  const handleMove = (e) => {
    if (!drawingMode || currentPath.length === 0) return;
    const rect = drawingRef.current.getBoundingClientRect();
    const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
    const y = (e.touches?.[0]?.clientY ?? e.clientY) - rect.top;
    setCurrentPath((prev) => [...prev, { x, y }]);
  };

  const handleEnd = () => {
    if (!drawingMode || currentPath.length === 0) return;
    setPaths((prev) => [...prev, { points: currentPath, color: drawingColor, thickness: drawingThickness }]);
    setCurrentPath([]);
  };

  const undo = () => setPaths((prev) => prev.slice(0, -1));

  const generateSVG = async () => {
    const canvas = drawingRef.current;
    const media = isVideo ? videoRef.current : drawingRef.current; // For images, use drawing canvas as placeholder
    const width = canvas.width;
    const height = canvas.height;

    // Get media as base64
    let mediaDataUrl = fileUrl;
    if (isVideo) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      mediaDataUrl = tempCanvas.toDataURL('image/png');
    }

    // Generate SVG paths
    const svgPaths = paths.map((path) => {
      const points = path.points.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x},${pt.y}`).join(' ');
      return `<path d="${points}" stroke="${path.color}" stroke-width="${path.thickness}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    }).join('');

    // Create SVG string
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <image href="${mediaDataUrl}" width="${width}" height="${height}"/>
        ${svgPaths}
      </svg>
    `;

    return svg;
  };

  const exitDrawingMode = async () => {
    if (paths.length > 0) {
      // Generate SVG when exiting drawing mode
      const svgContent = await generateSVG();
      console.log('Generated SVG:', svgContent);
      // Optionally, you can save or process the SVG here
    }
    setDrawingMode(false);
    setDrawingColor(COLORS[0]);
    setDrawingThickness(THICKNESS[1]);
    setCurrentPath([]);
  };

  const closeEditor = () => {
    setDrawingMode(false);
    setDrawingColor(COLORS[0]);
    setDrawingThickness(THICKNESS[1]);
    setPaths([]);
    setCurrentPath([]);
    setCaption('');
    if (isVideo) {
      setIsPlaying(false);
      setCurrentTime(0);
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
    onClose();
  };

  useEffect(() => {
    const canvas = drawingRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawLine = (points, color, thickness) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.beginPath();
      points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    };

    paths.forEach((p) => drawLine(p.points, p.color, p.thickness));
    if (currentPath.length > 0) drawLine(currentPath, drawingColor, drawingThickness);

    // Adjust canvas size to match media
    if (isVideo && videoRef.current) {
      canvas.width = videoRef.current.offsetWidth;
      canvas.height = videoRef.current.offsetHeight;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.6; // Adjust based on your layout
    }
  }, [paths, currentPath, isVideo]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.topBar}>
        {drawingMode ? (
          <div
            onClick={exitDrawingMode}
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
          {!drawingMode && (
            <button style={styles.iconBtn}>
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
          {drawingMode && (
            <>
              <div style={{ ...styles.colorStrip, marginRight: '10px', alignSelf: 'center' }}>
                {COLORS.map((c) => (
                  <div 
                    key={c} 
                    onClick={() => setDrawingColor(c)} 
                    style={{ 
                      ...styles.colorDot, 
                      backgroundColor: c, 
                      borderColor: drawingColor === c ? '#fff' : 'transparent' 
                    }} 
                  />
                ))}
              </div>
              <button onClick={undo} style={styles.iconBtn}>
                <Undo2 size={20} color="#fff" />
              </button>
            </>
          )}
          <button 
            onClick={() => setDrawingMode(true)} 
            style={styles.iconBtn}
          >
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
        </div>
      </div>

      {isVideo && !drawingMode && (
        <div style={{ position: 'relative' }}>
          <div ref={topRef} style={styles.topLine} />
          <div
            ref={stripRef}
            style={styles.thumbnailStrip}
            onMouseDown={startScrub}
            onMouseMove={scrub}
            onTouchStart={startScrub}
            onTouchMove={scrub}
          >
            {thumbnails.map((src, i) => (
              <img 
                key={i} 
                src={src} 
                alt={`thumb-${i}`} 
                style={{ width: thumbWidth, height: 50, objectFit: 'cover' }} 
              />
            ))}
            <div ref={scrubberRef} style={styles.scrubberLine} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>
      )}

      <div style={styles.mediaArea}>
        {isVideo ? (
          <video 
            ref={videoRef} 
            src={fileUrl} 
            style={mediaStyle} 
            playsInline 
          />
        ) : (
          <img 
            src={fileUrl} 
            alt="preview" 
            style={mediaStyle} 
          />
        )}
        <canvas
          ref={drawingRef}
          style={{
            ...styles.drawingCanvas,
            width: '100%',
            height: isVideo ? videoRef.current?.offsetHeight : 'auto',
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

      {isVideo && !drawingMode && (
        <div style={styles.controls}>
          <button onClick={togglePlay} style={styles.iconBtn}>
            <Play 
              size={24} 
              color="#fff" 
              style={{ transform: isPlaying ? 'rotate(90deg)' : 'none' }} 
            />
          </button>
        </div>
      )}

      {!drawingMode && (
        <div style={styles.captionArea}>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption..."
            style={styles.input}
          />
          <button 
            onClick={() => { console.log('Sending:', caption); closeEditor(); }} 
            style={styles.sendBtn}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {drawingMode && (
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
      )}

      {!drawingMode && (
        <div style={styles.footer}>
          <span>Status (Contacts)</span>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )}
    </div>
  );
};

export default MediaEditor;