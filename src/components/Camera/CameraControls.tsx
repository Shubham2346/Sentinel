import React from "react";

interface CameraControlsProps {
  isActive: boolean;
  isIPCamera: boolean;
  onStart: () => void;
  onStop: () => void;
  onSwitch: () => void;
  onToggleSource: () => void;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  isActive,
  isIPCamera,
  onStart,
  onStop,
  onSwitch,
  onToggleSource,
}) => {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4 flex-wrap">
      <button
        onClick={isActive ? onStop : onStart}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold"
      >
        {isActive ? "Stop" : "Start"}
      </button>

      {isActive && !isIPCamera && (
        <button
          onClick={onSwitch}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg text-lg font-semibold"
        >
          Switch
        </button>
      )}

      <button
        onClick={onToggleSource}
        className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold"
      >
        {isIPCamera ? "Use Laptop Camera" : "Use Phone Camera"}
      </button>
    </div>
  );
};
