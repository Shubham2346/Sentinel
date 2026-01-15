import React, { useEffect, useRef } from "react";
import type { DetectedObject } from "../../types/detection.types";

interface ObjectOverlayProps {
  detections: DetectedObject[];
  /**
   * Can be:
   * - videoRef (laptop camera)
   * - canvasRef (phone IP camera)
   */
  sourceRef: React.RefObject<
    HTMLVideoElement | HTMLCanvasElement | null
  >;
}

export const ObjectOverlay: React.FC<ObjectOverlayProps> = ({
  detections,
  sourceRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!sourceRef?.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const source = sourceRef.current;

    const width =
      source instanceof HTMLVideoElement
        ? source.videoWidth
        : source.width;

    const height =
      source instanceof HTMLVideoElement
        ? source.videoHeight
        : source.height;

    if (!width || !height) return;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    detections.forEach(det => {
      const [x, y, w, h] = det.bbox;

      const colors: Record<string, string> = {
        critical: "#ef4444",
        high: "#f59e0b",
        medium: "#3b82f6",
        low: "#10b981",
      };

      const color = colors[det.priority] ?? "#ffffff";

      // Bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      // Label background
      ctx.fillStyle = color;
      ctx.fillRect(x, y - 24, ctx.measureText(det.class).width + 60, 24);

      // Label text
      ctx.fillStyle = "#ffffff";
      ctx.font = "16px Arial";
      ctx.fillText(
        `${det.class} (${det.distance}m)`,
        x + 4,
        y - 7
      );
    });
  }, [detections, sourceRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};
