import { useEffect, useState, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import type { DetectedObject } from "../types";
import { getPriority, estimateDistance } from "../utils/priority";

export const useObjectDetection = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isActive: boolean,
  isIPCamera: boolean
) => {
  const [model, setModel] =
    useState<cocoSsd.ObjectDetection | null>(null);

  const [detections, setDetections] =
    useState<DetectedObject[]>([]);

  const rafRef = useRef<number | null>(null);
  const lastRunRef = useRef<number>(0);

  // Load model ONCE
  useEffect(() => {
    cocoSsd.load().then(setModel);
  }, []);

  // Detection loop
  useEffect(() => {
    if (!model || !isActive) return;

    const detect = async () => {
      const now = Date.now();
      if (now - lastRunRef.current < 120) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }
      lastRunRef.current = now;

      const input = isIPCamera
        ? canvasRef.current
        : videoRef.current;

      if (!input) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      if (input instanceof HTMLVideoElement) {
        if (input.readyState < 2) {
          rafRef.current = requestAnimationFrame(detect);
          return;
        }
        // TFJS often requires explicit HTML width/height properties matching the video dimensions
        if (input.videoWidth > 0 && input.width !== input.videoWidth) {
          input.width = input.videoWidth;
        }
        if (input.videoHeight > 0 && input.height !== input.videoHeight) {
          input.height = input.videoHeight;
        }
      }

      // SAFETY: ensure dimensions exist
      const inputHeight =
        input instanceof HTMLVideoElement
          ? input.videoHeight
          : input.height;

      if (!inputHeight || inputHeight === 0) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      try {
        const predictions = await model.detect(input);

        const processed = predictions.map(pred => ({
          class: pred.class,
          score: pred.score,
          bbox: pred.bbox,
          priority: getPriority(pred.class),
          distance: estimateDistance(pred.bbox, inputHeight),
        }));

        setDetections(processed);
      } catch (e) {
        console.error("Detection error:", e);
      }

      rafRef.current = requestAnimationFrame(detect);
    };

    detect();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [model, isActive, isIPCamera]);

  return {
    detections,
    isModelLoaded: !!model,
  };
};
