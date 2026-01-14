export const getPriority = (className: string): 'critical' | 'high' | 'medium' | 'low' => {
  const criticalObjects = ['car', 'truck', 'bus', 'motorcycle', 'bicycle'];
  const highObjects = ['person', 'stairs', 'stop sign'];
  const mediumObjects = ['door', 'chair', 'bottle', 'cup'];
  
  if (criticalObjects.includes(className)) return 'critical';
  if (highObjects.includes(className)) return 'high';
  if (mediumObjects.includes(className)) return 'medium';
  return 'low';
};

export const estimateDistance = (bbox: number[], videoHeight: number): number => {
  // Simple estimation: larger bounding box = closer object
  const objectHeight = bbox[3];
  const ratio = objectHeight / videoHeight;
  
  // Rough approximation (in meters)
  if (ratio > 0.6) return 1;
  if (ratio > 0.4) return 2;
  if (ratio > 0.2) return 3;
  return 5;
};