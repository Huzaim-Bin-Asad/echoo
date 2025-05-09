import React, { useState, useRef, useEffect } from 'react';
import TopBar from './editor/TopBar';
import MediaArea from './editor/MediaArea';
import Controls from './editor/Controls';
import DrawingTools from './editor/DrawingTools';
import ThumbnailStrip from './editor/ThumbnailStrip';
import FontSelector from './editor/FontSelector';
import CaptionArea from './editor/CaptionArea';
import { MessageSquareDashed, WrapText } from 'lucide-react';
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
  const textAreaRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
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
  const [showCaptionBg, setShowCaptionBg] = useState(true);
  const [textContent, setTextContent] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [textAlign, setTextAlign] = useState('center');
  const [savedTexts, setSavedTexts] = useState([]);
  const [editingTextIndex, setEditingTextIndex] = useState(null);
  const [draggingTextIndex, setDraggingTextIndex] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialTextPos, setInitialTextPos] = useState({ x: 0, y: 0 });
  const [caption, setCaption] = useState('');

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

  // Sync textColor with drawingColor when in caption mode
  useEffect(() => {
    if (captionMode) {
      setTextColor(drawingColor);
    }
  }, [drawingColor, captionMode]);

  // Handle canvas click to edit text
  useEffect(() => {
    const canvas = drawingRef.current;
    if (!canvas) return;

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      console.log(`Canvas clicked at x: ${x}, y: ${y}`);

      for (let i = savedTexts.length - 1; i >= 0; i--) {
        const text = savedTexts[i];
        const ctx = canvas.getContext('2d');
        ctx.font = `20px "${text.font}"`;
        ctx.textAlign = text.align;
        ctx.textBaseline = 'middle';
        const lines = text.content.split('\n');
        const lineHeight = 25;
        const xPos = text.x || (canvas.width / 2);
        const yPos = text.y || (canvas.height / 2 - (lines.length * lineHeight) / 2 + (i * lineHeight * 2));
        let textWidth = 0;

        lines.forEach((line, lineIndex) => {
          const width = ctx.measureText(line).width;
          textWidth = Math.max(textWidth, width);
          console.log(`Text ${i}, Line ${lineIndex}: "${line}", Width: ${width}, xPos: ${xPos}, yPos: ${yPos + lineIndex * lineHeight}`);
        });

        const padding = 10;
        const textHeight = lines.length * lineHeight;
        const hitX = text.align === 'center' ? xPos - textWidth / 2 : xPos;
        const hitWidth = text.align === 'end' ? textWidth : textWidth;

        if (x >= hitX - padding && x <= hitX + hitWidth + padding &&
            y >= yPos - textHeight / 2 - padding && y <= yPos + textHeight / 2 + padding) {
          console.log(`Text ${i} clicked: ${text.content}`);
          setCaptionMode(true);
          setTextContent(text.content);
          setTextColor(text.color);
          setSelectedFont(text.font);
          setTextAlign(text.align);
          setEditingTextIndex(i);
          break;
        } else {
          console.log(`Click missed text ${i}: x ${x} not in [${hitX - padding}, ${hitX + hitWidth + padding}], y ${y} not in [${yPos - textHeight / 2 - padding}, ${yPos + textHeight / 2 + padding}]`);
        }
      }
    };

    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [savedTexts]);

  // Handle text dragging
  useEffect(() => {
    const canvas = drawingRef.current;
    if (!canvas) return;

    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      for (let i = savedTexts.length - 1; i >= 0; i--) {
        const text = savedTexts[i];
        const ctx = canvas.getContext('2d');
        ctx.font = `20px "${text.font}"`;
        ctx.textAlign = text.align;
        ctx.textBaseline = 'middle';
        const lines = text.content.split('\n');
        const lineHeight = 25;
        const xPos = text.x || (canvas.width / 2);
        const yPos = text.y || (canvas.height / 2 - (lines.length * lineHeight) / 2 + (i * lineHeight * 2));
        let textWidth = 0;

        lines.forEach((line) => {
          const width = ctx.measureText(line).width;
          textWidth = Math.max(textWidth, width);
        });

        const padding = 10;
        const textHeight = lines.length * lineHeight;
        const hitX = text.align === 'center' ? xPos - textWidth / 2 : xPos;
        const hitWidth = text.align === 'end' ? textWidth : textWidth;

        if (x >= hitX - padding && x <= hitX + hitWidth + padding &&
            y >= yPos - textHeight / 2 - padding && y <= yPos + textHeight / 2 + padding) {
          setDraggingTextIndex(i);
          setDragStart({ x: e.clientX, y: e.clientY });
          setInitialTextPos({ x: xPos, y: yPos });
          break;
        }
      }
    };

    const handleMouseMove = (e) => {
      if (draggingTextIndex === null) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const currentX = e.clientX;
      const currentY = e.clientY;
      const dx = (currentX - dragStart.x) * scaleX;
      const dy = (currentY - dragStart.y) * scaleY;
      setSavedTexts((prev) =>
        prev.map((text, index) =>
          index === draggingTextIndex
            ? { ...text, x: initialTextPos.x + dx, y: initialTextPos.y + dy }
            : text
        )
      );
    };

    const handleMouseUp = () => {
      setDraggingTextIndex(null);
      setInitialTextPos({ x: 0, y: 0 });
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      handleMouseDown(touch);
    }, { passive: true });
    canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      handleMouseMove(touch);
    }, { passive: true });
    canvas.addEventListener('touchend', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleMouseDown);
      canvas.removeEventListener('touchmove', handleMouseMove);
      canvas.removeEventListener('touchend', handleMouseUp);
    };
  }, [savedTexts, draggingTextIndex]);

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

    const svgTexts = savedTexts.map((text, index) => (
      `<text x="${text.x || 50}%" y="${text.y || (50 + index * 5)}%" text-anchor="middle" dominant-baseline="middle" fill="${text.color}" font-family="${text.font}" font-size="20">${text.content}</text>`
    )).join('');

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <image href="${mediaDataUrl}" width="${width}" height="${height}"/>
        ${svgPaths}
        ${svgTexts}
      </svg>
    `;

    return svg;
  };

  const exitDrawingMode = async () => {
    if (paths.length > 0 || savedTexts.length > 0) {
      const svgContent = await generateSVG();
      console.log('Generated SVG:', svgContent);
    }
    setDrawingMode(false);
    setDrawingColor(COLORS[0]);
    setDrawingThickness(THICKNESS[1]);
    setCurrentPath([]);
  };

  const exitCaptionMode = async () => {
    if (textContent) {
      const newText = { content: textContent, color: textColor, font: selectedFont, align: textAlign, x: savedTexts[editingTextIndex]?.x || null, y: savedTexts[editingTextIndex]?.y || null };
      if (editingTextIndex !== null) {
        setSavedTexts((prev) =>
          prev.map((text, index) => (index === editingTextIndex ? newText : text))
        );
      } else {
        setSavedTexts((prev) => [...prev, newText]);
      }
    }
    setCaptionMode(false);
    setShowCaptionBg(true);
    setTextContent('');
    setEditingTextIndex(null);
  };

  const toggleCaptionMode = () => {
    setCaptionMode((prev) => {
      console.log('Toggling captionMode to:', !prev);
      if (!prev) {
        setDrawingMode(false);
        setShowCaptionBg(true);
        setTextColor(drawingColor);
        setSelectedFont('Arial');
        setTextAlign('center');
        setEditingTextIndex(null);
      }
      return !prev;
    });
  };

  const toggleCaptionColorMode = () => {
    setShowCaptionBg(!showCaptionBg);
  };

  const cycleTextAlign = () => {
    setTextAlign((prev) => {
      if (prev === 'center') return 'end';
      if (prev === 'end') return 'start';
      return 'center';
    });
  };

  const closeEditor = () => {
    setDrawingMode(false);
    setCaptionMode(false);
    setShowCaptionBg(true);
    setDrawingColor(COLORS[0]);
    setDrawingThickness(THICKNESS[1]);
    setPaths([]);
    setCurrentPath([]);
    setTextContent('');
    setSavedTexts([]);
    setEditingTextIndex(null);
    setDraggingTextIndex(null);
    setInitialTextPos({ x: 0, y: 0 });
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

    console.log('Rendering savedTexts:', savedTexts);
    savedTexts.forEach((text, index) => {
      if (captionMode && editingTextIndex === index) return;

      ctx.fillStyle = text.color;
      ctx.font = `20px "${text.font}"`;
      ctx.textAlign = text.align;
      ctx.textBaseline = 'middle';
      const lines = text.content.split('\n');
      const lineHeight = 25;
      const xPos = text.x || (canvasWidth / 2);
      const yPos = text.y || (canvasHeight / 2 - (lines.length * lineHeight) / 2 + (index * lineHeight * 2));
      lines.forEach((line, lineIndex) => {
        const x = text.align === 'center' ? xPos :
                  text.align === 'end' ? xPos - ctx.measureText(line).width : xPos;
        ctx.fillText(line, x, yPos + lineIndex * lineHeight);
        console.log(`Drawing text ${index}: "${line}" at x: ${x}, y: ${yPos + lineIndex * lineHeight}`);
      });
    });
  }, [paths, currentPath, isVideo, drawingColor, drawingThickness, savedTexts, captionMode, editingTextIndex]);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (textarea && captionMode) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, drawingRef.current.height * 0.4)}px`;
    }
  }, [textContent, captionMode]);

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
        exitCaptionMode={exitCaptionMode}
        toggleCaptionColorMode={toggleCaptionColorMode}
        cycleTextAlign={cycleTextAlign}
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
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          <div
            onClick={() => setDrawingColor(drawingColor)}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: drawingColor,
              border: '2px solid #fff',
              cursor: 'pointer',
            }}
          />
          {COLORS.filter((c) => c !== drawingColor).map((c) => (
            <div
              key={c}
              onClick={() => setDrawingColor(c)}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: c,
                border: '2px solid transparent',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}
      {captionMode && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            height: '20%',
            minHeight: '40px',
            backgroundColor: showCaptionBg ? 'rgba(70, 70, 70, 0.8)' : 'transparent',
            border: '1px solid #fff',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            boxSizing: 'border-box',
            zIndex: '10',
          }}
        >
          <textarea
            ref={textAreaRef}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Add subtitle..."
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              color: textColor,
              fontFamily: selectedFont,
              fontSize: '20px',
              textAlign: textAlign,
              resize: 'none',
              outline: 'none',
            }}
          />
        </div>
      )}
      {isVideo && !drawingMode && !captionMode && (
        <Controls isPlaying={isPlaying} togglePlay={togglePlay} />
      )}
      {drawingMode && (
        <DrawingTools
          drawingThickness={drawingThickness}
          setDrawingThickness={setDrawingThickness}
          THICKNESS={THICKNESS}
        />
      )}
      {captionMode && <FontSelector onFontSelect={setSelectedFont} />}
      {!drawingMode && !captionMode && (
        <CaptionArea
          caption={caption}
          setCaption={setCaption}
          closeEditor={closeEditor}
        />
      )}
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