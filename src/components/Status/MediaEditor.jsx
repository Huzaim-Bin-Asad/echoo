import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Brush, Baseline, ChevronRight } from 'lucide-react';

const MediaEditor = ({ fileUrl, fileType, onClose }) => {
  const isVideo = fileType?.startsWith('video/');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
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

  return (
    <div style={styles.wrapper}>
      <div style={styles.topBar}>
        <button onClick={onClose} style={styles.iconBtn}><X size={24} color="#fff" /></button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={styles.iconBtn}><Baseline size={24} color="#fff" /></button>
          <button style={styles.iconBtn}><Brush size={24} color="#fff" /></button>
        </div>
      </div>

      {isVideo && (
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
              <img key={i} src={src} alt={`thumb-${i}`} style={{ width: thumbWidth, height: 50, objectFit: 'cover' }} />
            ))}
            <div ref={scrubberRef} style={styles.scrubberLine} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>
      )}

      <div style={styles.mediaArea}>
        {isVideo ? (
          <video ref={videoRef} src={fileUrl} style={styles.video}  playsInline />
        ) : (
          <img src={fileUrl} alt="preview" style={styles.video} />
        )}
      </div>

      {isVideo && (
        <div style={styles.controls}>
          <button onClick={togglePlay} style={styles.iconBtn}>
            <Play size={24} color="#fff" style={{ transform: isPlaying ? 'rotate(90deg)' : 'none' }} />
          </button>
        </div>
      )}

      <div style={styles.captionArea}>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          style={styles.input}
        />
        <button onClick={() => { console.log('Sending:', caption); onClose(); }} style={styles.sendBtn}>
          <ChevronRight size={24} />
        </button>
      </div>

      <div style={styles.footer}>
        <span>Status (Contacts)</span>
        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { backgroundColor: '#000', color: '#fff', position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column' },
  topBar: { display: 'flex', justifyContent: 'space-between', padding: '10px 15px', backgroundColor: 'rgba(0,0,0,0.7)' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer' },
  topLine: { position: 'absolute', top: 0, width: '2px', height: '4px', backgroundColor: '#fff', zIndex: 2 },
  thumbnailStrip: { height: 60, backgroundColor: '#222', overflowX: 'auto', display: 'flex', alignItems: 'center', padding: '5px 15px', position: 'relative' },
  scrubberLine: { position: 'absolute', top: 5, width: '2px', height: '60px', backgroundColor: '#fff', zIndex: 1, pointerEvents: 'none' },
  mediaArea: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', overflow: 'hidden' },
  video: { width: '100%', height: '100%', objectFit: 'contain' },
  controls: { display: 'flex', justifyContent: 'center', gap: 20, margin: '10px 0' },
  captionArea: { margin: '10px 15px', display: 'flex', alignItems: 'center', gap: 10 },
  input: { flex: 1, padding: '10px', backgroundColor: '#222', border: 'none', borderRadius: 20, color: '#fff' },
  sendBtn: { backgroundColor: '#007bff', border: 'none', borderRadius: '50%', padding: '10px', color: '#fff', cursor: 'pointer', width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  footer: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#ccc', padding: '0 15px 10px' }
};

export default MediaEditor;
