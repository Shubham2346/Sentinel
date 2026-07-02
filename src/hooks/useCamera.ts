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

      streamRef.current = stream;

      if (!videoRef.current) {
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        return;
      }

      videoRef.current.srcObject = stream;

      // ✅ CRITICAL FIX: wait for video to actually play
      videoRef.current.onloadedmetadata = async () => {
        try {
          await videoRef.current!.play();
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

      if (ipImageRef.current.width > 0 && canvas.width !== ipImageRef.current.width) {
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
        const targetUrl = `${url}/shot.jpg?t=${Date.now()}`;
        ipImageRef.current.src = `/api/proxy?url=${encodeURIComponent(targetUrl)}`;
      }
    };

    ipImageRef.current.onload = () => {
      updateFrame();
      if (ipImageRef.current) {
        ipIntervalRef.current = window.setTimeout(loadFrame, 100);
      }
    };
    
    ipImageRef.current.onerror = () => {
      console.error('Failed to load IP camera frame, retrying...');
      if (ipImageRef.current) {
        // Wait longer before retrying to avoid spamming the network on full failure
        ipIntervalRef.current = window.setTimeout(loadFrame, 2000); 
      }
    };

    loadFrame();
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (ipIntervalRef.current) {
      clearTimeout(ipIntervalRef.current);
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
