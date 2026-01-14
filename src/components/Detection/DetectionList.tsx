import React from 'react';
import type { DetectedObject } from '../../types';

interface DetectionListProps {
  detections: DetectedObject[];
}

export const DetectionList: React.FC<DetectionListProps> = ({ detections }) => {
  const getPriorityColor = (priority: DetectedObject['priority']) => {
    const colors = {
      critical: 'bg-red-600',
      high: 'bg-orange-500',
      medium: 'bg-blue-500',
      low: 'bg-green-500'
    };
    return colors[priority];
  };

  return (
    <div className="space-y-2">
      {detections.map((detection, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-2 bg-white/90 rounded-lg"
        >
          <div className={`w-3 h-3 rounded-full ${getPriorityColor(detection.priority)}`} />
          <div className="flex-1">
            <span className="font-medium text-gray-900">{detection.class}</span>
          </div>
          <span className="text-sm text-gray-600">{detection.distance}m</span>
        </div>
      ))}
    </div>
  );
};