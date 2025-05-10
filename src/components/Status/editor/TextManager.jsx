import { useEffect, useRef, useState, useCallback } from 'react';

const TextManager = ({
  drawingRef,
  savedTexts,
  setSavedTexts,
  captionMode,
  setCaptionMode,
  textContent,
  setTextContent,
  textColor,
  setTextColor,
  selectedFont,
  setSelectedFont,
  textAlign,
  setTextAlign,
  editingTextIndex,
  setEditingTextIndex,
  drawingColor,
  draggingTextIndex,
  setDraggingTextIndex,
  textAreaRef,
}) => {
  const offsetRef = useRef({ x: 0, y: 0 });
  const touchDistanceRef = useRef(null);
  const initialFontSizeRef = useRef(null);
  const [scaleControlsVisible, setScaleControlsVisible] = useState(false);

  const getTextBounds = useCallback((text, ctx, canvasWidth, canvasHeight, scaleX, scaleY) => {
    ctx.font = `${(text.fontSize || 20) * Math.min(scaleX, scaleY)}px "${text.font}"`;
    ctx.textAlign = text.align;
    const lines = text.content.split('\n');
    const lineHeight = (text.fontSize || 20) * 1.2 * Math.min(scaleX, scaleY);
    const xPos = (text.x || (canvasWidth / 2)) * scaleX;
    const yPos = (text.y || (canvasHeight / 2 - (lines.length * lineHeight) / 2)) * scaleY;

    let width = 0;
    lines.forEach((line) => {
      const metrics = ctx.measureText(line);
      width = Math.max(width, metrics.width);
    });
    const height = lines.length * lineHeight;

    return { x: xPos, y: yPos, width, height, lineHeight };
  }, []);

  const handleTextClick = useCallback(
    (e, index) => {
      if (!captionMode) return;

      const canvas = drawingRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches?.[0]?.clientX ?? e.clientX;
      const clientY = e.touches?.[0]?.clientY ?? e.clientY;
      const x = ((clientX - rect.left) / rect.width) * canvas.width;
      const y = ((clientY - rect.top) / rect.height) * canvas.height;

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const text = savedTexts[index];
      const { x: xPos, y: yPos, width, height } = getTextBounds(text, ctx, rect.width, rect.height, scaleX, scaleY);

      const adjustedXPos = text.align === 'center' ? xPos - width / 2 : text.align === 'end' ? xPos - width : xPos;

      if (
        x >= adjustedXPos &&
        x <= adjustedXPos + width &&
        y >= yPos - height / 2 &&
        y <= yPos + height / 2
      ) {
        if (e.detail === 2) {
          setEditingTextIndex(index);
          setTextContent(text.content);
          setTextColor(text.color);
          setSelectedFont(text.font);
          setTextAlign(text.align);
          if (textAreaRef.current) {
            textAreaRef.current.focus();
          }
        } else if (draggingTextIndex === null) {
          setDraggingTextIndex(index);
          offsetRef.current = { x: x - xPos, y: y - yPos };
          setScaleControlsVisible(true);
        }
      }
    },
    [captionMode, drawingRef, savedTexts, draggingTextIndex, setDraggingTextIndex, setEditingTextIndex, setTextContent, setTextColor, setSelectedFont, setTextAlign, textAreaRef, getTextBounds]
  );

  const handleTextDrag = useCallback(
    (e) => {
      if (draggingTextIndex === null) return;

      const canvas = drawingRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches?.[0]?.clientX ?? e.clientX;
      const clientY = e.touches?.[0]?.clientY ?? e.clientY;
      const x = ((clientX - rect.left) / rect.width) * canvas.width;
      const y = ((clientY - rect.top) / rect.height) * canvas.height;

      const newX = (x - offsetRef.current.x) / (canvas.width / rect.width);
      const newY = (y - offsetRef.current.y) / (canvas.height / rect.height);

      setSavedTexts((prev) =>
        prev.map((text, index) =>
          index === draggingTextIndex ? { ...text, x: newX, y: newY } : text
        )
      );
    },
    [draggingTextIndex, drawingRef, setSavedTexts]
  );

  const handleTextDragEnd = useCallback(() => {
    setDraggingTextIndex(null);
    offsetRef.current = { x: 0, y: 0 };
  }, [setDraggingTextIndex]);

  const handlePinch = useCallback(
    (e) => {
      if (!captionMode || e.touches.length !== 2 || editingTextIndex === null) return;
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch1.clientX - touch2.clientX, 2) +
        Math.pow(touch1.clientY - touch2.clientY, 2)
      );

      if (touchDistanceRef.current === null) {
        touchDistanceRef.current = distance;
        initialFontSizeRef.current = savedTexts[editingTextIndex]?.fontSize || 20;
      } else {
        const scale = distance / touchDistanceRef.current;
        const newFontSize = Math.max(10, Math.min(100, initialFontSizeRef.current * scale));
        setSavedTexts((prev) =>
          prev.map((text, index) =>
            index === editingTextIndex ? { ...text, fontSize: newFontSize } : text
          )
        );
      }
    },
    [captionMode, editingTextIndex, savedTexts, setSavedTexts]
  );

  const handlePinchEnd = useCallback(() => {
    touchDistanceRef.current = null;
    initialFontSizeRef.current = null;
  }, []);

  const adjustFontSize = useCallback(
    (delta) => {
      if (editingTextIndex === null) return;
      setSavedTexts((prev) =>
        prev.map((text, index) =>
          index === editingTextIndex
            ? { ...text, fontSize: Math.max(10, Math.min(100, (text.fontSize || 20) + delta)) }
            : text
        )
      );
    },
    [editingTextIndex, setSavedTexts]
  );

useEffect(() => {
  const canvas = drawingRef.current;
  if (!canvas) return;

  const handleMouseDown = (e) => {
    if (!captionMode) return;
    savedTexts.forEach((_, index) => handleTextClick(e, index));
  };

  const handleMouseMove = (e) => handleTextDrag(e);
  const handleMouseUp = () => handleTextDragEnd();

  const handleTouchStart = (e) => {
    e.preventDefault();
    if (!captionMode) return;
    savedTexts.forEach((_, index) => handleTextClick(e, index));
    if (e.touches.length === 2 && editingTextIndex !== null) handlePinch(e);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 2 && captionMode && editingTextIndex !== null) handlePinch(e);
    else handleTextDrag(e);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleTextDragEnd();
    handlePinchEnd();
  };

  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

  return () => {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
    canvas.removeEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.removeEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.removeEventListener('touchend', handleTouchEnd, { passive: false });
  };
}, [
  drawingRef,
  savedTexts,
  captionMode,
  draggingTextIndex,
  editingTextIndex,
  handleTextClick,
  handleTextDrag,
  handleTextDragEnd,
  handlePinch,
  handlePinchEnd,
]);
  return (
    <>
      {captionMode && scaleControlsVisible && editingTextIndex !== null && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            zIndex: 20,
          }}
        >
          <button
            onClick={() => adjustFontSize(-2)}
            style={{
              padding: '5px 10px',
              fontSize: '16px',
              backgroundColor: '#fff',
              border: '1px solid #000',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            -
          </button>
          <button
            onClick={() => adjustFontSize(2)}
            style={{
              padding: '5px 10px',
              fontSize: '16px',
              backgroundColor: '#fff',
              border: '1px solid #000',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            +
          </button>
        </div>
      )}
    </>
  );
};

export default TextManager;