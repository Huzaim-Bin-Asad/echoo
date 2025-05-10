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
  // Define generateThumbnails at the top to avoid initialization issues
  const generateThumbnails = useCallback(async () => {
    if (!isVideo || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const thumbCount = 10; // Number of thumbnails to generate
    const interval = video.duration / (thumbCount + 1);
    const thumbWidth = stripRef.current.offsetWidth / thumbCount;
    setThumbWidth(thumbWidth);

    const thumbs = [];
    for (let i = 1; i <= thumbCount; i++) {
      const time = i * interval;
      video.currentTime = time;

      await new Promise((resolve) => {
        video.onseeked = () => resolve();
      });

      canvas.width = thumbWidth * 2; // Double resolution for better quality
      canvas.height = (thumbWidth * video.videoHeight) / video.videoWidth * 2;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      thumbs.push({ time, dataUrl });
    }

    setThumbnails(thumbs);
  }, [isVideo, videoRef, canvasRef, stripRef, setThumbWidth, setThumbnails]);

  // Video playback controls
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [videoRef]);

  const startScrub = useCallback(() => {
    if (!videoRef.current) return;
    setScrubbing(true);
    videoRef.current.pause();
  }, [setScrubbing, videoRef]);

  const scrub = useCallback(
    (e) => {
      if (!scrubbing || !videoRef.current) return;

      const strip = stripRef.current;
      const scrubber = scrubberRef.current;
      const top = topRef.current;

      const rect = strip.getBoundingClientRect();
      const offsetX = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
      const percentage = Math.min(1, Math.max(0, offsetX / rect.width));
      const newTime = percentage * duration;

      scrubber.style.width = `${percentage * 100}%`;
      top.style.left = `${percentage * 100}%`;

      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [scrubbing, videoRef, stripRef, scrubberRef, topRef, duration, setCurrentTime]
  );

  const isPlaying = videoRef.current ? !videoRef.current.paused : false;

  // Set video duration and current time
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      if (!scrubbing) {
        setCurrentTime(video.currentTime);
        if (stripRef.current && scrubberRef.current && topRef.current) {
          const percentage = video.currentTime / duration;
          scrubberRef.current.style.width = `${percentage * 100}%`;
          topRef.current.style.left = `${percentage * 100}%`;
        }
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isVideo, videoRef, setDuration, setCurrentTime, scrubbing, duration, stripRef, scrubberRef, topRef]);

  // Generate thumbnails when the video is loaded
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const video = videoRef.current;
    const handleLoadedData = () => {
      generateThumbnails();
    };

    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [isVideo, videoRef, generateThumbnails]);

  return { isPlaying, togglePlay, startScrub, scrub };
};

export default VideoManager;