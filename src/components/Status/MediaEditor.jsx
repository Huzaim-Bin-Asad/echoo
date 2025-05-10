import React, { useState, useRef, useEffect } from 'react';
import TopBar from './editor/TopBar';
import MediaArea from './editor/MediaArea';
import Controls from './editor/Controls';
import DrawingTools from './editor/DrawingTools';
import ThumbnailStrip from './editor/ThumbnailStrip';
import FontSelector from './editor/FontSelector';
import CaptionArea from './editor/CaptionArea';
import CanvasManager from './editor/CanvasManager';
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
  const [saveImage, setSaveImage] = useState(() => async () => {});

  const mediaStyle = {
    ...styles.video,
    width: '100%',
    height: '85.5vh',
    maxWidth: '100%',
    objectFit: 'contain',
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

  const handleStart = (e) => {
    if (!drawingMode) return;
    const canvas = drawingRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;
    const x = (clientX - rect.left + scrollX) * (canvas.width / rect.width);
    const y = (clientY - rect.top + scrollY) * (canvas.height / rect.height);
    currentDrawingPoints.current = [{ x, y }];
    setCurrentPath([...currentDrawingPoints.current]);
  };

  const handleMove = (e) => {
    if (!drawingMode || currentDrawingPoints.current.length === 0) return;
    const canvas = drawingRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;
    const x = (clientX - rect.left + scrollX) * (canvas.width / rect.width);
    const y = (clientY - rect.top + scrollY) * (canvas.height / rect.height);
    currentDrawingPoints.current = [...currentDrawingPoints.current, { x, y }];
    setCurrentPath([...currentDrawingPoints.current]);
  };

  const handleEnd = () => {
    if (!drawingMode || currentDrawingPoints.current.length === 0) return;
    setPaths((prev) => [...prev, { points: currentDrawingPoints.current, color: drawingColor, thickness: drawingThickness }]);
    currentDrawingPoints.current = [];
    setCurrentPath([]);
  };

  const undo = () => setPaths((prev) => prev.slice(0, -1));

  const exitDrawingMode = async () => {
    setDrawingMode(false);
    setDrawingColor(COLORS[0]);
    setDrawingThickness(THICKNESS[1]);
    setCurrentPath([]);
    currentDrawingPoints.current = [];
  };

  const exitCaptionMode = async () => {
    if (textContent) {
      const newText = { 
        content: textContent, 
        color: textColor, 
        font: selectedFont, 
        align: textAlign, 
        x: savedTexts[editingTextIndex]?.x || null, 
        y: savedTexts[editingTextIndex]?.y || null,
        fontSize: savedTexts[editingTextIndex]?.fontSize || 20
      };
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
    setCaption('');
    if (isVideo) {
      setCurrentTime(0);
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
    onClose();
  };

  useEffect(() => {
    if (caption && saveImage) {
      console.log('Auto-saving with caption:', caption);
      saveImage().catch((error) => console.error('Auto-save failed:', error));
    }
  }, [caption, saveImage]);

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
      <CanvasManager
        drawingRef={drawingRef}
        isVideo={isVideo}
        videoRef={videoRef}
        fileUrl={fileUrl}
        paths={paths}
        currentPath={currentPath}
        drawingColor={drawingColor}
        drawingThickness={drawingThickness}
        savedTexts={savedTexts}
        captionMode={captionMode}
        editingTextIndex={editingTextIndex}
        caption={caption}
        saveImageCallback={setSaveImage}
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
            transform: 'translateY(-68%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            zIndex: 10,
          }}
        >
          <div
            onClick={() => setDrawingColor(drawingColor)}
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
      {captionMode && <FontSelector onFontSelect={setSelectedFont} />}
      {!drawingMode && !captionMode && (
        <CaptionArea
          caption={caption}
          setCaption={setCaption}
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