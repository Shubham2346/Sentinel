import React from 'react';
import type { CollisionZone } from '../../types';

interface RegionOverlayProps {
  zone: CollisionZone;
  videoWidth: number;
  videoHeight: number;
}

export const RegionOverlay: React.FC<RegionOverlayProps> = ({ zone, videoWidth, _videoHeight }) => {
  const isDanger = zone.dangerLevel === 'danger';
  const borderColor = isDanger ? 'border-red-600' : 'border-yellow-500';
  const bgColor = isDanger ? 'bg-red-600' : 'bg-yellow-500';

  // Calculate region position
  const getRegionStyle = (): React.CSSProperties => {
    const width = videoWidth / 3;
    
    switch (zone.region) {
      case 'left':
        return { left: 0, width: `${width}px` };
      case 'center':
        return { left: `${width}px`, width: `${width}px` };
      case 'right':
        return { left: `${width * 2}px`, width: `${width}px` };
    }
  };

  return (
    <div 
      className="absolute top-0 h-full pointer-events-none z-40"
      style={getRegionStyle()}
    >
      {/* Thick pulsing border */}
      <div className={`absolute inset-0 border-8 ${borderColor} ${isDanger ? 'animate-pulse' : ''}`} />
      
      {/* Corner highlights - TOP */}
      <div 
        className={`absolute top-0 ${zone.region === 'center' ? 'left-1/2 -translate-x-1/2' : zone.region === 'left' ? 'left-0' : 'right-0'} w-40 h-40 ${bgColor} opacity-70`}
      />
      
      {/* Corner highlights - BOTTOM */}
      <div 
        className={`absolute bottom-0 ${zone.region === 'center' ? 'left-1/2 -translate-x-1/2' : zone.region === 'left' ? 'left-0' : 'right-0'} w-40 h-40 ${bgColor} opacity-70`}
      />

      {/* Flashing side highlight for extra visibility */}
      {isDanger && (
        <div className={`absolute inset-0 ${bgColor} opacity-20 animate-pulse`} />
      )}
    </div>
  );
};