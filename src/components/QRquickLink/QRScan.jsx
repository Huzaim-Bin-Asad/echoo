import React, { useEffect, useRef, useCallback } from 'react';
import { LightbulbOff, Lightbulb } from 'lucide-react'; // Using lucide-react for flash on/off icons
import { Images } from 'lucide-react'; // Using lucide-react for gallery icon
import { AiOutlineClose } from 'react-icons/ai'; // You can still keep 'react-icons' for other icons if necessary

const QRScan = ({ flashOn, setFlashOn }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const trackRef = useRef(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    trackRef.current = null;
  };

  // Wrap the toggleFlash function in useCallback
  const toggleFlash = useCallback(async (on = !flashOn) => {
    try {
      if (!trackRef.current) return;
      await trackRef.current.applyConstraints({
        advanced: [{ torch: on }],
      });
      setFlashOn(on);
    } catch (err) {
      console.warn('Flash not supported:', err);
    }
  }, [flashOn, setFlashOn]); // Dependencies of the callback: flashOn and setFlashOn

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        streamRef.current = stream;
        const videoTrack = stream.getVideoTracks()[0];
        trackRef.current = videoTrack;

        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((err) => console.warn('Play error:', err));
        };

        if (flashOn) {
          toggleFlash(true);
        }
      } catch (err) {
        console.error('Camera error:', err);
      }
    };

    startCamera();
    return () => stopCamera();
  }, [flashOn, toggleFlash]); // Now toggleFlash is stable, no issues with dependency changes

  return (
    <div className="position-relative" style={{ height: '100%' }}>
      <video
        ref={videoRef}
        className="w-100 h-100 object-fit-cover rounded"
        playsInline
        muted
      />

      {/* Icons over video */}
      <div className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-between px-3 pb-3">
        {/* Flash toggle */}
        <button onClick={() => toggleFlash()} className="btn btn-light rounded-circle">
          {flashOn ? <Lightbulb color="gold" size={24} /> : <LightbulbOff size={24} />}
        </button>

        {/* Left Side: Open User Gallery */}
        <button
          onClick={() => alert('Open gallery or files here!')} // Replace with your gallery logic
          className="btn btn-light rounded-circle"
        >
          <Images size={24} />
        </button>

        {/* Close button */}
        <button onClick={stopCamera} className="btn btn-light rounded-circle">
          <AiOutlineClose size={24} />
        </button>
      </div>
    </div>
  );
};

export default QRScan;
