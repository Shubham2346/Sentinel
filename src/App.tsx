import React, { useState } from 'react';
import { CameraView } from './components/Camera/CameraView';
import { CameraControls } from './components/Camera/CameraControls';
import { ObjectOverlay } from './components/Detection/ObjectOverlay';
import { VoiceInput } from './components/Voice/VoiceInput';
import { useCamera } from './hooks/useCamera';
import { useObjectDetection } from './hooks/useObjectDetection';
import { alertService } from './services/alertService';
import './styles/globals.css';

function App() {
  const { videoRef, isActive, startCamera, stopCamera, switchCamera } = useCamera();
  const { detections, isModelLoaded } = useObjectDetection(videoRef, isActive);
  const [enableTTS, setEnableTTS] = useState(true);
  const [enableHaptics, setEnableHaptics] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Process detections for alerts
  React.useEffect(() => {
    if (detections.length > 0 && isActive) {
      alertService.processDetections(detections, enableTTS, enableHaptics);
    }
  }, [detections, isActive, enableTTS, enableHaptics]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">Project Sentinel</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-gray-800/80 text-white rounded-lg"
            aria-label="Settings"
          >
            ⚙️ Settings
          </button>
        </div>
        {!isModelLoaded && (
          <div className="mt-2 text-yellow-400 text-sm">
            Loading AI model...
          </div>
        )}
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-20 right-4 z-20 bg-white rounded-lg shadow-xl p-6 w-80">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Text-to-Speech</span>
              <input
                type="checkbox"
                checked={enableTTS}
                onChange={(e) => setEnableTTS(e.target.checked)}
                className="w-6 h-6"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-700">Haptic Feedback</span>
              <input
                type="checkbox"
                checked={enableHaptics}
                onChange={(e) => setEnableHaptics(e.target.checked)}
                className="w-6 h-6"
              />
            </label>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                Detection Status: {isActive ? '✅ Active' : '⏸️ Inactive'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Objects Detected: {detections.length}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      )}

      {/* Camera View */}
      <CameraView videoRef={videoRef} isActive={isActive} />

      {/* Object Detection Overlay */}
      {isActive && isModelLoaded && (
        <ObjectOverlay detections={detections} videoRef={videoRef} />
      )}

      {/* Voice Input */}
      {isActive && <VoiceInput videoRef={videoRef} />}

      {/* Camera Controls */}
      <CameraControls
        isActive={isActive}
        onStart={startCamera}
        onStop={stopCamera}
        onSwitch={switchCamera}
      />

      {/* Detection List (Bottom Info Bar) */}
      {isActive && detections.length > 0 && (
        <div className="absolute bottom-24 left-0 right-0 px-4">
          <div className="bg-black/70 backdrop-blur-sm text-white rounded-lg p-3 max-w-md mx-auto">
            <div className="text-sm space-y-1">
              {detections.slice(0, 3).map((det, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="font-medium">{det.class}</span>
                  <span className="text-gray-300">{det.distance}m</span>
                </div>
              ))}
              {detections.length > 3 && (
                <div className="text-gray-400 text-xs text-center mt-2">
                  +{detections.length - 3} more objects
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;