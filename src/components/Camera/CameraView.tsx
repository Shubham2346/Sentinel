import React from 'react';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({ videoRef, isActive }) => {
  return (
    <div className="relative w-full h-screen bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
          Camera Inactive
        </div>
      )}
    </div>
  );
};