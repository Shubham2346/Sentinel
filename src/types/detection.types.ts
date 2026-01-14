export interface DetectedObject {
  class: string;
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
  priority: 'critical' | 'high' | 'medium' | 'low';
  distance?: number;
  timestamp?: number;
}

export interface DetectionConfig {
  minConfidence: number;
  maxDetections: number;
  detectionInterval: number;
}