import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  CameraOff, 
  Play, 
  Square, 
  ShieldCheck, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Activity, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileCheck,
  SwitchCamera
} from 'lucide-react';
import { detectFrameAPI, saveWebcamSessionAPI } from '../api/client';
import DetectionResultDashboard from './DetectionResultDashboard';

export default function WebcamDetectionView({ onNavigateHistory }) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [fps, setFps] = useState(0);
  const [inferenceLatency, setInferenceLatency] = useState(0);
  const [confThreshold, setConfThreshold] = useState(0.35);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [lastCompliance, setLastCompliance] = useState(null);
  const [annotatedFrameUrl, setAnnotatedFrameUrl] = useState(null);
  const [selectedZone, setSelectedZone] = useState('Sector Alpha');
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment' for mobile
  
  // Session tracking statistics
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionFramesCount, setSessionFramesCount] = useState(0);
  const [sessionPeakWorkers, setSessionPeakWorkers] = useState(0);
  const [sessionViolationCount, setSessionViolationCount] = useState(0);
  const [lastSnapshotBase64, setLastSnapshotBase64] = useState(null);
  const [finalSessionReport, setFinalSessionReport] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const inFlightRef = useRef(false);

  // Play alert audio for violations
  const triggerAudioWarning = useCallback(() => {
    if (!soundAlerts) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(680, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {}
  }, [soundAlerts]);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 }, 
          facingMode: facingMode 
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsStreaming(true);
      setSessionStartTime(Date.now());
      setSessionFramesCount(0);
      setSessionPeakWorkers(0);
      setSessionViolationCount(0);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Webcam access denied or no camera device found. Please allow camera permissions in your browser.');
      setIsStreaming(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setAnnotatedFrameUrl(null);
    setFps(0);
  };

  // Stop and finalize session
  const stopAndFinalizeSession = async () => {
    stopCamera();
    const durationSeconds = sessionStartTime ? (Date.now() - sessionStartTime) / 1000 : 0;
    const isCompliant = sessionViolationCount === 0;
    const complianceRate = Math.max(0, Math.round(100 - (sessionViolationCount * 5)));

    try {
      const saveRes = await saveWebcamSessionAPI({
        zone: selectedZone,
        duration_seconds: durationSeconds,
        total_frames: sessionFramesCount,
        total_workers: sessionPeakWorkers,
        total_violations: sessionViolationCount,
        compliance_rate: complianceRate,
        is_compliant: isCompliant,
        snapshot_base64: lastSnapshotBase64
      });

      setFinalSessionReport({
        event_id: saveRes.event_id,
        detection_type: 'webcam',
        timestamp: saveRes.timestamp,
        zone: selectedZone,
        total_workers: sessionPeakWorkers,
        total_violations: sessionViolationCount,
        compliance_rate: complianceRate,
        is_compliant: isCompliant,
        annotated_image: lastSnapshotBase64 || saveRes.snapshot_url,
        inference_time_ms: Math.round(durationSeconds * 1000),
        detections: lastCompliance?.workers?.flatMap(w => w.violations.map(v => ({ class_name: v, confidence: 0.95 }))) || []
      });
    } catch (err) {
      console.warn("Failed to save webcam session:", err);
    }
  };

  // Capture frame and send to backend
  const captureAndInfer = useCallback(async () => {
    if (inFlightRef.current) return;
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;

    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = canvasRef.current;
    canvas.width = 480;
    canvas.height = 270;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Data = canvas.toDataURL('image/jpeg', 0.6);

    inFlightRef.current = true;
    try {
      const result = await detectFrameAPI(base64Data, confThreshold);
      if (result) {
        setAnnotatedFrameUrl(result.annotated_frame);
        setLastSnapshotBase64(result.annotated_frame);
        setInferenceLatency(result.inference_time_ms || 12);
        setFps(result.fps || 24);
        setLastCompliance(result.compliance);

        setSessionFramesCount(prev => prev + 1);
        if (result.compliance) {
          setSessionPeakWorkers(prev => Math.max(prev, result.compliance.total_workers));
          if (!result.compliance.is_site_compliant) {
            setSessionViolationCount(prev => prev + result.compliance.total_violations_count);
            triggerAudioWarning();
          }
        }
      }
    } catch (err) {
      console.warn('Frame detection skipped:', err);
    } finally {
      inFlightRef.current = false;
    }
  }, [isStreaming, confThreshold, triggerAudioWarning]);

  // Periodic frame inference loop
  useEffect(() => {
    if (isStreaming) {
      intervalRef.current = setInterval(captureAndInfer, 350); // ~3 FPS smooth inference
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStreaming, captureAndInfer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const isViolating = lastCompliance && !lastCompliance.is_site_compliant;

  // If final session report is ready, show unified results dashboard!
  if (finalSessionReport) {
    return (
      <DetectionResultDashboard
        result={finalSessionReport}
        onReset={() => {
          setFinalSessionReport(null);
          setLastCompliance(null);
          setAnnotatedFrameUrl(null);
        }}
        onViewHistory={onNavigateHistory}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#173D35]/10 dark:bg-[#2DD4BF]/10 text-[#173D35] dark:text-[#2DD4BF] text-[11px] font-bold tracking-wide uppercase mb-2">
            <Camera className="w-3.5 h-3.5" />
            Live Edge Vision Stream
          </div>
          <h1 className="text-2xl font-bold text-[#202A27] dark:text-[#F5F7F6]">Live Webcam Compliance Monitor</h1>
          <p className="text-xs text-[#78827D] mt-1">
            Real-time inference on laptop or mobile device cameras with instantaneous PPE violation alerts and session history recording.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!isStreaming ? (
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173D35] hover:bg-[#1F4E44] dark:bg-[#2DD4BF] dark:hover:bg-[#26B8A5] text-white dark:text-[#111715] font-bold text-xs shadow-soft transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Camera</span>
            </button>
          ) : (
            <>
              <button
                onClick={stopAndFinalizeSession}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#173D35] hover:bg-[#1F4E44] text-white font-bold text-xs shadow-soft transition-all"
              >
                <FileCheck className="w-4 h-4" />
                <span>Stop & View Audit</span>
              </button>
              <button
                onClick={stopCamera}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D9534F] hover:bg-[#C9302C] text-white font-bold text-xs shadow-soft transition-all"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop</span>
              </button>
            </>
          )}

          <button
            onClick={() => setSoundAlerts(!soundAlerts)}
            className={`p-2.5 rounded-xl border transition-colors ${
              soundAlerts 
                ? 'bg-[#B8D8C5]/30 text-[#173D35] border-[#B8D8C5] dark:bg-[#213B32] dark:text-[#2DD4BF]' 
                : 'bg-[#F5F7F6] text-[#78827D] border-[#E2E8E5] dark:bg-[#141C19]'
            }`}
            title={soundAlerts ? "Sound alerts enabled" : "Sound alerts muted"}
          >
            {soundAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Stream & Telemetry Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stream Viewport (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-[#202A27] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl overflow-hidden aspect-video flex items-center justify-center shadow-card">
            
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover ${annotatedFrameUrl ? 'hidden' : 'block'}`}
            />

            {annotatedFrameUrl && isStreaming && (
              <img
                src={annotatedFrameUrl}
                alt="Live AI Annotated Stream"
                className="w-full h-full object-cover"
              />
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* Inactive Stream Placeholder */}
            {!isStreaming && (
              <div className="text-center p-8 text-white/60">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-white/40" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">Webcam Inactive</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto mb-5">
                  Click "Start Camera" to grant browser permissions and begin real-time compliance detection.
                </p>
                <button
                  onClick={startCamera}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173D35] hover:bg-[#1F4E44] text-white text-xs font-semibold shadow-soft"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Activate Camera</span>
                </button>
              </div>
            )}

            {/* Camera Error Message */}
            {cameraError && (
              <div className="absolute inset-4 flex items-center justify-center bg-black/85 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="max-w-md">
                  <AlertTriangle className="w-8 h-8 text-[#D9534F] mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white mb-1">Camera Permission Required</h4>
                  <p className="text-xs text-white/70 mb-4">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-medium"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            )}

            {/* Active Live Stream HUD */}
            {isStreaming && (
              <>
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#D9534F] animate-pulse"></span>
                  <span className="font-bold">LIVE FEED</span>
                  <span className="text-white/40">|</span>
                  <span>{selectedZone}</span>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs font-mono">
                  <Activity className="w-3.5 h-3.5 text-[#B8D8C5]" />
                  <span>{inferenceLatency} ms</span>
                  <span className="text-white/40">|</span>
                  <span>{fps} FPS</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-white text-xs">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold ${
                    isViolating ? 'bg-[#D9534F] text-white animate-pulse' : 'bg-[#173D35] text-white'
                  }`}>
                    {isViolating ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>{isViolating ? 'SAFETY VIOLATION' : 'COMPLIANT'}</span>
                  </div>

                  <span className="text-white/80 font-mono text-xs">
                    Frames Scanned: {sessionFramesCount}
                  </span>
                </div>
              </>
            )}

          </div>

          {/* Quick Settings Bar */}
          <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-4 rounded-xl shadow-soft flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[#78827D]">Zone:</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] px-3 py-1.5 rounded-lg font-semibold text-[#202A27] dark:text-[#F5F7F6] focus:outline-none"
              >
                <option value="Sector Alpha">Sector Alpha — Main Haulage</option>
                <option value="Underground Shaft B4">Underground Shaft B4</option>
                <option value="Processing Pit">Processing Pit</option>
                <option value="Workshop Deck">Workshop Deck</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[#78827D]">Confidence:</span>
                <input
                  type="range"
                  min="0.15"
                  max="0.80"
                  step="0.05"
                  value={confThreshold}
                  onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
                  className="w-20 accent-[#173D35] dark:accent-[#2DD4BF]"
                />
                <span className="font-mono font-semibold text-[#202A27] dark:text-[#F5F7F6]">
                  {Math.round(confThreshold * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Session Telemetry (1 Column) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
            <h3 className="text-xs font-bold text-[#78827D] uppercase tracking-wider mb-3">Live Telemetry Summary</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
                <span className="text-xs text-[#78827D]">Compliance Rate</span>
                <span className={`text-base font-bold font-mono ${
                  lastCompliance?.compliance_rate >= 90 ? 'text-[#173D35] dark:text-[#2DD4BF]' :
                  lastCompliance?.compliance_rate >= 70 ? 'text-[#E6A23C]' : 'text-[#D9534F]'
                }`}>
                  {lastCompliance ? `${lastCompliance.compliance_rate}%` : '100%'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
                <span className="text-xs text-[#78827D]">Workers Detected</span>
                <span className="text-base font-bold font-mono text-[#202A27] dark:text-[#F5F7F6]">
                  {lastCompliance ? lastCompliance.total_workers : 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
                <span className="text-xs text-[#78827D]">Violations Logged</span>
                <span className={`text-base font-bold font-mono ${
                  sessionViolationCount > 0 ? 'text-[#D9534F]' : 'text-[#173D35] dark:text-[#2DD4BF]'
                }`}>
                  {sessionViolationCount}
                </span>
              </div>
            </div>
          </div>

          {/* Real-Time Worker Checklist */}
          <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
            <h3 className="text-xs font-bold text-[#78827D] uppercase tracking-wider mb-3">Live Equipment Audit</h3>

            {lastCompliance && lastCompliance.workers && lastCompliance.workers.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {lastCompliance.workers.map((w, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-[#E2E8E5] dark:border-[#24302B] bg-[#F5F7F6] dark:bg-[#141C19] text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#202A27] dark:text-[#F5F7F6] font-mono">{w.worker_id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        w.is_compliant ? 'bg-[#B8D8C5]/30 text-[#173D35]' : 'bg-[#D9534F]/10 text-[#D9534F]'
                      }`}>
                        {w.is_compliant ? 'Compliant' : 'Violation'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px] text-[#78827D]">
                      <span>Helmet: <strong className={w.equipment.has_helmet ? 'text-[#173D35]' : 'text-[#D9534F]'}>{w.equipment.has_helmet ? 'Yes' : 'No'}</strong></span>
                      <span>Vest: <strong className={w.equipment.has_vest ? 'text-[#173D35]' : 'text-[#D9534F]'}>{w.equipment.has_vest ? 'Yes' : 'No'}</strong></span>
                      <span>Boots: <strong className={w.equipment.has_boots ? 'text-[#173D35]' : 'text-[#D9534F]'}>{w.equipment.has_boots ? 'Yes' : 'No'}</strong></span>
                      <span>Gloves: <strong className={w.equipment.has_gloves ? 'text-[#173D35]' : 'text-[#D9534F]'}>{w.equipment.has_gloves ? 'Yes' : 'No'}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#78827D]">
                No personnel currently in camera frame.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
