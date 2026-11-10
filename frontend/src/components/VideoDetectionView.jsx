import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  UploadCloud, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  FileVideo, 
  RefreshCw, 
  Film,
  Layers,
  FileCheck,
  Check
} from 'lucide-react';
import { detectFrameAPI, detectVideoAPI } from '../api/client';
import { DEMO_PRESET_VIDEOS } from '../data/mockData';
import DetectionResultDashboard from './DetectionResultDashboard';

export default function VideoDetectionView({ onNavigateHistory }) {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isInteractiveScanning, setIsInteractiveScanning] = useState(false);
  const [isServerProcessing, setIsServerProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentFrameNum, setCurrentFrameNum] = useState(0);
  const [annotatedFrame, setAnnotatedFrame] = useState(null);
  const [confThreshold, setConfThreshold] = useState(0.35);
  const [analyzedFramesCount, setAnalyzedFramesCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Incident timeline bookmarks & detections
  const [incidents, setIncidents] = useState([]);
  const [currentCompliance, setCurrentCompliance] = useState(null);
  const [finalVideoResult, setFinalVideoResult] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const processTimerRef = useRef(null);
  const inFlightRef = useRef(false);

  // Handle Video Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (videoUrl) URL.revokeObjectURL(videoUrl);

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setIsInteractiveScanning(false);
    setIsServerProcessing(false);
    setProgress(0);
    setCurrentTime(0);
    setCurrentFrameNum(0);
    setIncidents([]);
    setAnnotatedFrame(null);
    setAnalyzedFramesCount(0);
    setFinalVideoResult(null);
    setErrorMsg(null);
  };

  // Load a demo video from local public assets
  const handleLoadDemoVideo = async (demo) => {
    setIsServerProcessing(true);
    setErrorMsg(null);
    try {
      const res = await fetch(demo.url);
      const blob = await res.blob();
      const file = new File([blob], `${demo.id}.mp4`, { type: 'video/mp4' });
      setVideoFile(file);
      setVideoUrl(demo.url);
      setIsInteractiveScanning(false);
      setProgress(0);
      setCurrentTime(0);
      setCurrentFrameNum(0);
      setIncidents([]);
      setAnnotatedFrame(null);
      setAnalyzedFramesCount(0);
      setFinalVideoResult(null);
    } catch (err) {
      console.error("Failed to load demo video:", err);
      setErrorMsg("Failed to load demo video.");
    } finally {
      setIsServerProcessing(false);
    }
  };

  // Video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  // 1. Full Server-Side Batch Processing (Offline Video Analysis)
  const handleServerBatchProcessing = async () => {
    if (!videoFile) return;
    setIsServerProcessing(true);
    setErrorMsg(null);

    try {
      const report = await detectVideoAPI(videoFile, 'Sector Alpha', confThreshold, 0.45, 5);
      setFinalVideoResult(report);
    } catch (err) {
      console.error("Server Video Processing Error:", err);
      setErrorMsg(err.message || "Failed to process video on server.");
    } finally {
      setIsServerProcessing(false);
    }
  };

  // 2. Interactive Browser Frame-by-Frame Scanner
  const sampleFrameAndInfer = async () => {
    if (inFlightRef.current) return;
    if (!videoRef.current || !canvasRef.current || videoRef.current.ended) {
      if (videoRef.current?.ended) {
        setIsInteractiveScanning(false);
      }
      return;
    }

    const video = videoRef.current;
    if (video.paused) return;

    const canvas = canvasRef.current;
    canvas.width = 480;
    canvas.height = 270;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Data = canvas.toDataURL('image/jpeg', 0.6);
    const timePos = video.currentTime;
    const estimatedFrame = Math.round(timePos * 25);
    setCurrentFrameNum(estimatedFrame);

    inFlightRef.current = true;
    try {
      const res = await detectFrameAPI(base64Data, confThreshold);
      if (res) {
        setAnnotatedFrame(res.annotated_frame);
        setCurrentCompliance(res.compliance);
        setAnalyzedFramesCount(prev => prev + 1);

        if (res.compliance && !res.compliance.is_site_compliant) {
          setIncidents(prev => {
            const hasRecent = prev.some(inc => Math.abs(inc.seconds - timePos) < 2.0);
            if (!hasRecent) {
              const violationItems = [];
              res.compliance.workers.forEach(w => {
                if (w.violations && w.violations.length > 0) {
                  violationItems.push(...w.violations);
                }
              });
              return [
                ...prev,
                {
                  frame: estimatedFrame,
                  seconds: timePos,
                  timestamp: formatTime(timePos),
                  violations: violationItems.length > 0 ? violationItems : ['Hazardous PPE Absence'],
                  rate: res.compliance.compliance_rate
                }
              ];
            }
            return prev;
          });
        }
      }
    } catch (err) {
      console.warn("Video frame error:", err);
    } finally {
      inFlightRef.current = false;
    }
  };

  // Interactive Play / Pause
  const toggleInteractivePlayback = () => {
    if (!videoRef.current) return;
    if (isInteractiveScanning) {
      videoRef.current.pause();
      setIsInteractiveScanning(false);
      if (processTimerRef.current) clearInterval(processTimerRef.current);
    } else {
      videoRef.current.play();
      setIsInteractiveScanning(true);
    }
  };

  // Interactive interval loop
  useEffect(() => {
    if (isInteractiveScanning) {
      processTimerRef.current = setInterval(sampleFrameAndInfer, 500); // 2 FPS inspection
    } else if (processTimerRef.current) {
      clearInterval(processTimerRef.current);
      processTimerRef.current = null;
    }
    return () => {
      if (processTimerRef.current) clearInterval(processTimerRef.current);
    };
  }, [isInteractiveScanning, confThreshold]);

  // Sync timeline progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setProgress((videoRef.current.currentTime / (duration || 1)) * 100);
    }
  };

  const handleSeek = (e) => {
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * (duration || 1);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(newProgress);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // If final server video analysis is completed, show unified results dashboard!
  if (finalVideoResult) {
    return (
      <DetectionResultDashboard
        result={finalVideoResult}
        onReset={() => {
          setFinalVideoResult(null);
          setVideoFile(null);
          setVideoUrl(null);
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
            <Film className="w-3.5 h-3.5" />
            YOLO11s Video Analysis Engine
          </div>
          <h1 className="text-2xl font-bold text-[#202A27] dark:text-[#F5F7F6]">Recorded Video Safety Audit</h1>
          <p className="text-xs text-[#78827D] mt-1">
            Analyze industrial footage using the trained YOLO11s model with frame extraction, timeline violation bookmarks, and forensic audit reporting.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] text-[#202A27] dark:text-[#F5F7F6] text-xs font-semibold hover:bg-[#EAEFEA] shadow-soft transition-all"
          >
            <UploadCloud className="w-4 h-4 text-[#78827D]" />
            <span>Select Video</span>
          </button>

          <button
            onClick={() => handleLoadDemoVideo(DEMO_PRESET_VIDEOS[0])}
            disabled={isServerProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] text-[#202A27] dark:text-[#F5F7F6] text-xs font-semibold hover:bg-[#EAEFEA] shadow-soft transition-all"
            title="Load Pre-configured Industrial Construction Video"
          >
            <Film className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />
            <span>Load Demo Video</span>
          </button>

          {videoFile && (
            <button
              onClick={handleServerBatchProcessing}
              disabled={isServerProcessing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173D35] hover:bg-[#1F4E44] dark:bg-[#2DD4BF] dark:hover:bg-[#26B8A5] text-white dark:text-[#111715] text-xs font-bold shadow-soft transition-all disabled:opacity-50"
            >
              {isServerProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Video...</span>
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" />
                  <span>Generate Full Video Audit</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#D9534F]/10 border border-[#D9534F]/30 text-[#D9534F] text-xs flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-bold underline ml-2">Dismiss</button>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Video Viewport & Playback (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-[#202A27] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl overflow-hidden aspect-video flex items-center justify-center shadow-card">
            {videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  playsInline
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsInteractiveScanning(false)}
                  className={`w-full h-full object-contain ${annotatedFrame ? 'hidden' : 'block'}`}
                />

                {annotatedFrame && (
                  <img
                    src={annotatedFrame}
                    alt="AI Annotated Frame"
                    className="w-full h-full object-contain"
                  />
                )}
              </>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="text-center p-8 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <FileVideo className="w-8 h-8 text-white/40" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">No Video File Selected</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto mb-4">
                  Drag and drop an MP4, WebM, or MOV surveillance recording to begin compliance auditing.
                </p>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white">
                  Browse Files
                </span>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* In-Video Telemetry HUD */}
            {videoUrl && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs font-mono">
                <span className={`w-2 h-2 rounded-full ${isInteractiveScanning ? 'bg-[#173D35] dark:bg-[#2DD4BF] animate-pulse' : 'bg-[#78827D]'}`}></span>
                <span>{isInteractiveScanning ? 'LIVE SCANNING' : 'PAUSED'}</span>
                <span className="text-white/40">|</span>
                <span>Frame #{currentFrameNum}</span>
                <span className="text-white/40">|</span>
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
            )}

            {/* Server Processing Overlay */}
            {isServerProcessing && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-[#B8D8C5] animate-spin" />
                <span className="text-white text-xs font-mono font-semibold">
                  Batch Processing Sequential Frames on Server...
                </span>
                <span className="text-white/70 text-[11px]">
                  Evaluating mandatory PPE rules and generating annotated video.
                </span>
              </div>
            )}
          </div>

          {/* Interactive Playback Scrubber */}
          {videoUrl && (
            <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-4 rounded-xl shadow-soft space-y-3">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full accent-[#173D35] dark:accent-[#2DD4BF] h-2 bg-[#E2E8E5] dark:bg-[#24302B] rounded-lg cursor-pointer"
                />

                {/* Violation Markers */}
                {incidents.map((inc, i) => {
                  const pct = duration > 0 ? (inc.seconds / duration) * 100 : 0;
                  return (
                    <div
                      key={i}
                      style={{ left: `${pct}%` }}
                      className="absolute -top-1 w-2 h-4 bg-[#D9534F] rounded-sm transform -translate-x-1/2 cursor-pointer shadow-sm"
                      title={`Violation at ${inc.timestamp}`}
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = inc.seconds;
                        }
                      }}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleInteractivePlayback}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#173D35] hover:bg-[#1F4E44] dark:bg-[#2DD4BF] dark:hover:bg-[#26B8A5] text-white dark:text-[#111715] font-semibold"
                  >
                    {isInteractiveScanning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isInteractiveScanning ? 'Pause' : 'Interactive Scan'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        setIncidents([]);
                        setAnalyzedFramesCount(0);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] text-[#78827D]"
                    title="Restart"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <span className="font-mono text-[#78827D]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#78827D]">Sensitivity:</span>
                  <input
                    type="range"
                    min="0.20"
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
          )}
        </div>

        {/* Audit Report & Violation Timeline (1 Column) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
            <h3 className="text-xs font-bold text-[#78827D] uppercase tracking-wider mb-3">Live Video Telemetry</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
                <span className="text-[#78827D]">Sampled Frames</span>
                <span className="font-mono font-bold text-[#202A27] dark:text-[#F5F7F6]">{analyzedFramesCount}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
                <span className="text-[#78827D]">Flagged Violations</span>
                <span className={`font-mono font-bold ${incidents.length > 0 ? 'text-[#D9534F]' : 'text-[#173D35] dark:text-[#2DD4BF]'}`}>
                  {incidents.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
                <span className="text-[#78827D]">Active Workers</span>
                <span className="font-mono font-bold text-[#202A27] dark:text-[#F5F7F6]">
                  {currentCompliance?.total_workers || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Demo Video Gallery Card */}
          <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
            <h3 className="text-xs font-bold text-[#78827D] uppercase tracking-wider mb-2">
              Demo Video Gallery [DEMO]
            </h3>
            <p className="text-xs text-[#78827D] mb-3">
              Load verified industrial worksite clips to test real YOLO inference:
            </p>
            <div className="space-y-2">
              {DEMO_PRESET_VIDEOS.map((demo) => (
                <div
                  key={demo.id}
                  onClick={() => handleLoadDemoVideo(demo)}
                  className="p-3 rounded-xl border border-[#E2E8E5] dark:border-[#24302B] bg-[#F5F7F6] dark:bg-[#141C19] hover:bg-[#EAEFEA] cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-xs text-[#202A27] dark:text-[#F5F7F6]">
                      {demo.title}
                    </div>
                    <div className="text-[10px] text-[#78827D] mt-0.5">
                      {demo.duration} &bull; {demo.resolution}
                    </div>
                  </div>
                  <button className="px-2.5 py-1 rounded-lg bg-[#173D35] dark:bg-[#2DD4BF] text-white dark:text-[#111715] text-[10px] font-bold">
                    Load
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Incident Log */}
          <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#78827D] uppercase tracking-wider">Hazard Timeline Bookmarks</h3>
              <span className="text-[10px] text-[#78827D] font-mono">{incidents.length} logged</span>
            </div>

            {incidents.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {incidents.map((inc, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = inc.seconds;
                      }
                    }}
                    className="p-2.5 rounded-xl border border-[#E2E8E5] dark:border-[#24302B] bg-[#F5F7F6] dark:bg-[#141C19] hover:bg-[#EAEFEA] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-[#D9534F] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {inc.timestamp} (Frame #{inc.frame})
                      </span>
                    </div>
                    <div className="text-[11px] text-[#78827D]">
                      Missing: {inc.violations.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#78827D]">
                <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#173D35] dark:text-[#2DD4BF]" />
                <p>No safety violations detected along the timeline.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
