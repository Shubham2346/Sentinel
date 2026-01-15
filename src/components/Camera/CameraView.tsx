import React, { useEffect, useRef } from "react";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isActive: boolean;
  isIPCamera: boolean;
  ipUrl: string;
}

export const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  canvasRef,
  isActive,
  isIPCamera,
  ipUrl,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!isIPCamera) return;
    if (!canvasRef?.current) return;
    if (!imgRef.current) return;

    const canvas = canvasRef.current;
    const img = imgRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    const draw = () => {
      if (img.complete && img.naturalWidth > 0) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
      }
      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isIPCamera, canvasRef]);

  return (
    <div className="relative w-full h-screen bg-black">
      {!isIPCamera ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          <img
            ref={imgRef}
            src={ipUrl}
            alt="Phone Camera"
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}

      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
          Camera Inactive
        </div>
      )}
    </div>
  );
};
