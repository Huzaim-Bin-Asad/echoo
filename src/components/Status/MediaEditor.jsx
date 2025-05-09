import React, { useState, useRef, useEffect } from 'react';
import TopBar from './editor/TopBar';
import MediaArea from './editor/MediaArea';
import Controls from './editor/Controls';
import CaptionArea from './editor/CaptionArea';
import DrawingTools from './editor/DrawingTools';
import ThumbnailStrip from './editor/ThumbnailStrip';
import FontSelector from './editor/FontSelector';
import styles from './editor/styles';

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
  const [captionMode, setCaptionMode] = useState(false);

  const mediaStyle = {
    ...styles.video,
    width: '100%',
    height: '85.5vh',
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
    const canvas = drawingRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = ((e.touches?.[0]?.clientX ?? e.clientX) - rect.left) * scaleX;
    const y = ((e.touches?.[0]?.clientY ?? e.clientY) - rect.top) * scaleY;
    setCurrentPath([{ x, y }]);
  };

  const handleMove = (e) => {
    if (!drawingMode || currentPath.length === 0) return;
    const canvas = drawingRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = ((e.touches?.[0]?.clientX ?? e.clientX) - rect.left) * scaleX;
    const y = ((e.touches?.[0]?.clientY ?? e.clientY) - rect.top) * scaleY;
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
    const media = isVideo ? videoRef.current : drawingRef.current;
    const width = canvas.width;
    const height = canvas.height;

    let mediaDataUrl = fileUrl;
    if (isVideo) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      mediaDataUrl = tempCanvas.toDataURL('image/png');
    }

    const svgPaths = paths.map((path) => {
      const points = path.points.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x},${pt.y}`).join(' ');
      return `<path d="${points}" stroke="${path.color}" stroke-width="${path.thickness}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    }).join('');

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
      const svgContent = await generateSVG();
      console.log('Generated SVG:', svgContent);
    }
    setDrawingMode(false);
    setDrawingColor(COLORS[0]);
    setDrawingThickness(THICKNESS[1]);
    setCurrentPath([]);
  };

  const toggleCaptionMode = () => {
    setCaptionMode(!captionMode);
    if (!captionMode) {
      setDrawingMode(false);
    }
  };

  const closeEditor = () => {
    setDrawingMode(false);
    setCaptionMode(false);
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
    if (!ctx) return;

    let canvasWidth, canvasHeight;
    if (isVideo && videoRef.current) {
      canvasWidth = videoRef.current.offsetWidth;
      canvasHeight = videoRef.current.offsetHeight;
    } else {
      canvasWidth = drawingRef.current.parentElement.offsetWidth;
      canvasHeight = drawingRef.current.parentElement.offsetHeight * 0.6;
    }
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawLine = (points, color, thickness) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    };

    paths.forEach((p) => drawLine(p.points, p.color, p.thickness));
    if (currentPath.length > 0) drawLine(currentPath, drawingColor, drawingThickness);
  }, [paths, currentPath, isVideo, drawingColor, drawingThickness]);

  return (
    <div style={styles.wrapper}>
      <TopBar
        drawingMode={drawingMode}
        exitDrawingMode={exitDrawingMode}
        closeEditor={closeEditor}
        setDrawingMode={setDrawingMode}
        drawingColor={drawingColor}
        setDrawingColor={setDrawingColor}
        undo={undo}
        COLORS={COLORS}
        captionMode={captionMode}
        toggleCaptionMode={toggleCaptionMode}
      />
      {isVideo && !drawingMode && !captionMode && (
        <ThumbnailStrip
          thumbnails={thumbnails}
          thumbWidth={thumbWidth}
          stripRef={stripRef}
          scrubberRef={scrubberRef}
          topRef={topRef}
          canvasRef={canvasRef}
          startScrub={startScrub}
          scrub={scrub}
        />
      )}
      <MediaArea
        isVideo={isVideo}
        fileUrl={fileUrl}
        videoRef={videoRef}
        drawingRef={drawingRef}
        mediaStyle={mediaStyle}
        handleStart={handleStart}
        handleMove={handleMove}
        handleEnd={handleEnd}
      />
      {(drawingMode || captionMode) && (
        <div
          style={{
            position: 'absolute',
            right: '23px',
            top: '50%',
            transform: 'translateY(-67%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          <div
            onClick={() => setDrawingColor(drawingColor)} // Keep the current color at the top (no change)
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: drawingColor,
              border: '2px solid #fff', // Highlight the selected color
              cursor: 'pointer',
            }}
          />
          {COLORS.filter((c) => c !== drawingColor).map((c) => (
            <div
              key={c}
              onClick={() => setDrawingColor(c)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: c,
                border: '2px solid transparent',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}
      {isVideo && !drawingMode && !captionMode && (
        <Controls isPlaying={isPlaying} togglePlay={togglePlay} />
      )}
      {!drawingMode && !captionMode && (
        <CaptionArea caption={caption} setCaption={setCaption} closeEditor={closeEditor} />
      )}
      {drawingMode && (
        <DrawingTools
          drawingThickness={drawingThickness}
          setDrawingThickness={setDrawingThickness}
          THICKNESS={THICKNESS}
        />
      )}
      {captionMode && <FontSelector />}
      {!drawingMode && !captionMode && (
        <div style={styles.footer}>
          <span>Status (Contacts)</span>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )}
    </div>
  );
};

export default MediaEditor;