import React, {
  useRef,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { LightbulbOff, Lightbulb, Images } from 'lucide-react';
import { AiOutlineClose } from 'react-icons/ai';

const QRScan = forwardRef(({ flashOn, setFlashOn }, ref) => {
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const trackRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this environment.');
      }

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
    } catch (err) {
      console.error('Camera error:', err.message);
      setCameraError(err.message);
      alert(`Camera access failed: ${err.message}`);
    }
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    startCamera,
    stopCamera,
  }));

  return (
    <div className="position-relative" style={{ height: '100%' }}>
      {!cameraStarted && !cameraError && (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text-muted">Camera is off</div>
        </div>
      )}

      {cameraError && (
        <div className="d-flex justify-content-center align-items-center h-100 text-danger text-center px-3">
          <div>
            <p><strong>Camera error:</strong></p>
            <p>{cameraError}</p>
            <button className="btn btn-outline-primary mt-2" onClick={startCamera}>
              Retry
            </button>
          </div>
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

          {/* Overlay Icons */}
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
});

export default QRScan;
