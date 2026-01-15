import React, { useState, useEffect } from 'react';
import { CameraView } from './components/Camera/CameraView';
import { CameraControls } from './components/Camera/CameraControls';
import { ObjectOverlay } from './components/Detection/ObjectOverlay';
import { VoiceInput } from './components/Voice/VoiceInput';
import { CollisionAlert } from './components/Collision/CollisionAlert';
import { RegionOverlay } from './components/Collision/RegionOverlay';
import { useCamera } from './hooks/useCamera';
import { useObjectDetection } from './hooks/useObjectDetection';
import { useCollisionDetection } from './hooks/useCollisionDetection.ts';
import { alertService } from './services/alertService';
import './styles/globals.css';

function App() {
  const { 
    videoRef, 
    canvasRef, 
    isActive, 
    startCamera, 
    startIPCamera,
    stopCamera, 
    switchCamera,
    isIPCamera,
    ipCameraUrl
  } = useCamera();

  const { detections, isModelLoaded } = useObjectDetection(
    videoRef, 
    canvasRef, 
    isActive, 
    isIPCamera
  );

  // NEW: Collision Detection
  const videoWidth = isIPCamera 
    ? canvasRef.current?.width || 0 
    : videoRef.current?.videoWidth || 0;
  
  const collisionAlert = useCollisionDetection(detections, videoWidth, isActive);

  const [enableTTS, setEnableTTS] = useState(true);
  const [enableHaptics, setEnableHaptics] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showIPInput, setShowIPInput] = useState(false);
  const [ipInput, setIPInput] = useState('');

  // Process detections for alerts (existing functionality)
  useEffect(() => {
    if (detections.length > 0 && isActive) {
      alertService.processDetections(detections, enableTTS, enableHaptics);
    }
  }, [detections, isActive, enableTTS, enableHaptics]);

  const handleIPConnect = () => {
    if (!ipInput.trim()) {
      alert('Please enter an IP camera URL');
      return;
    }
    startIPCamera(ipInput);
    setShowIPInput(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Project Sentinel</h1>
            {!isModelLoaded && (
              <div className="mt-1 text-yellow-400 text-sm">
                Loading AI model...
              </div>
            )}
            {isIPCamera && (
              <div className="mt-1 text-blue-400 text-sm">
                📡 IP Camera: {ipCameraUrl}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700/80 transition-colors min-w-[44px] min-h-[44px]"
            aria-label="Settings"
          >
            ⚙️ Settings
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-20 right-4 z-20 bg-white rounded-lg shadow-xl p-6 w-80 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Settings</h2>
          
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

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Detection Status: {isActive ? '✅ Active' : '⏸️ Inactive'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Objects Detected: {detections.length}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Collision Alert: {collisionAlert.isActive ? '🚨 ACTIVE' : '✅ Safe'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* IP Camera Input Modal */}
      {showIPInput && !isActive && (
        <div className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect IP Webcam
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IP Camera URL
                </label>
                <input
                  type="text"
                  value={ipInput}
                  onChange={(e) => setIPInput(e.target.value)}
                  placeholder="http://192.168.1.100:8080"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>1. Install "IP Webcam" app on Android</p>
                <p>2. Start server in the app</p>
                <p>3. Enter the URL shown (e.g., http://192.168.1.100:8080)</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleIPConnect}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Connect
                </button>
                <button
                  onClick={() => setShowIPInput(false)}
                  className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera View */}
      <div className="relative w-full h-full">
        {isIPCamera ? (
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Region dividers (subtle) */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gray-500/20" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gray-500/20" />
          </div>
        )}

        {/* NEW: Collision Alert Overlay */}
        {collisionAlert.isActive && collisionAlert.zone && (
          <>
            <RegionOverlay 
              zone={collisionAlert.zone} 
              videoWidth={videoWidth}
              videoHeight={isIPCamera ? canvasRef.current?.height || 0 : videoRef.current?.videoHeight || 0}
            />
            <CollisionAlert zone={collisionAlert.zone} />
          </>
        )}

        {/* Object Detection Overlay (existing) */}
        {isActive && isModelLoaded && (
          <ObjectOverlay 
            detections={detections} 
            sourceRef={isIPCamera ? canvasRef : videoRef}
          />
        )}
      </div>

      {/* Voice Input (existing) */}
      {isActive && !isIPCamera && <VoiceInput videoRef={videoRef} />}

      {/* Camera Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4 z-20">
        {!isActive ? (
          <>
            <button
              onClick={startCamera}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Start phone camera"
            >
              📱 Phone Camera
            </button>
            <button
              onClick={() => setShowIPInput(true)}
              className="px-8 py-4 bg-purple-600 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Connect IP camera"
            >
              📡 IP Camera
            </button>
          </>
        ) : (
          <>
            <button
              onClick={stopCamera}
              className="px-8 py-4 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Stop camera"
            >
              Stop
            </button>
            {!isIPCamera && (
              <button
                onClick={switchCamera}
                className="px-8 py-4 bg-gray-700 text-white rounded-lg text-lg font-semibold hover:bg-gray-600 transition-colors min-w-[44px] min-h-[44px]"
                aria-label="Switch camera"
              >
                Switch
              </button>
            )}
          </>
        )}
      </div>

      {/* Detection Info Bar */}
      {isActive && detections.length > 0 && !collisionAlert.isActive && (
        <div className="absolute bottom-24 left-0 right-0 px-4 z-10">
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