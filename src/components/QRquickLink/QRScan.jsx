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
import jsQR from 'jsqr';

const QRScan = forwardRef(({ flashOn, setFlashOn, onQRCodeScanned }, ref) => {
  const [cameraStarted, setCameraStarted] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const trackRef = useRef(null);
  const fileInputRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const lastScannedCode = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      trackRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setCameraStarted(false);
  };

  const toggleFlash = useCallback(
    async (on = !flashOn) => {
      try {
        if (!trackRef.current) return;
        await trackRef.current.applyConstraints({ advanced: [{ torch: on }] });
        setFlashOn(on);
      } catch (err) {
        console.warn('[QRScan] Flash not supported:', err);
      }
    },
    [flashOn, setFlashOn]
  );

  const parseAndSendQRCode = async (codeData) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser) throw new Error('No user found in localStorage');

      const [receiver_id, contact_name, username, email] = codeData.split('|');
      if (!receiver_id || !contact_name || !username || !email) {
        alert('Invalid QR code format');
        return;
      }

      const payload = {
        contact_id: crypto.randomUUID(),
        user_id: currentUser.user_id,
        sender_id: currentUser.user_id,
        receiver_id,
        contact_name,
      };

      console.log('[QRScan] Sending contact data:', payload);

      const response = await fetch('https://echoo-backend.vercel.app/api/qrContact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Backend error: ${errText}`);
      }

      const result = await response.json();
      console.log('[QRScan] Contact saved:', result);
      if (onQRCodeScanned) onQRCodeScanned(codeData);
    } catch (err) {
      console.error('[QRScan] Error handling QR code:', err);
      alert('Failed to add contact. Please try again.');
    }
  };

  const startScanning = () => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    scanIntervalRef.current = setInterval(() => {
      if (
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        videoRef.current.videoWidth
      ) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code && code.data !== lastScannedCode.current) {
          lastScannedCode.current = code.data;
          parseAndSendQRCode(code.data);
        }
      }
    }, 500);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      const videoTrack = stream.getVideoTracks()[0];
      trackRef.current = videoTrack;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (flashOn) await toggleFlash(true);
      setCameraStarted(true);
      startScanning();
    } catch (err) {
      console.error('[QRScan] Error starting camera:', err);
    }
  };

  useImperativeHandle(ref, () => ({
    startCamera,
    stopCamera,
  }));

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && !cameraStarted) {
      startCamera();
    }
  }, [videoRef.current]);

  const openGallery = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);
          if (code) {
            parseAndSendQRCode(code.data);
          } else {
            alert('No QR code detected in image.');
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="position-relative d-flex align-items-center justify-content-center"
      style={{ height: '100%', width: '100%' }}
    >
      {!cameraStarted && (
        <div className="text-muted position-absolute top-50 start-50 translate-middle">
          Loading camera...
        </div>
      )}

      <video
        ref={videoRef}
        className="w-100 h-100 object-fit-cover rounded"
        playsInline
        muted
        style={{ display: cameraStarted ? 'block' : 'none' }}
      />

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {cameraStarted && (
        <div
          className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-between px-3 pb-3"
          style={{ gap: '4vw' }}
        >
          <button
            onClick={() => toggleFlash()}
            className="btn btn-light rounded-pill shadow"
            style={{ width: '12vw', height: '12vw', maxWidth: 60, maxHeight: 60 }}
            aria-label="Toggle flash"
          >
            {flashOn ? <Lightbulb color="gold" size={24} /> : <LightbulbOff size={24} />}
          </button>

          <button
            onClick={openGallery}
            className="btn btn-light rounded-pill shadow"
            style={{ width: '12vw', height: '12vw', maxWidth: 60, maxHeight: 60 }}
            aria-label="Open gallery"
          >
            <Images size={24} />
          </button>

          <button
            onClick={() => stopCamera()}
            className="btn btn-light rounded-pill shadow"
            style={{ width: '12vw', height: '12vw', maxWidth: 60, maxHeight: 60 }}
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
