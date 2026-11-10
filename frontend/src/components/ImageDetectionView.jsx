import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Scan, 
  AlertTriangle, 
  ShieldCheck, 
  Download, 
  SlidersHorizontal, 
  RefreshCw, 
  Eye, 
  CheckCircle2, 
  XCircle,
  FileImage,
  Layers,
  ArrowRight
} from 'lucide-react';
import { detectImageAPI } from '../api/client';
import { DEMO_PRESET_IMAGES } from '../data/mockData';
import DetectionResultDashboard from './DetectionResultDashboard';

export default function ImageDetectionView({ onNavigateHistory }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [annotatedResult, setAnnotatedResult] = useState(null);
  const [isInferencing, setIsInferencing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Detection controls
  const [confThreshold, setConfThreshold] = useState(0.35);
  const [iouThreshold, setIouThreshold] = useState(0.45);
  const [selectedZone, setSelectedZone] = useState('Sector Alpha');

  // Demo presets state
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeDemoPreset, setActiveDemoPreset] = useState(null);

  const fileInputRef = useRef(null);

  // Handle custom file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnnotatedResult(null);
    setErrorMsg(null);
    setIsDemoMode(false);
    setActiveDemoPreset(null);
  };

  // Convert preset scene to real file and run inference
  const analyzePresetThroughModel = async (preset) => {
    setIsInferencing(true);
    setErrorMsg(null);
    try {
      // Fetch image from URL and convert to blob
      const res = await fetch(preset.url);
      const blob = await res.blob();
      const file = new File([blob], `${preset.id}.jpg`, { type: 'image/jpeg' });
      const result = await detectImageAPI(file, selectedZone, confThreshold, iouThreshold);
      setAnnotatedResult(result);
      setIsDemoMode(false);
    } catch (err) {
      console.error("Preset inference error:", err);
      setErrorMsg(err.message || "Backend inference call failed.");
    } finally {
      setIsInferencing(false);
    }
  };

  // Run Real YOLO Inference via Backend
  const runDetection = async () => {
    if (!selectedFile && !activeDemoPreset) {
      setErrorMsg("Please select or upload an image first.");
      return;
    }

    if (!selectedFile && activeDemoPreset) {
      return analyzePresetThroughModel(activeDemoPreset);
    }

    setIsInferencing(true);
    setErrorMsg(null);

    try {
      const result = await detectImageAPI(selectedFile, selectedZone, confThreshold, iouThreshold);
      setAnnotatedResult(result);
      setIsDemoMode(false);
    } catch (err) {
      console.error("Inference Error:", err);
      setErrorMsg(err.message || "Backend inference call failed. Ensure the MineSafe FastAPI backend server is online.");
    } finally {
      setIsInferencing(false);
    }
  };

  // If results are available, show the unified results dashboard!
  if (annotatedResult) {
    return (
      <DetectionResultDashboard
        result={annotatedResult}
        onReset={() => {
          setAnnotatedResult(null);
          setSelectedFile(null);
          setPreviewUrl(null);
          setActiveDemoPreset(null);
        }}
        onViewHistory={onNavigateHistory}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-6 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#173D35]/10 dark:bg-[#2DD4BF]/10 text-[#173D35] dark:text-[#2DD4BF] text-[11px] font-bold tracking-wide uppercase mb-2">
            <Scan className="w-3.5 h-3.5" />
            YOLO11s Inference Workspace
          </div>
          <h1 className="text-2xl font-bold text-[#202A27] dark:text-[#F5F7F6]">PPE Image Inspection Studio</h1>
          <p className="text-xs text-[#78827D] mt-1">
            Upload photographic evidence to detect workers, analyze protective gear adherence, and record forensic compliance audits.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg,image/png,image/webp,image/avif" 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] text-[#202A27] dark:text-[#F5F7F6] hover:bg-[#EAEFEA] text-xs font-semibold shadow-soft transition-all"
          >
            <UploadCloud className="w-4 h-4 text-[#78827D]" />
            <span>Select Image</span>
          </button>

          <button
            onClick={runDetection}
            disabled={(!selectedFile && !activeDemoPreset) || isInferencing}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs shadow-soft transition-all ${
              (!selectedFile && !activeDemoPreset) || isInferencing
                ? 'bg-[#E2E8E5] dark:bg-[#24302B] text-[#78827D] cursor-not-allowed'
                : 'bg-[#173D35] hover:bg-[#1F4E44] dark:bg-[#2DD4BF] dark:hover:bg-[#26B8A5] text-white dark:text-[#111715] active:scale-95'
            }`}
          >
            {isInferencing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Inference...</span>
              </>
            ) : (
              <>
                <Scan className="w-4 h-4" />
                <span>Analyze with YOLO</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#D9534F]/10 border border-[#D9534F]/30 text-[#D9534F] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button 
            onClick={() => setErrorMsg(null)}
            className="text-xs font-bold hover:underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Viewport & Image Canvas (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-[#202A27] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl overflow-hidden aspect-video flex items-center justify-center shadow-card">
            
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected Sample"
                className="w-full h-full object-contain"
              />
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="text-center p-8 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <FileImage className="w-8 h-8 text-white/40" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">No Image Loaded</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto mb-4">
                  Drag and drop a JPG, PNG, WEBP or AVIF file, or select a sample scene below.
                </p>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white">
                  Browse Files
                </span>
              </div>
            )}

            {/* In-Progress Overlay */}
            {isInferencing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-[#B8D8C5] animate-spin" />
                <span className="text-white text-xs font-mono font-semibold">
                  Executing YOLO11s Neural Forward Pass...
                </span>
              </div>
            )}

          </div>

          {/* Model Inference Controls */}
          <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-4 rounded-xl shadow-soft flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[#78827D] font-medium">Monitored Zone:</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] px-3 py-1.5 rounded-lg font-semibold text-[#202A27] dark:text-[#F5F7F6] focus:outline-none"
              >
                <option value="Sector Alpha">Sector Alpha — Main Haulage</option>
                <option value="Underground Shaft B4">Underground Shaft B4</option>
                <option value="Processing Bay 2">Processing Bay 2</option>
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

        {/* Preset Sample Scenes (1 Column) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#78827D] uppercase tracking-wider">
                Industrial Sample Scenes [DEMO]
              </h3>
            </div>
            <p className="text-xs text-[#78827D] mb-4">
              Select a pre-configured scenario to test model performance:
            </p>

            <div className="space-y-3">
              {DEMO_PRESET_IMAGES.map((preset) => {
                const isSelected = activeDemoPreset?.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(preset.url);
                      setActiveDemoPreset(preset);
                      setAnnotatedResult(null);
                      setErrorMsg(null);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'border-[#173D35] bg-[#B8D8C5]/20 dark:border-[#2DD4BF] dark:bg-[#213B32]'
                        : 'border-[#E2E8E5] dark:border-[#24302B] bg-[#F5F7F6] dark:bg-[#141C19] hover:bg-[#EAEFEA]'
                    }`}
                  >
                    <img 
                      src={preset.url} 
                      alt={preset.title} 
                      className="w-14 h-14 rounded-lg object-cover shrink-0" 
                    />
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                          preset.category.includes('Violation') 
                            ? 'bg-[#D9534F]/15 text-[#D9534F]'
                            : preset.category.includes('Zero')
                            ? 'bg-[#78827D]/20 text-[#78827D]'
                            : 'bg-[#B8D8C5]/40 text-[#173D35] dark:bg-[#213B32] dark:text-[#2DD4BF]'
                        }`}>
                          {preset.category}
                        </span>
                      </div>
                      <div className="font-semibold text-xs text-[#202A27] dark:text-[#F5F7F6] truncate">
                        {preset.title}
                      </div>
                      <div className="text-[11px] text-[#78827D] line-clamp-1 mt-0.5">
                        {preset.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8E5] dark:border-[#24302B]">
              <button
                onClick={runDetection}
                disabled={(!selectedFile && !activeDemoPreset) || isInferencing}
                className="w-full py-2.5 rounded-xl bg-[#173D35] hover:bg-[#1F4E44] dark:bg-[#2DD4BF] dark:hover:bg-[#26B8A5] text-white dark:text-[#111715] font-bold text-xs shadow-soft transition-all disabled:opacity-50"
              >
                Analyze Selected Scene
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
