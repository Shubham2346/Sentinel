import { useState, useEffect } from 'react';
// import { CameraView } from './components/Camera/CameraView';
// import { CameraControls } from './components/Camera/CameraControls';
import { ObjectOverlay } from './components/Detection/ObjectOverlay';
import { VoiceInput } from './components/Voice/VoiceInput';
import { CollisionAlert } from './components/Collision/CollisionAlert';
import { RegionOverlay } from './components/Collision/RegionOverlay';
import { useCamera } from './hooks/useCamera';
import { useObjectDetection } from './hooks/useObjectDetection';
import { useCollisionDetection } from './hooks/useCollisionDetection';
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
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 flex flex-col">
      {/* Background Gradient & Animated Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
      </div>

      {/* Floating Header */}
      <header className="absolute top-4 left-4 right-4 z-20">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl transition-all duration-300">
          <div>
            <h1 className="text-white text-2xl font-bold font-display tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Project Sentinel
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {!isModelLoaded ? (
                <span className="flex items-center gap-2 text-yellow-400 text-xs font-medium tracking-wide update-pulse">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                  INITIALIZING AI CORE...
                </span>
              ) : (
                <span className="flex items-center gap-2 text-emerald-400 text-xs font-medium tracking-wide">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  SYSTEM ONLINE
                </span>
              )}
            </div>
            {isIPCamera && (
              <div className="mt-1 flex items-center gap-1 text-blue-300 text-xs font-medium">
                <span className="animate-pulse">📡</span> {ipCameraUrl}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center justify-center p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg group"
            aria-label="Settings"
          >
            <span className="text-xl group-hover:rotate-45 transition-transform duration-500">⚙️</span>
          </button>
        </div>
      </header>

      {/* Glassmorphic Settings Panel */}
      {showSettings && (
        <div className="absolute top-24 right-4 z-30 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 w-80 max-h-[80vh] overflow-y-auto transform transition-all animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold mb-6 text-white font-display flex items-center gap-2">
            <span className="text-blue-400">⚡</span> Configuration
          </h2>
          
          <div className="space-y-5">
            <label className="flex items-center justify-between group cursor-pointer">
              <span className="text-slate-300 font-medium group-hover:text-white transition-colors">Text-to-Speech</span>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enableTTS ? 'bg-blue-500' : 'bg-slate-700'}`}>
                <input
                  type="checkbox"
                  checked={enableTTS}
                  onChange={(e) => setEnableTTS(e.target.checked)}
                  className="sr-only"
                />
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enableTTS ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </label>

            <label className="flex items-center justify-between group cursor-pointer">
              <span className="text-slate-300 font-medium group-hover:text-white transition-colors">Haptic Feedback</span>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enableHaptics ? 'bg-purple-500' : 'bg-slate-700'}`}>
                <input
                  type="checkbox"
                  checked={enableHaptics}
                  onChange={(e) => setEnableHaptics(e.target.checked)}
                  className="sr-only"
                />
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enableHaptics ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </label>

            <div className="pt-5 border-t border-white/10 space-y-3">
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-sm font-medium text-slate-400">Sensor Array</span>
                <span className={`text-sm font-bold ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isActive ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-sm font-medium text-slate-400">Active Targets</span>
                <span className="text-sm font-bold text-white bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-lg">{detections.length}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="mt-8 w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-blue-500/25 active:scale-95"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Modern Dialog for IP Camera */}
      {showIPInput && !isActive && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all scale-100">
            <h2 className="text-2xl font-bold text-white mb-2 font-display">
              Link Remote Stream
            </h2>
            <p className="text-slate-400 text-sm mb-6">Initialize a connection to an external camera feed.</p>
            <div className="space-y-5">
              <div>
                <input
                  type="text"
                  value={ipInput}
                  onChange={(e) => setIPInput(e.target.value)}
                  placeholder="e.g. http://192.168.1.100:8080"
                  className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                />
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-200/80 space-y-2">
                <p className="flex items-center gap-2"><span className="text-blue-400">1.</span> Open IP Webcam app</p>
                <p className="flex items-center gap-2"><span className="text-blue-400">2.</span> Start broadcasting</p>
                <p className="flex items-center gap-2"><span className="text-blue-400">3.</span> Paste localized URL above</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowIPInput(false)}
                  className="flex-1 py-3.5 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                >
                  Abort
                </button>
                <button
                  onClick={handleIPConnect}
                  className="flex-1 py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                >
                  Establish Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Camera Viewport */}
      <div className="relative w-full flex-1 z-10 flex items-center justify-center overflow-hidden">
        {isActive ? (
          <div className="relative w-full h-full p-4 pb-32">
            <div className="w-full h-full relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-black/50 group">
              {isIPCamera ? (
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain blur-[1px] group-hover:blur-0 transition-all duration-700"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100" // Mirrors local camera logic naturally for UI, though may affect bbox without explicit handling.
                />
              )}

              {/* Advanced HUD Overlay Grid */}
              <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay">
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                
                {/* HUD Crosshairs */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
                     <div className="w-1 h-1 bg-white/40 rounded-full" />
                   </div>
                </div>
              </div>

              {/* Collision Alert Overlays */}
              {collisionAlert.isActive && collisionAlert.zone && (
                <>
                  <RegionOverlay 
                    zone={collisionAlert.zone} 
                    videoWidth={videoWidth}
                    videoHeight={isIPCamera ? canvasRef.current?.height || 0 : videoRef.current?.videoHeight || 0}
                  />
                  <div className="absolute inset-0 ring-4 ring-red-500/50 rounded-3xl pointer-events-none animate-pulse" />
                  <CollisionAlert zone={collisionAlert.zone} />
                </>
              )}

              {/* Object Detections */}
              {isModelLoaded && (
                <ObjectOverlay 
                  detections={detections} 
                  sourceRef={isIPCamera ? canvasRef : videoRef}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-6 opacity-60">
            <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-4xl animate-pulse">
              👁️
            </div>
            <p className="text-xl font-display text-slate-400 tracking-wider">AWAITING SENSOR ACTIVATION</p>
          </div>
        )}
      </div>

      {/* Bottom Floating Targets Bar */}
      {isActive && detections.length > 0 && !collisionAlert.isActive && (
        <div className="absolute bottom-32 left-0 right-0 px-8 z-20 pointer-events-none">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-wrap items-end justify-center gap-2">
              {detections.slice(0, 4).map((det, idx) => (
                <div key={idx} className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex flex-col items-center shadow-xl animate-in slide-in-from-bottom-4 fade-in">
                  <span className="text-xs uppercase tracking-widest text-blue-300 font-bold">{det.class}</span>
                  <span className="text-lg font-display text-white">{det.distance}m</span>
                </div>
              ))}
              {detections.length > 4 && (
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center justify-center border border-white/5">
                  <span className="text-sm font-medium text-slate-400">+{detections.length - 4} MORE</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Intelligent Voice Input */}
      {isActive && !isIPCamera && (
        <div className="absolute top-24 left-4 z-20">
          <VoiceInput videoRef={videoRef} />
        </div>
      )}

      {/* Main Control Dock */}
      <div className="absolute bottom-8 left-4 right-4 flex justify-center z-30">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-2 flex gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {!isActive ? (
            <>
              <button
                onClick={startCamera}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-base font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:scale-105 transition-all duration-300 active:scale-95 flex items-center gap-3"
              >
                <span className="text-xl">📱</span> Initialize Local
              </button>
              <button
                onClick={() => setShowIPInput(true)}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/5 text-white rounded-full text-base font-semibold tracking-wide hover:shadow-lg transition-all duration-300 active:scale-95 flex items-center gap-3"
              >
                <span className="text-xl">📡</span> Remote Feed
              </button>
            </>
          ) : (
            <>
              <button
                onClick={stopCamera}
                className="px-8 py-4 bg-red-500/20 border border-red-500/50 text-red-100 rounded-full text-base font-semibold tracking-wide hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all duration-300 active:scale-95 flex items-center gap-3"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                Halt Systems
              </button>
              {!isIPCamera && (
                <button
                  onClick={switchCamera}
                  className="w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 shadow-lg group hover:rotate-180"
                  aria-label="Toggle camera"
                >
                  <svg className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;