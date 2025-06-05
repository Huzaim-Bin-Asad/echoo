import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { LightbulbOff, Lightbulb, Images } from 'lucide-react';
import { AiOutlineClose } from 'react-icons/ai';

const QRScan = forwardRef(({ flashOn, setFlashOn }, ref) => {
  const [cameraStarted, setCameraStarted] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const trackRef = useRef(null);

  const stopCamera = () => {
    console.log('[QRScan] Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        console.log(`[QRScan] Stopping track: ${track.kind}`);
        track.stop();
      });
      streamRef.current = null;
      trackRef.current = null;
      setCameraStarted(false);
      console.log('[QRScan] Camera stopped.');
    } else {
      console.warn('[QRScan] No stream to stop.');
    }
  };

  const toggleFlash = useCallback(
    async (on = !flashOn) => {
      console.log(`[QRScan] Toggling flash: ${on}`);
      try {
        if (!trackRef.current) {
          console.warn('[QRScan] No video track available for toggling flash.');
          return;
        }
        await trackRef.current.applyConstraints({
          advanced: [{ torch: on }],
        });
        console.log(`[QRScan] Flash ${on ? 'enabled' : 'disabled'}`);
        setFlashOn(on);
      } catch (err) {
        console.warn('[QRScan] Flash not supported:', err);
      }
    },
    [flashOn, setFlashOn]
  );

  const startCamera = async () => {
    console.log('[QRScan] Requesting camera access...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      console.log('[QRScan] Camera stream obtained.');
      streamRef.current = stream;
      const videoTrack = stream.getVideoTracks()[0];
      trackRef.current = videoTrack;
      console.log('[QRScan] Video track initialized:', videoTrack.label);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        console.log('[QRScan] Video playback started.');
      } else {
        console.warn('[QRScan] Video element is not available.');
      }

      if (flashOn) {
        await toggleFlash(true);
      }

      setCameraStarted(true);
    } catch (err) {
      console.error('[QRScan] Error starting camera:', err);
    }
  };

  useImperativeHandle(ref, () => ({
    startCamera,
    stopCamera,
    startCameraWithStream: async (externalStream) => {
      console.log('[QRScan] Using external stream...');
      try {
        streamRef.current = externalStream;
        const videoTrack = externalStream.getVideoTracks()[0];
        trackRef.current = videoTrack;
        console.log('[QRScan] External video track:', videoTrack.label);

        if (videoRef.current) {
          videoRef.current.srcObject = externalStream;
          await videoRef.current.play();
          console.log('[QRScan] External stream playback started.');
        } else {
          console.warn('[QRScan] Video element not ready for external stream.');
        }

        if (flashOn) {
          await toggleFlash(true);
        }

        setCameraStarted(true);
      } catch (err) {
        console.error('[QRScan] Error using external camera stream:', err);
      }
    },
  }));

  // Only stop camera on unmount
  useEffect(() => {
    return () => {
      console.log('[QRScan] Component unmounted, cleaning up...');
      stopCamera();
    };
  }, []);

  // Start camera *after* videoRef is attached
  useEffect(() => {
    if (videoRef.current && !cameraStarted) {
      console.log('[QRScan] Video element ready, starting camera...');
      startCamera();
    }
  }, [videoRef.current]);

  return (
    <div className="position-relative" style={{ height: '100%' }}>
      {!cameraStarted && (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text-muted">Loading camera...</div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-100 h-100 object-fit-cover rounded"
        playsInline
        muted
        style={{ display: cameraStarted ? 'block' : 'none' }}
      />

      {cameraStarted && (
        <div className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-between px-3 pb-3">
          <button onClick={() => toggleFlash()} className="btn btn-light rounded-circle" aria-label="Toggle flash">
            {flashOn ? <Lightbulb color="gold" size={24} /> : <LightbulbOff size={24} />}
          </button>

          <button
            onClick={() => {
              console.log('[QRScan] Gallery button clicked.');
              alert('Open gallery or files here!');
            }}
            className="btn btn-light rounded-circle"
            aria-label="Open gallery"
          >
            <Images size={24} />
          </button>

          <button
            onClick={() => {
              console.log('[QRScan] Close button clicked.');
              stopCamera();
            }}
            className="btn btn-light rounded-circle"
            aria-label="Close scanner"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
      )}
    </div>
  );
});

export default QRScan;
