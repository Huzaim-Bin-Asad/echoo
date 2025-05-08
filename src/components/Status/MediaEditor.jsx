import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Brush, ChevronRight, Undo2 } from 'lucide-react';

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
  }, [paths, currentPath]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.topBar}>
        <button onClick={onClose} style={styles.iconBtn}>
          <X size={24} color="#fff" />
        </button>
        <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
          <button 
            onClick={() => setDrawingMode(!drawingMode)} 
            style={styles.iconBtn}
          >
            <Brush size={24} color={drawingMode ? drawingColor : '#fff'} />
          </button>
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
              <button onClick={undo} style={styles.iconBtn}>
                <Undo2 size={20} color="#fff" />
              </button>
              <div style={styles.colorStrip}>
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
            </>
          )}
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
            style={styles.video} 
            playsInline 
          />
        ) : (
          <img 
            src={fileUrl} 
            alt="preview" 
            style={styles.video} 
          />
        )}
        <canvas
          ref={drawingRef}
          width={window.innerWidth}
          height={window.innerHeight}
          style={styles.drawingCanvas}
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
            onClick={() => { console.log('Sending:', caption); onClose(); }} 
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
            backgroundColor: drawingThickness === t ? 'transparent' : 'transparent',
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

const styles = {
  wrapper: { 
    backgroundColor: '#000', 
    color: '#fff', 
    position: 'fixed', 
    inset: 0, 
    zIndex: 9999, 
    display: 'flex', 
    flexDirection: 'column' 
  },
  topBar: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '10px 15px', 
    backgroundColor: 'rgba(0,0,0,0.7)' 
  },
  iconBtn: { 
    background: 'none', 
    border: 'none', 
    cursor: 'pointer' 
  },
  topLine: { 
    position: 'absolute', 
    top: 0, 
    width: '2px', 
    height: '4px', 
    backgroundColor: '#fff', 
    zIndex: 2 
  },
  thumbnailStrip: { 
    height: 60, 
    backgroundColor: '#222', 
    overflowX: 'auto', 
    display: 'flex', 
    alignItems: 'center', 
    padding: '5px 15px', 
    position: 'relative' 
  },
  scrubberLine: { 
    position: 'absolute', 
    top: 5, 
    width: '2px', 
    height: '60px', 
    backgroundColor: '#fff', 
    zIndex: 1, 
    pointerEvents: 'none' 
  },
  mediaArea: { 
    flex: 1, 
    position: 'relative', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#000', 
    overflow: 'hidden' 
  },
  video: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'contain' 
  },
  drawingCanvas: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    touchAction: 'none' 
  },
  controls: { 
    display: 'flex', 
    justifyContent: 'center', 
    gap: 20, 
    margin: '10px 0' 
  },
  captionArea: { 
    margin: '10px 15px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: 10 
  },
  input: { 
    flex: 1, 
    padding: '10px', 
    backgroundColor: '#222', 
    border: 'none', 
    borderRadius: 20, 
    color: '#fff' 
  },
  sendBtn: { 
    backgroundColor: '#007bff', 
    border: 'none', 
    borderRadius: '50%', 
    padding: '10px', 
    color: '#fff', 
    cursor: 'pointer', 
    width: 40, 
    height: 40, 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  footer: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    fontSize: 12, 
    color: '#ccc', 
    padding: '0 15px 10px' 
  },
  colorStrip: { 
    position: 'absolute',
    top: 50,
    left: 0,
    display: 'flex', 
    flexDirection: 'column',
    gap: 5, 
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 100px)',
    padding: '10px 15px', 
    backgroundColor: 'transparent',
    zIndex: 1000
  },
  colorDot: { 
    width: 30, 
    height: 30, 
    borderRadius: '50%', 
    border: '2px solid', 
    cursor: 'pointer' 
  },
  drawingTools: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 10 
  },
  thicknessSelector: { 
    display: 'flex', 
    gap: 15, 
    padding: '0 15px',
    justifyContent: 'center',
    alignItems: 'center'
  },
  thicknessBtn: { 
    padding: '5px 15px', 
    borderRadius: 5, 
    border: 'none', 
    color: '#fff', 
    cursor: 'pointer',
    width: 60,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default MediaEditor;