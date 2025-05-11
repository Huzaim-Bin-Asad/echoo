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
    height: '100vh',
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
    console.log(`SVG coordinates: x=${x.toFixed(2)}, y=${y.toFixed(2)}, rect.width=${rect.width}, rect.height=${rect.height}`);
    return { x, y };
  }, []);

  const handleStart = useCallback((e) => {
    console.log(`handleStart: drawingMode=${drawingMode}, eventType=${e.type}, touches=${e.touches?.length || 0}`);
    if (!drawingMode) {
      console.log('handleStart: Exiting because not in drawing mode');
      return;
    }
    try {
      e.preventDefault();
      const svg = drawingRef.current;
      if (!svg) {
        console.error('handleStart: SVG not found');
        return;
      }
      const { x, y } = getSvgCoordinates(e, svg);
      currentDrawingPoints.current = [{ x, y }];
      setCurrentPath([...currentDrawingPoints.current]);
      console.log(`handleStart: Started drawing at (${x.toFixed(2)}, ${y.toFixed(2)})`);
    } catch (error) {
      console.error('handleStart error:', error.message, error.stack);
    }
  }, [drawingMode, getSvgCoordinates]);

  const handleMove = useCallback(
    throttle((e) => {
      console.log(`handleMove: drawingMode=${drawingMode}, eventType=${e.type}, touches=${e.touches?.length || 0}`);
      if (!drawingMode || currentDrawingPoints.current.length === 0) {
        console.log('handleMove: Exiting because not in drawing mode or no points');
        return;
      }
      try {
        e.preventDefault();
        const svg = drawingRef.current;
        if (!svg) {
          console.error('handleMove: SVG not found');
          return;
        }
        const { x, y } = getSvgCoordinates(e, svg);
        currentDrawingPoints.current.push({ x, y });
        setCurrentPath([...currentDrawingPoints.current]);
        console.log(`handleMove: Added point at (${x.toFixed(2)}, ${y.toFixed(2)})`);
      } catch (error) {
        console.error('handleMove error:', error.message, error.stack);
      }
    }, 16),
    [drawingMode, getSvgCoordinates]
  );

  const handleEnd = useCallback((e) => {
    console.log(`handleEnd: drawingMode=${drawingMode}, eventType=${e.type}, touches=${e.changedTouches?.length || 0}`);
    if (!drawingMode || currentDrawingPoints.current.length === 0) {
      console.log('handleEnd: Exiting because not in drawing mode or no points');
      return;
    }
    try {
      e.preventDefault();
      const newPath = { points: [...currentDrawingPoints.current], color: drawingColor, thickness: drawingThickness };
      setPaths((prev) => {
        const newPaths = [...prev, newPath];
        console.log(`handleEnd: Saved path to paths, paths.length=${newPaths.length}, points=${newPath.points.length}, firstPoint=(${newPath.points[0]?.x.toFixed(2)}, ${newPath.points[0]?.y.toFixed(2)})`);
        return newPaths;
      });
      currentDrawingPoints.current = [];
      setCurrentPath([]);
      console.log('handleEnd: Cleared currentPath');
    } catch (error) {
      console.error('handleEnd error:', error.message, error.stack);
    }
  }, [drawingMode, drawingColor, drawingThickness]);

  const undo = useCallback(() => {
    setPaths((prev) => {
      const newPaths = prev.slice(0, -1);
      console.log(`undo: Removed last path, paths.length=${newPaths.length}`);
      return newPaths;
    });
  }, []);

  const saveImage = useCallback(async () => {
    console.log('saveImage: Starting image save');
    const svg = drawingRef.current;
    if (!svg) {
      console.error('saveImage: SVG not found');
      return;
    }

    // Create a temporary canvas
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
      naturalHeight = img.naturalHeight || (window.innerHeight - 100);
    }

    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('saveImage: Canvas context not found');
      return;
    }

    // Draw media
    console.log('saveImage: Drawing media to canvas');
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

    // Calculate scaling from SVG to media dimensions
    const svgRect = svg.getBoundingClientRect();
    const scaleX = naturalWidth / svgRect.width;
    const scaleY = naturalHeight / svgRect.height;
    console.log(`saveImage: Scaling - scaleX=${scaleX.toFixed(2)}, scaleY=${scaleY.toFixed(2)}, svgRect.width=${svgRect.width}, svgRect.height=${svgRect.height}`);

    // Draw paths
    const drawLine = (points, color, thickness) => {
      if (points.length === 0) {
        console.log('saveImage: Skipping empty points array');
        return;
      }
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
        console.log(`saveImage: Point ${i} at x=${x.toFixed(2)}, y=${y.toFixed(2)}`);
      });
      ctx.stroke();
      console.log(`saveImage: Drew line with color=${color}, thickness=${thickness}, points=${points.length}`);
    };

    console.log(`saveImage: Rendering paths.length=${paths.length}, currentPath.length=${currentPath.length}`);
    paths.forEach((p, index) => {
      console.log(`saveImage: Drawing path ${index} with ${p.points.length} points`);
      drawLine(p.points, p.color, p.thickness);
    });
    if (currentPath.length > 0) {
      console.log(`saveImage: Drawing currentPath with ${currentPath.length} points`);
      drawLine(currentPath, drawingColor, drawingThickness);
    }

    // Draw saved texts
    console.log(`saveImage: Processing savedTexts.length=${savedTexts.length}`);
    savedTexts.forEach((text, index) => {
      if (!text.content) {
        console.log(`saveImage: Skipping empty text at index ${index}`);
        return;
      }
      ctx.fillStyle = text.color || '#ffffff';
      const fontSize = (text.fontSize || 20) * Math.min(scaleX, scaleY);
      ctx.font = `${fontSize}px "${text.font || 'Arial'}"`;
      ctx.textAlign = text.align || 'center';
      ctx.textBaseline = 'middle';
      const lines = text.content.split('\n');
      const lineHeight = fontSize * 1.2;
      const xPos = (text.x || svgRect.width / 2) * scaleX;
      const yPos = (text.y || svgRect.height / 2) * scaleY;
      console.log(`saveImage: Text ${index} - content="${text.content}", xPos=${xPos.toFixed(2)}, yPos=${yPos.toFixed(2)}, fontSize=${fontSize.toFixed(2)}, align=${text.align}, color=${text.color}`);
      lines.forEach((line, lineIndex) => {
        const x = text.align === 'center' ? xPos : text.align === 'end' ? xPos - ctx.measureText(line).width : xPos;
        const y = yPos + lineIndex * lineHeight;
        ctx.fillText(line, x, y);
        console.log(`saveImage: Drew text: "${line}" at x=${x.toFixed(2)}, y=${y.toFixed(2)}`);
      });
    });

    // Draw caption
    if (caption) {
      ctx.fillStyle = '#ffffff';
      const fontSize = 16 * Math.min(scaleX, scaleY);
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = 'start';
      ctx.textBaseline = 'bottom';
      const padding = 10 * Math.min(scaleX, scaleY);
      ctx.fillText(caption, padding, naturalHeight - padding);
      console.log(`saveImage: Drew caption: "${caption}" at x=${padding.toFixed(2)}, y=${(naturalHeight - padding).toFixed(2)}, fontSize=${fontSize.toFixed(2)}`);
    } else {
      console.log('saveImage: No caption to draw');
    }

    // Debug: Draw a test text to confirm text rendering
    ctx.fillStyle = 'red';
    ctx.font = `${20 * Math.min(scaleX, scaleY)}px Arial`;
    ctx.textAlign = 'start';
    ctx.textBaseline = 'top';
    ctx.fillText('DEBUG TEXT', 10, 10);
    console.log('saveImage: Drew debug text "DEBUG TEXT" at x=10, y=10');

    // Export image
    const dataUrl = canvas.toDataURL('image/png');
    const blob = await (await fetch(dataUrl)).blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edited_image_${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('saveImage: Image saved successfully');
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

  const exitDrawingMode = useCallback(() => {
    setDrawingMode(false);
    setDrawingColor(COLORS[0]);
    setDrawingThickness(THICKNESS[1]);
    setCurrentPath([]);
    currentDrawingPoints.current = [];
    console.log('exitDrawingMode: Exited drawing mode');
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
        console.log('toggleCaptionMode: Entered caption mode, initialized textarea');
      } else {
        console.log('toggleCaptionMode: Exited caption mode');
      }
      return newMode;
    });
  }, [drawingColor]);

  const toggleCaptionColorMode = useCallback(() => {
    setShowCaptionBg((prev) => {
      console.log(`toggleCaptionColorMode: showCaptionBg=${!prev}`);
      return !prev;
    });
  }, []);

  const cycleTextAlign = useCallback(() => {
    setTextAlign((prev) => {
      const next = prev === 'center' ? 'end' : prev === 'end' ? 'start' : 'center';
      console.log(`cycleTextAlign: New alignment=${next}`);
      return next;
    });
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
    console.log('closeEditor: Closed editor and reset state');
    onClose();
  }, [isVideo, onClose]);

  useEffect(() => {
    const svg = drawingRef.current;
    if (!svg) {
      console.error('useEffect: SVG not found');
      return;
    }

    console.log(`useEffect: Adding event listeners, drawingMode=${drawingMode}, captionMode=${captionMode}`);

    const onMouseDown = handleStart;
    const onMouseMove = handleMove;
    const onMouseUp = handleEnd;
    const onTouchStart = (e) => {
      console.log(`onTouchStart: touches=${e.touches.length}, drawingMode=${drawingMode}, captionMode=${captionMode}`);
      if (drawingMode) {
        handleStart(e);
      }
    };
    const onTouchMove = (e) => {
      console.log(`onTouchMove: touches=${e.touches.length}, drawingMode=${drawingMode}, captionMode=${captionMode}`);
      if (drawingMode) {
        handleMove(e);
      }
    };
    const onTouchEnd = (e) => {
      console.log(`onTouchEnd: changedTouches=${e.changedTouches.length}, drawingMode=${drawingMode}, captionMode=${captionMode}`);
      if (drawingMode) {
        handleEnd(e);
      }
    };

    svg.addEventListener('mousedown', onMouseDown);
    svg.addEventListener('mousemove', onMouseMove);
    svg.addEventListener('mouseup', onMouseUp);
    svg.addEventListener('touchstart', onTouchStart, { passive: false });
    svg.addEventListener('touchmove', onTouchMove, { passive: false });
    svg.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      console.log('useEffect: Removing event listeners');
      svg.removeEventListener('mousedown', onMouseDown);
      svg.removeEventListener('mousemove', onMouseMove);
      svg.removeEventListener('mouseup', onMouseUp);
      svg.removeEventListener('touchstart', onTouchStart);
      svg.removeEventListener('touchmove', onTouchMove);
      svg.removeEventListener('touchend', onTouchEnd);
    };
  }, [drawingMode, captionMode, handleStart, handleMove, handleEnd]);

  useEffect(() => {
    if (caption || savedTexts.length > 0) {
      console.log(`useEffect: Scheduling auto-save, caption="${caption}", savedTexts.length=${savedTexts.length}, savedTexts=${JSON.stringify(savedTexts)}`);
      const timeout = setTimeout(() => {
        saveImage().catch((error) => console.error('Auto-save failed:', error));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [caption, savedTexts, saveImage]);

  useEffect(() => {
    if (captionMode && textAreaRef.current) {
      textAreaRef.current.focus();
      console.log('useEffect: Focused textarea for caption mode');
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
          if (value) {
            setCaptionMode(false);
            console.log('setDrawingMode: Enabled drawing mode, disabled caption mode');
          } else {
            console.log('setDrawingMode: Disabled drawing mode');
          }
        }}
        drawingColor={drawingColor}
        setDrawingColor={(color) => {
          setDrawingColor(color);
          console.log(`setDrawingColor: Changed to ${color}`);
        }}
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
      {/* Render savedTexts on-screen */}
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
            pointerEvents: 'none', // Prevent interference with drawing
            whiteSpace: 'pre-wrap', // Support newlines
          }}
        >
          {text.content}
        </div>
      ))}
      {/* Render caption on-screen (optional) */}
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
            onChange={(e) => {
              setTextContent(e.target.value);
              console.log(`textarea: Updated textContent to "${e.target.value}"`);
            }}
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
          setDrawingThickness={(thickness) => {
            setDrawingThickness(thickness);
            console.log(`setDrawingThickness: Changed to ${thickness}`);
          }}
          THICKNESS={THICKNESS}
        />
      )}
      {captionMode && (
        <FontSelector
          onFontSelect={(font) => {
            setSelectedFont(font);
            console.log(`FontSelector: Selected font ${font}`);
          }}
        />
      )}
      {!drawingMode && !captionMode && (
        <CaptionArea
          caption={caption}
          setCaption={(value) => {
            setCaption(value);
            console.log(`CaptionArea: Updated caption to "${value}"`);
          }}
          closeEditor={closeEditor}
          onSave={saveImage}
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