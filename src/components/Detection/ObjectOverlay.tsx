import React, { useEffect, useRef } from 'react';
import type { DetectedObject } from '../../types/detection.types';

interface ObjectOverlayProps {
  detections: DetectedObject[];
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const ObjectOverlay: React.FC<ObjectOverlayProps> = ({ detections, videoRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach(detection => {
      const [x, y, width, height] = detection.bbox;
      
      // Color based on priority
      const colors = {
        critical: '#ef4444',
        high: '#f59e0b',
        medium: '#3b82f6',
        low: '#10b981'
      };
      
      ctx.strokeStyle = colors[detection.priority];
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      
      // Label
      ctx.fillStyle = colors[detection.priority];
      ctx.fillRect(x, y - 25, width, 25);
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(
        `${detection.class} (${detection.distance}m)`,
        x + 5,
        y - 7
      );
    });
  }, [detections, videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};