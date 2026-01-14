import React from 'react';

interface CameraControlsProps {
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  onSwitch: () => void;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  isActive,
  onStart,
  onStop,
  onSwitch
}) => {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4">
      <button
        onClick={isActive ? onStop : onStart}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold"
        aria-label={isActive ? 'Stop camera' : 'Start camera'}
      >
        {isActive ? 'Stop' : 'Start'}
      </button>
      {isActive && (
        <button
          onClick={onSwitch}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg text-lg font-semibold"
          aria-label="Switch camera"
        >
          Switch
        </button>
      )}
    </div>
  );
};