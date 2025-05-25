import { useEffect, useCallback } from 'react';

const VideoManager = ({
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
}) => {
  const generateThumbnails = useCallback(async () => {
    if (!isVideo || !videoRef.current || !canvasRef.current || !stripRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    try {
      const thumbCount = 10; // Number of thumbnails
      const interval = video.duration / thumbCount;
      const thumbWidth = stripRef.current.offsetWidth / thumbCount;
      setThumbWidth(thumbWidth);

      canvas.width = thumbWidth * 2; // Higher resolution for quality
      canvas.height = (thumbWidth * video.videoHeight) / video.videoWidth * 2;

      const thumbs = [];
      for (let i = 0; i < thumbCount; i++) {
        video.currentTime = i * interval;
        await new Promise((resolve) => {
          video.onseeked = () => resolve();
          video.onerror = () => {
            console.error('Error seeking video at time:', i * interval);
            resolve();
          };
        });
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        thumbs.push({ time: i * interval, dataUrl: canvas.toDataURL('image/jpeg', 0.8) });
      }
      setThumbnails(thumbs);
      video.currentTime = currentTime; // Restore current time
      console.log('Thumbnails generated:', thumbs.length);
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
    }
  }, [isVideo, videoRef, canvasRef, stripRef, setThumbWidth, setThumbnails, currentTime]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch((error) => console.error('Play error:', error));
    } else {
      videoRef.current.pause();
    }
  }, [videoRef]);

  const startScrub = useCallback((e) => {
    e.preventDefault();
    if (!videoRef.current) return;
    setScrubbing(true);
    videoRef.current.pause();
  }, [setScrubbing, videoRef]);

  const scrub = useCallback(
    (e) => {
      if (!scrubbing || !videoRef.current || !stripRef.current || !scrubberRef.current) return;
      e.preventDefault();

      const rect = stripRef.current.getBoundingClientRect();
      const clientX = e.touches?.[0]?.clientX ?? e.clientX;
      const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = offsetX / rect.width;
      const newTime = percentage * duration;

      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      scrubberRef.current.style.left = `${offsetX}px`;
    },
    [scrubbing, videoRef, stripRef, scrubberRef, duration, setCurrentTime]
  );

  const isPlaying = videoRef.current ? !videoRef.current.paused : false;

  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      generateThumbnails();
    };

    const handleTimeUpdate = () => {
      if (!scrubbing && stripRef.current && scrubberRef.current) {
        setCurrentTime(video.currentTime);
        const percentage = video.currentTime / duration;
        const stripWidth = stripRef.current.offsetWidth;
        scrubberRef.current.style.left = `${percentage * stripWidth}px`;
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isVideo, videoRef, setDuration, setCurrentTime, scrubbing, duration, stripRef, scrubberRef, generateThumbnails]);

  return { isPlaying, togglePlay, startScrub, scrub };
};

export default VideoManager;