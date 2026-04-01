import { useRef, useState, useCallback, useEffect } from 'react';

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [isActive, setIsActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const streamRef = useRef<MediaStream | null>(null);

  // IP Camera support
  const [isIPCamera, setIsIPCamera] = useState(false);
  const [ipCameraUrl, setIPCameraUrl] = useState('');
  const ipImageRef = useRef<HTMLImageElement | null>(null);
  const ipIntervalRef = useRef<number | null>(null);

  // ✅ FIXED: Phone Camera Start
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;

      // ✅ CRITICAL FIX: wait for video to actually play
      videoRef.current.onloadedmetadata = async () => {
        try {
          await videoRef.current!.play();
          streamRef.current = stream;
          setIsActive(true); // ✅ ONLY after play()
          setIsIPCamera(false);
        } catch (err) {
          console.error('Video play failed:', err);
        }
      };
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Could not access camera. Check permissions.');
    }
  }, [facingMode]);

  // Start IP Webcam
  const startIPCamera = useCallback((url: string) => {
    if (!url) {
      alert('Please enter a valid IP camera URL');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      alert('URL must start with http:// or https://');
      return;
    }

    setIPCameraUrl(url);
    setIsIPCamera(true);
    setIsActive(true);

    ipImageRef.current = new Image();
    ipImageRef.current.crossOrigin = 'anonymous';

    const updateFrame = () => {
      if (!ipImageRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (canvas.width === 0 && ipImageRef.current.width > 0) {
        canvas.width = ipImageRef.current.width;
        canvas.height = ipImageRef.current.height;
      }

      try {
        ctx.drawImage(ipImageRef.current, 0, 0, canvas.width, canvas.height);
      } catch (error) {
        console.error('Error drawing IP camera frame:', error);
      }
    };

    const loadFrame = () => {
      if (ipImageRef.current) {
        ipImageRef.current.src = `${url}/shot.jpg?t=${Date.now()}`;
      }
    };

    ipImageRef.current.onload = updateFrame;
    ipImageRef.current.onerror = () => {
      console.error('Failed to load IP camera frame');
    };

    loadFrame();
    ipIntervalRef.current = window.setInterval(loadFrame, 100);
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (ipIntervalRef.current) {
      clearInterval(ipIntervalRef.current);
      ipIntervalRef.current = null;
    }

    if (ipImageRef.current) {
      ipImageRef.current.src = '';
      ipImageRef.current = null;
    }

    setIsActive(false);
    setIsIPCamera(false);
    setIPCameraUrl('');
  }, []);

  const switchCamera = useCallback(() => {
    if (isIPCamera) return;
    stopCamera();
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  }, [isIPCamera, stopCamera]);

  useEffect(() => {
    // intentionally empty – user-triggered start only
  }, [facingMode]);

  return {
    videoRef,
    canvasRef,
    isActive,
    startCamera,
    startIPCamera,
    stopCamera,
    switchCamera,
    facingMode,
    isIPCamera,
    ipCameraUrl
  };
};
