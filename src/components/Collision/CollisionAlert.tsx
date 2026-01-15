import React from 'react';
import type { CollisionZone } from '../../types';

interface CollisionAlertProps {
  zone: CollisionZone;
}

export const CollisionAlert: React.FC<CollisionAlertProps> = ({ zone }) => {
  const isDanger = zone.dangerLevel === 'danger';
  const bgColor = isDanger ? 'bg-red-600' : 'bg-yellow-500';
  const textColor = isDanger ? 'text-white' : 'text-black';
  const animationClass = isDanger ? 'animate-pulse' : '';

  return (
    <div className={`absolute top-0 left-0 right-0 z-50 ${bgColor} ${animationClass}`}>
      <div className="flex items-center justify-center gap-8 py-8 px-4">
        {/* Left Arrow */}
        {zone.region === 'left' && (
          <div className="flex items-center">
            <svg className="w-24 h-24 animate-bounce" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </div>
        )}

        {/* Alert Message */}
        <div className={`text-center ${textColor}`}>
          <div className="text-7xl md:text-9xl font-black tracking-wider leading-none">
            {isDanger ? 'DANGER' : 'CAUTION'}
          </div>
          <div className="text-5xl md:text-7xl font-black mt-4">
            {zone.region.toUpperCase()}
          </div>
          <div className="text-3xl md:text-5xl font-bold mt-4">
            {zone.closestDistance.toFixed(1)}m - {zone.objects[0]?.toUpperCase() || 'OBSTACLE'}
          </div>
        </div>

        {/* Right Arrow */}
        {zone.region === 'right' && (
          <div className="flex items-center">
            <svg className="w-24 h-24 animate-bounce" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};