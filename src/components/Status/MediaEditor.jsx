import React, { useState, useRef, useEffect, useCallback } from 'react';
import { throttle } from 'lodash';
import TopBar from './editor/TopBar';
import MediaArea from './editor/MediaArea';
import Controls from './editor/Controls';
import DrawingTools from './editor/DrawingTools';
import ThumbnailStrip from './editor/ThumbnailStrip';
import FontSelector from './editor/FontSelector';
import CaptionArea from './editor/CaptionArea';
import TextManager from './editor/TextManager';
import VideoManager from './editor/VideoManager';
import styles from './editor/styles';
import { Storage } from 'megajs';

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
  const [caption, setCaption] = useState('');

  const mediaStyle = {
    ...styles.video,
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
    position: 'absolute',
    top: 0,
    left: 0,
  };

  const { isPlaying, togglePlay, startScrub, scrub } = VideoManager({
    isVideo,
    videoRef,
    setDuration,
    setCurrentTime,
    scrubbing,
    setScrubbing,
    stripRef,
    scrubberRef,
    topRef,
    canvasRef,
    duration,
    currentTime,
    setThumbnails,
    setThumbWidth,
  });

  const currentDrawingPoints = useRef([]);

  const getSvgCoordinates = useCallback((e, svg) => {
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return { x, y };
  }, []);

  const handleStart = useCallback((e) => {
    if (!drawingMode) return;
    try {
      e.preventDefault();
      const svg = drawingRef.current;
      if (!svg) return;
      const { x, y } = getSvgCoordinates(e, svg);
      currentDrawingPoints.current = [{ x, y }];
      setCurrentPath([...currentDrawingPoints.current]);
    } catch (error) {
      console.error('handleStart error:', error);
    }
  }, [drawingMode, getSvgCoordinates]);

  const handleEnd = useCallback((e) => {
    if (!drawingMode || currentDrawingPoints.current.length === 0) return;
    try {
      e.preventDefault();
      const newPath = { 
        points: [...currentDrawingPoints.current], 
        color: drawingColor, 
        thickness: drawingThickness 
      };
      setPaths((prev) => [...prev, newPath]);
      currentDrawingPoints.current = [];
      setCurrentPath([]);
    } catch (error) {
      console.error('handleEnd error:', error);
    }
  }, [drawingMode, drawingColor, drawingThickness]);

  const handleMove = useCallback((e) => {
    if (!drawingMode || currentDrawingPoints.current.length === 0) return;
    try {
      e.preventDefault();
      const svg = drawingRef.current;
      if (!svg) return;
      const { x, y } = getSvgCoordinates(e, svg);
      currentDrawingPoints.current.push({ x, y });
      setCurrentPath([...currentDrawingPoints.current]);
    } catch (error) {
      console.error('handleMove error:', error);
    }
  }, [drawingMode, getSvgCoordinates]);

  const throttledHandleMove = useCallback(throttle(handleMove, 16), [handleMove]);

  const undo = useCallback(() => {
    setPaths((prev) => prev.slice(0, -1));
  }, []);

  const saveImage = useCallback(async () => {
    const svg = drawingRef.current;
    if (!svg) return;

    const canvas = document.createElement('canvas');
    let naturalWidth, naturalHeight;

    if (isVideo && videoRef.current && videoRef.current.videoWidth) {
      naturalWidth = videoRef.current.videoWidth;
      naturalHeight = videoRef.current.videoHeight;
    } else {
      const img = new Image();
      img.src = fileUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
      naturalWidth = img.naturalWidth || window.innerWidth;
      naturalHeight = img.naturalHeight || window.innerHeight;
    }

    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isVideo && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, naturalWidth, naturalHeight);
    } else {
      const img = new Image();
      img.src = fileUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
      if (img.complete) {
        ctx.drawImage(img, 0, 0, naturalWidth, naturalHeight);
      }
    }

    const svgRect = svg.getBoundingClientRect();
    const scaleX = naturalWidth / svgRect.width;
    const scaleY = naturalHeight / svgRect.height;

    const drawLine = (points, color, thickness) => {
      if (points.length === 0) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness * Math.min(scaleX, scaleY);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      points.forEach((pt, i) => {
        const x = pt.x * scaleX;
        const y = pt.y * scaleY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    paths.forEach((p) => {
      drawLine(p.points, p.color, p.thickness);
    });
    if (currentPath.length > 0) {
      drawLine(currentPath, drawingColor, drawingThickness);
    }

    savedTexts.forEach((text) => {
      if (!text.content) return;
      ctx.fillStyle = text.color || '#ffffff';
      const fontSize = (text.fontSize || 20) * Math.min(scaleX, scaleY);
      ctx.font = `${fontSize}px "${text.font || 'Arial'}"`;
      ctx.textAlign = text.align || 'center';
      ctx.textBaseline = 'middle';
      const lines = text.content.split('\n');
      const lineHeight = fontSize * 1.2;
      const xPos = (text.x || svgRect.width / 2) * scaleX;
      const yPos = (text.y || svgRect.height / 2) * scaleY;
      lines.forEach((line, lineIndex) => {
        const x = text.align === 'center' ? xPos : text.align === 'end' ? xPos - ctx.measureText(line).width : xPos;
        const y = yPos + lineIndex * lineHeight;
        ctx.fillText(line, x, y);
      });
    });

    if (caption) {
      ctx.fillStyle = '#ffffff';
      const fontSize = 16 * Math.min(scaleX, scaleY);
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = 'start';
      ctx.textBaseline = 'bottom';
      const padding = 10 * Math.min(scaleX, scaleY);
      ctx.fillText(caption, padding, naturalHeight - padding);
    }

    return canvas.toDataURL('image/png');
  }, [
    isVideo,
    videoRef,
    fileUrl,
    paths,
    currentPath,
    drawingColor,
    drawingThickness,
    savedTexts,
    caption,
  ]);

const handleSend = useCallback(async (caption) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.user_id;
    if (!userId) throw new Error("User not found");

    const mediaFile = await saveImage();
    if (!mediaFile) throw new Error("No media file to upload");

    // Extract base64 content from data URL
    const base64 = mediaFile.split(',')[1];
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const file = new File([bytes], `media_${Date.now()}.png`, { type: 'image/png' });

    // Log file size for debugging
    console.log('File size:', file.size);
    if (file.size === 0) throw new Error('File is empty');

    const storage = new Storage({
      email: process.env.MEGA_EMAIL || 'huzaimbinasad@gmail.com',
      password: process.env.MEGA_PASSWORD || 'Aenduanaael@35793579'
    });

    await storage.ready; // Wait for storage to be ready

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer); // Convert to Buffer-like array

    // Create a new upload instance
    const upload = storage.upload({
      name: file.name,
      size: file.size
    });

    // Write the file buffer to the upload stream
    upload.write(buffer);
    upload.end();

    // Wait for the upload to complete
    const uploadedFile = await upload.complete;
    if (!uploadedFile || !uploadedFile.link()) throw new Error('Failed to upload file to Mega');

    const mediaUrl = uploadedFile.link();
    console.log('Media URL:', mediaUrl); // Log the media URL for debugging

    // Send the status to the server
    const response = await fetch('http://localhost:5000/api/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        mediaUrl,
        caption,
        notAllowId: [],
        readId: [],
        timestamp: Date.now(),
      }),
    });

    if (!response.ok) throw new Error('Failed to save status');
    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Upload failed:', error);
    alert('An error occurred while uploading the file. Please try again.'); // Show alert to user
    throw error; // Re-throw error to propagate it if needed
  }
}, [saveImage]);

  const exitDrawingMode = useCallback(() => {
    setDrawingMode(false);
    setDrawingColor(COLORS[0]);
    setDrawingThickness(THICKNESS[1]);
    setCurrentPath([]);
    currentDrawingPoints.current = [];
  }, []);

  const exitCaptionMode = useCallback(() => {
    if (textContent.trim()) {
      const svg = drawingRef.current;
      const svgRect = svg ? svg.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      const newText = {
        content: textContent.trim(),
        color: textColor,
        font: selectedFont,
        align: textAlign,
        x: savedTexts[editingTextIndex]?.x || svgRect.width / 2,
        y: savedTexts[editingTextIndex]?.y || svgRect.height / 2,
        fontSize: savedTexts[editingTextIndex]?.fontSize || 20,
      };
      if (editingTextIndex !== null) {
        setSavedTexts((prev) => {
          const updated = prev.map((text, index) => (index === editingTextIndex ? newText : text));
          console.log(`exitCaptionMode: Updated text at index ${editingTextIndex}, savedTexts.length=${updated.length}, content="${newText.content}", x=${newText.x.toFixed(2)}, y=${newText.y.toFixed(2)}, savedTexts=${JSON.stringify(updated)}`);
          return updated;
        });
      } else {
        setSavedTexts((prev) => {
          const updated = [...prev, newText];
          console.log(`exitCaptionMode: Added new text, savedTexts.length=${updated.length}, content="${newText.content}", x=${newText.x.toFixed(2)}, y=${newText.y.toFixed(2)}, savedTexts=${JSON.stringify(updated)}`);
          return updated;
        });
      }
    } else {
      console.log('exitCaptionMode: No textContent to save');
    }
    setCaptionMode(false);
    setShowCaptionBg(true);
    setTextContent('');
    setEditingTextIndex(null);
    console.log('exitCaptionMode: Exited caption mode');
  }, [textContent, textColor, selectedFont, textAlign, savedTexts, editingTextIndex]);

  const toggleCaptionMode = useCallback(() => {
    setCaptionMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        setDrawingMode(false);
        setShowCaptionBg(true);
        setTextColor(drawingColor);
        setSelectedFont('Arial');
        setTextAlign('center');
        setEditingTextIndex(null);
        setTextContent('');
      }
      return newMode;
    });
  }, [drawingColor]);

  const toggleCaptionColorMode = useCallback(() => {
    setShowCaptionBg((prev) => !prev);
  }, []);

  const cycleTextAlign = useCallback(() => {
    setTextAlign((prev) => prev === 'center' ? 'end' : prev === 'end' ? 'start' : 'center');
  }, []);

  const closeEditor = useCallback(() => {
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
    setCaption('');
    if (isVideo) {
      setCurrentTime(0);
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
    onClose();
  }, [isVideo, onClose]);

  useEffect(() => {
    const svg = drawingRef.current;
    if (!svg) return;

    const onMouseDown = handleStart;
    const onMouseMove = throttledHandleMove;
    const onMouseUp = handleEnd;
    const onTouchStart = (e) => {
      if (drawingMode) handleStart(e);
    };
    const onTouchMove = (e) => {
      if (drawingMode) throttledHandleMove(e);
    };
    const onTouchEnd = (e) => {
      if (drawingMode) handleEnd(e);
    };

    svg.addEventListener('mousedown', onMouseDown);
    svg.addEventListener('mousemove', onMouseMove);
    svg.addEventListener('mouseup', onMouseUp);
    svg.addEventListener('touchstart', onTouchStart, { passive: false });
    svg.addEventListener('touchmove', onTouchMove, { passive: false });
    svg.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      svg.removeEventListener('mousedown', onMouseDown);
      svg.removeEventListener('mousemove', onMouseMove);
      svg.removeEventListener('mouseup', onMouseUp);
      svg.removeEventListener('touchstart', onTouchStart);
      svg.removeEventListener('touchmove', onTouchMove);
      svg.removeEventListener('touchend', onTouchEnd);
    };
  }, [drawingMode, handleStart, throttledHandleMove, handleEnd]);

  useEffect(() => {
    if (caption || savedTexts.length > 0) {
      const timeout = setTimeout(() => {
        saveImage().catch((error) => console.error('Auto-save failed:', error));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [caption, savedTexts, saveImage]);

  useEffect(() => {
    if (captionMode && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [captionMode]);

  useEffect(() => {
    console.log(`useEffect: paths updated, paths.length=${paths.length}`);
  }, [paths]);

  useEffect(() => {
    console.log(`useEffect: savedTexts updated, savedTexts.length=${savedTexts.length}, savedTexts=${JSON.stringify(savedTexts)}`);
  }, [savedTexts]);

  return (
    <div style={styles.wrapper}>
      <TopBar
        drawingMode={drawingMode}
        exitDrawingMode={exitDrawingMode}
        closeEditor={closeEditor}
        setDrawingMode={(value) => {
          setDrawingMode(value);
          if (value) setCaptionMode(false);
        }}
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
      <MediaArea
        isVideo={isVideo}
        fileUrl={fileUrl}
        videoRef={videoRef}
        drawingRef={drawingRef}
        mediaStyle={mediaStyle}
        paths={paths}
        currentPath={currentPath}
        drawingColor={drawingColor}
        drawingThickness={drawingThickness}
      />
      <TextManager
        drawingRef={drawingRef}
        savedTexts={savedTexts}
        setSavedTexts={setSavedTexts}
        captionMode={captionMode}
        setCaptionMode={setCaptionMode}
        textContent={textContent}
        setTextContent={setTextContent}
        textColor={textColor}
        setTextColor={setTextColor}
        selectedFont={selectedFont}
        setSelectedFont={setSelectedFont}
        textAlign={textAlign}
        setTextAlign={setTextAlign}
        editingTextIndex={editingTextIndex}
        setEditingTextIndex={setEditingTextIndex}
        drawingColor={drawingColor}
        draggingTextIndex={draggingTextIndex}
        setDraggingTextIndex={setDraggingTextIndex}
        textAreaRef={textAreaRef}
      />
      {savedTexts.map((text, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${text.x}px`,
            top: `${text.y}px`,
            color: text.color || '#ffffff',
            fontFamily: text.font || 'Arial',
            fontSize: `${text.fontSize || 20}px`,
            textAlign: text.align || 'center',
            transform: text.align === 'center' ? 'translateX(-50%)' : text.align === 'end' ? 'translateX(-100%)' : 'none',
            zIndex: 10,
            pointerEvents: 'none',
            whiteSpace: 'pre-wrap',
          }}
        >
          {text.content}
        </div>
      ))}
      {caption && !captionMode && !drawingMode && (
        <div
          style={{
            position: 'absolute',
            left: '10px',
            bottom: '10px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontSize: '16px',
            textAlign: 'start',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          {caption}
        </div>
      )}
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
      {(drawingMode || captionMode) && (
        <div
          style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
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
      {captionMode && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            height: '10%',
            minHeight: '40px',
            backgroundColor: showCaptionBg ? 'rgba(70, 70, 70, 0.8)' : 'transparent',
            border: '1px solid #fff',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            boxSizing: 'border-box',
            zIndex: 10,
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
      {captionMode && (
        <FontSelector
          onFontSelect={setSelectedFont}
        />
      )}
      {!drawingMode && !captionMode && (
        <CaptionArea
          caption={caption}
          setCaption={setCaption}
          closeEditor={closeEditor}
          onSend={handleSend}
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