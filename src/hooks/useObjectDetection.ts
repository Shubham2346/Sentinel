import { useEffect, useState, useRef } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import type { DetectedObject } from '../types';
import { getPriority, estimateDistance } from '../utils/priority';

export const useObjectDetection = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isActive: boolean
) => {
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [detections, setDetections] = useState<DetectedObject[]>([]);
  const animationRef = useRef<number>();

  // Load model
  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // Detection loop
  useEffect(() => {
    if (!model || !isActive || !videoRef.current) return;

    const detect = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const predictions = await model.detect(videoRef.current);
        
        const processedDetections: DetectedObject[] = predictions.map(pred => ({
          class: pred.class,
          score: pred.score,
          bbox: pred.bbox,
          priority: getPriority(pred.class),
          distance: estimateDistance(pred.bbox, videoRef.current!.videoHeight)
        }));

        setDetections(processedDetections);
      }
      
      animationRef.current = requestAnimationFrame(detect);
    };

    detect();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [model, isActive, videoRef]);

  return { detections, isModelLoaded: !!model };
};