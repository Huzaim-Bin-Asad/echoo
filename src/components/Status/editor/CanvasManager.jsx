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

  const updateCanvasDimensions = useCallback(() => {
    const canvas = drawingRef.current;
    if (!canvas) return { canvasWidth: 0, canvasHeight: 0 };

    let mediaWidth, mediaHeight, naturalWidth, naturalHeight;
    if (isVideo && videoRef.current) {
      mediaWidth = window.innerWidth;
      mediaHeight = window.innerHeight;
      naturalWidth = videoRef.current.videoWidth;
      naturalHeight = videoRef.current.videoHeight;
    } else {
      const img = new Image();
      img.src = fileUrl;
      img.style.width = '100%';
      img.style.height = '100vh';
      img.style.objectFit= 'cover';
      img.style.position= 'absolute';
      img.style.visibility = 'hidden';
      document.body.appendChild(img);
      mediaWidth = window.innerWidth;
      mediaHeight = window.innerHeight;
      naturalWidth = img.naturalWidth;
      naturalHeight = img.naturalHeight;
      document.body.removeChild(img);
    }

    const aspectRatio = naturalWidth / naturalHeight;
    let canvasWidth = mediaWidth;
    let canvasHeight = mediaWidth / aspectRatio;

    if (canvasHeight > mediaHeight) {
      canvasHeight = mediaHeight;
      canvasWidth = mediaHeight * aspectRatio;
    }

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isVideo && videoRef.current) {
      const aspectRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;
      let drawWidth = canvas.width;
      let drawHeight = canvas.width / aspectRatio;
      if (drawHeight < canvas.height) {
        drawHeight = canvas.height;
        drawWidth = canvas.height * aspectRatio;
      }
      ctx.drawImage(
        videoRef.current,
        (canvas.width - drawWidth) / 2,
        (canvas.height - drawHeight) / 2,
        drawWidth,
        drawHeight
      );
    } else {
      const img = new Image();
      img.src = fileUrl;
      img.onload = () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        let drawWidth = canvas.width;
        let drawHeight = canvas.width / aspectRatio;
        if (drawHeight < canvas.height) {
          drawHeight = canvas.height;
          drawWidth = canvas.height * aspectRatio;
        }
        ctx.drawImage(
          img,
          (canvas.width - drawWidth) / 2,
          (canvas.height - drawHeight) / 2,
          drawWidth,
          drawHeight
        );
      };
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
      const xPos = (text.x || canvasWidth / 2) * scaleX;
      const yPos = (text.y || canvasHeight / 2) * scaleY;
      lines.forEach((line, lineIndex) => {
        const x = text.align === 'center' ? xPos : text.align === 'end' ? xPos - ctx.measureText(line).width : xPos;
        ctx.fillText(line, x, yPos + lineIndex * lineHeight);
      });
    });
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

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = naturalWidth;
    tempCanvas.height = naturalHeight;
    const tempCtx = tempCanvas.getContext('2d');

    if (isVideo && videoRef.current) {
      tempCtx.drawImage(videoRef.current, 0, 0, naturalWidth, naturalHeight);
    } else {
      const img = new Image();
      img.src = fileUrl;
      await new Promise((resolve) => (img.onload = resolve));
      tempCtx.drawImage(img, 0, 0, naturalWidth, naturalHeight);
    }

    const scaleX = naturalWidth / canvasWidth;
    const scaleY = naturalHeight / canvasHeight;

    const drawLine = (points, color, thickness) => {
      tempCtx.strokeStyle = color;
      tempCtx.lineWidth = thickness * Math.min(scaleX, scaleY);
      tempCtx.lineCap = 'round';
      tempCtx.lineJoin = 'round';
      tempCtx.beginPath();
      points.forEach((pt, i) => {
        if (i === 0) tempCtx.moveTo(pt.x * scaleX, pt.y * scaleY);
        else tempCtx.lineTo(pt.x * scaleX, pt.y * scaleY);
      });
      tempCtx.stroke();
    };
    paths.forEach((p) => drawLine(p.points, p.color, p.thickness));
    if (currentPath.length > 0) drawLine(currentPath, drawingColor, drawingThickness);

    savedTexts.forEach((text, index) => {
      tempCtx.fillStyle = text.color;
      tempCtx.font = `${(text.fontSize || 20) * Math.min(scaleX, scaleY)}px "${text.font}"`;
      tempCtx.textAlign = text.align;
      tempCtx.textBaseline = 'middle';
      const lines = text.content.split('\n');
      const lineHeight = (text.fontSize || 20) * 1.2 * Math.min(scaleX, scaleY);
      const xPos = (text.x || canvasWidth / 2) * scaleX;
      const yPos = (text.y || canvasHeight / 2) * scaleY;
      lines.forEach((line, lineIndex) => {
        const x = text.align === 'center' ? xPos : text.align === 'end' ? xPos - tempCtx.measureText(line).width : xPos;
        tempCtx.fillText(line, x, yPos + lineIndex * lineHeight);
      });
    });

    tempCtx.fillStyle = '#ffffff';
    tempCtx.font = `${16 * Math.min(scaleX, scaleY)}px Arial`;
    tempCtx.textBaseline = 'bottom';
    const padding = 10 * scaleX;
    tempCtx.fillText(caption, padding, naturalHeight - padding);

    const dataUrl = tempCanvas.toDataURL('image/png');
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