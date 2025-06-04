import React, { useEffect, useRef, useCallback, useState } from 'react';
import { LightbulbOff, Lightbulb, Images } from 'lucide-react';
import { AiOutlineClose } from 'react-icons/ai';

const QRScan = ({ flashOn, setFlashOn }) => {
  const [cameraStarted, setCameraStarted] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const trackRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      trackRef.current = null;
      setCameraStarted(false);
    }
  };

  const toggleFlash = useCallback(
    async (on = !flashOn) => {
      try {
        if (!trackRef.current) return;
        await trackRef.current.applyConstraints({
          advanced: [{ torch: on }],
        });
        setFlashOn(on);
      } catch (err) {
        console.warn('Flash not supported:', err);
      }
    },
    [flashOn, setFlashOn]
  );

  const initializeCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });

    streamRef.current = stream;
    const videoTrack = stream.getVideoTracks()[0];
    trackRef.current = videoTrack;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch((err) =>
          console.warn('Video play error:', err)
        );
      };
    }

    if (flashOn) {
      toggleFlash(true);
    }

    setCameraStarted(true);
  };

  useEffect(() => {
    initializeCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="position-relative" style={{ height: '100%' }}>
      {!cameraStarted && (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text-muted">Loading camera...</div>
        </div>
      )}

      {cameraStarted && (
        <>
          <video
            ref={videoRef}
            className="w-100 h-100 object-fit-cover rounded"
            playsInline
            muted
          />

          <div className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-between px-3 pb-3">
            <button onClick={() => toggleFlash()} className="btn btn-light rounded-circle">
              {flashOn ? <Lightbulb color="gold" size={24} /> : <LightbulbOff size={24} />}
            </button>

            <button
              onClick={() => alert('Open gallery or files here!')}
              className="btn btn-light rounded-circle"
            >
              <Images size={24} />
            </button>

            <button onClick={stopCamera} className="btn btn-light rounded-circle">
              <AiOutlineClose size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QRScan;
