import { useEffect, useCallback, useState, useRef } from 'react';

const CanvasManager = ({
  drawingRef,
  isVideo,
  videoRef,
  fileUrl,
  paths,
  currentPath,
  drawingColor,
  drawingThickness,
  savedTexts,
  captionMode,
  editingTextIndex,
  caption,
  saveImageCallback,
}) => {
  const [dimensions, setDimensions] = useState(null);
  const lastRender = useRef({ pathsLength: 0, currentPathLength: 0, savedTextsLength: 0 });
  const mediaDrawn = useRef(false);

  const updateCanvasDimensions = useCallback(() => {
    const canvas = drawingRef.current;
    if (!canvas) return { canvasWidth: 0, canvasHeight: 0 };

    let mediaWidth, mediaHeight;
    if (isVideo && videoRef.current) {
      mediaWidth = videoRef.current.offsetWidth;
      mediaHeight = videoRef.current.offsetHeight;
    } else {
      const img = new Image();
      img.src = fileUrl;
      img.style.width = '100%';
      img.style.height = '85.5vh';
      img.style.objectFit = 'contain';
      img.style.position = 'absolute';
      img.style.visibility = 'hidden';
      document.body.appendChild(img);
      mediaWidth = img.offsetWidth;
      mediaHeight = img.offsetHeight;
      document.body.removeChild(img);
    }

    const canvasWidth = mediaWidth;
    const canvasHeight = mediaHeight;

    canvas.width = canvasWidth * 2;
    canvas.height = canvasHeight * 2;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    return { canvasWidth, canvasHeight };
  }, [drawingRef, videoRef, fileUrl, isVideo]);

  useEffect(() => {
    const dims = updateCanvasDimensions();
    setDimensions(dims);
  }, [updateCanvasDimensions]);

  useEffect(() => {
    if (!dimensions || dimensions.canvasWidth === 0 || dimensions.canvasHeight === 0) return;

    const canvas = drawingRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const { canvasWidth, canvasHeight } = dimensions;

    const draw = () => {
      const needsRedraw =
        paths.length !== lastRender.current.pathsLength ||
        currentPath.length !== lastRender.current.currentPathLength ||
        savedTexts.length !== lastRender.current.savedTextsLength;

      if (needsRedraw || !mediaDrawn.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw media only once unless dimensions change
        if (!mediaDrawn.current) {
          if (isVideo && videoRef.current) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          } else {
            const img = new Image();
            img.src = fileUrl;
            img.onload = () => {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
          }
          mediaDrawn.current = true;
        }

        // Draw paths
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

        // Draw saved texts
        const scaleX = canvas.width / canvasWidth;
        const scaleY = canvas.height / canvasHeight;
        savedTexts.forEach((text, index) => {
          if (captionMode && editingTextIndex === index) return;
          ctx.fillStyle = text.color;
          ctx.font = `${(text.fontSize || 20) * Math.min(scaleX, scaleY)}px "${text.font}"`;
          ctx.textAlign = text.align;
          ctx.textBaseline = 'middle';
          const lines = text.content.split('\n');
          const lineHeight = (text.fontSize || 20) * 1.2 * Math.min(scaleX, scaleY);
          const xPos = (text.x || (canvasWidth / 2)) * scaleX;
          const yPos = (text.y || (canvasHeight / 2 - (lines.length * lineHeight) / 2 + (index * lineHeight * 2))) * scaleY;
          lines.forEach((line, lineIndex) => {
            const x = text.align === 'center' ? xPos :
                      text.align === 'end' ? xPos - ctx.measureText(line).width : xPos;
            ctx.fillText(line, x, yPos + lineIndex * lineHeight);
          });
        });

        lastRender.current = {
          pathsLength: paths.length,
          currentPathLength: currentPath.length,
          savedTextsLength: savedTexts.length,
        };
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, [dimensions, paths, currentPath, drawingColor, drawingThickness, savedTexts, captionMode, editingTextIndex, isVideo, videoRef, fileUrl, drawingRef]);

  const saveImage = useCallback(async () => {
    const canvas = drawingRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { canvasWidth, canvasHeight } = updateCanvasDimensions();

    let naturalWidth, naturalHeight;
    if (isVideo && videoRef.current) {
      naturalWidth = videoRef.current.videoWidth;
      naturalHeight = videoRef.current.videoHeight;
    } else {
      const img = new Image();
      img.src = fileUrl;
      await new Promise((resolve) => (img.onload = resolve));
      naturalWidth = img.width;
      naturalHeight = img.height;
    }

    const scaleX = canvas.width / naturalWidth;
    const scaleY = canvas.height / naturalHeight;

    if (isVideo && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      const img = new Image();
      img.src = fileUrl;
      await new Promise((resolve) => (img.onload = resolve));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

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

    savedTexts.forEach((text, index) => {
      ctx.fillStyle = text.color;
      ctx.font = `${(text.fontSize || 20) * Math.min(scaleX, scaleY)}px "${text.font}"`;
      ctx.textAlign = text.align;
      ctx.textBaseline = 'middle';
      const lines = text.content.split('\n');
      const lineHeight = (text.fontSize || 20) * 1.2 * Math.min(scaleX, scaleY);
      const xPos = (text.x || (naturalWidth / 2)) * scaleX;
      const yPos = (text.y || (naturalHeight / 2 - (lines.length * lineHeight) / 2 + (index * lineHeight * 2))) * scaleY;
      lines.forEach((line, lineIndex) => {
        const x = text.align === 'center' ? xPos :
                  text.align === 'end' ? xPos - ctx.measureText(line).width : xPos;
        ctx.fillText(line, x, yPos + lineIndex * lineHeight);
      });
    });

    ctx.fillStyle = '#ffffff';
    ctx.font = `${16 * Math.min(scaleX, scaleY)}px Arial`;
    ctx.textBaseline = 'bottom';
    const padding = 10 * (canvas.width / canvasWidth);
    ctx.fillText(caption, padding, canvasHeight - padding);

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
  }, [
    drawingRef,
    isVideo,
    videoRef,
    fileUrl,
    paths,
    currentPath,
    drawingColor,
    drawingThickness,
    savedTexts,
    caption,
    updateCanvasDimensions,
  ]);

  useEffect(() => {
    saveImageCallback(saveImage);
  }, [saveImageCallback, saveImage]);

  return null;
};

export default CanvasManager;