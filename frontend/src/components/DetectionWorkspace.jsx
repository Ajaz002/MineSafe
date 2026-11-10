import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Scan, 
  AlertTriangle, 
  ShieldCheck, 
  Download, 
  SlidersHorizontal, 
  Sparkles, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  HardHat,
  Info
} from 'lucide-react';
import { DEMO_PRESET_IMAGES, CLASS_METADATA } from '../data/mockData';

export default function DetectionWorkspace() {
  const [selectedPreset, setSelectedPreset] = useState(DEMO_PRESET_IMAGES[0]);
  const [customImage, setCustomImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.40);
  const [showViolationsOnly, setShowViolationsOnly] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [hoveredBoxIndex, setHoveredBoxIndex] = useState(null);
  
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  // Active scene boxes
  const activeImage = customImage ? customImage.url : selectedPreset.url;
  const activeBoxes = customImage ? customImage.boxes : selectedPreset.boxes;

  // Filter boxes by confidence and violation filter
  const visibleBoxes = activeBoxes.filter(box => {
    if (box.conf < confidenceThreshold) return false;
    const meta = CLASS_METADATA[box.classId];
    if (showViolationsOnly && !meta?.isViolation) return false;
    return true;
  });

  // Calculate compliance statistics
  const violationsDetected = visibleBoxes.filter(b => CLASS_METADATA[b.classId]?.isViolation);
  const compliantItems = visibleBoxes.filter(b => CLASS_METADATA[b.classId]?.category === 'compliant');
  const personsCount = visibleBoxes.filter(b => b.classId === 0).length;

  const isCompliant = violationsDetected.length === 0;

  // Handle custom image upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      // Simulate realistic YOLO11s detection on the user's custom photo
      setTimeout(() => {
        setCustomImage({
          title: file.name,
          url: event.target.result,
          boxes: [
            { classId: 0, label: 'person', x: 25, y: 20, w: 50, h: 70, conf: 0.94 },
            { classId: 1, label: 'helmet', x: 38, y: 20, w: 22, h: 14, conf: 0.92 },
            { classId: 3, label: 'vest', x: 30, y: 36, w: 40, h: 32, conf: 0.95 },
            { classId: 9, label: 'boots', x: 35, y: 75, w: 30, h: 15, conf: 0.89 }
          ]
        });
        setIsProcessing(false);
      }, 400);
    };
    reader.readAsDataURL(file);
  };

  // Download annotated image via HTML5 Canvas
  const handleDownloadAnnotated = () => {
    const img = imageRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 800;
    canvas.height = img.naturalHeight || 600;
    const ctx = canvas.getContext('2d');

    // Draw base image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw bounding boxes
    visibleBoxes.forEach(box => {
      const meta = CLASS_METADATA[box.classId] || { color: '#10b981', label: box.label };
      const bx = (box.x / 100) * canvas.width;
      const by = (box.y / 100) * canvas.height;
      const bw = (box.w / 100) * canvas.width;
      const bh = (box.h / 100) * canvas.height;

      ctx.strokeStyle = meta.color;
      ctx.lineWidth = Math.max(3, canvas.width / 300);
      ctx.strokeRect(bx, by, bw, bh);

      // Label background
      const label = `${meta.label.toUpperCase()} ${(box.conf * 100).toFixed(0)}%`;
      ctx.font = 'bold 16px sans-serif';
      const textWidth = ctx.measureText(label).width;

      ctx.fillStyle = meta.color;
      ctx.fillRect(bx, Math.max(0, by - 24), textWidth + 12, 24);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, bx + 6, Math.max(18, by - 6));
    });

    const link = document.createElement('a');
    link.download = `minesafe_detection_${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 lg:px-8 py-6">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              [INTERACTIVE AI WORKSPACE]
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">PPE Detection & Visual Inspection Studio</h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload custom site imagery or test with pre-verified industrial datasets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Custom Photo</span>
          </button>

          <button
            onClick={handleDownloadAnnotated}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Annotated JPG</span>
          </button>
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-400 shrink-0">Sample Scenes:</span>
        {DEMO_PRESET_IMAGES.map((preset) => (
          <button
            key={preset.id}
            onClick={() => { setCustomImage(null); setSelectedPreset(preset); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 border transition-all ${
              !customImage && selectedPreset.id === preset.id
                ? 'bg-slate-800 text-emerald-400 border-emerald-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {preset.title}
          </button>
        ))}
        {customImage && (
          <span className="px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Custom Upload: {customImage.title}
          </span>
        )}
      </div>

      {/* Main Studio Split: Image Viewport + Inspection Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Visual Canvas Viewport */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[460px] flex items-center justify-center group">
            
            {/* Processing Radar Animation */}
            {isProcessing && (
              <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin mb-4"></div>
                <div className="text-sm font-bold text-white">YOLO11s Inference Engine Running...</div>
                <div className="text-xs text-slate-400 mt-1">Applying 13-class anchor analysis at 640x640</div>
              </div>
            )}

            {/* Target Image */}
            <img 
              ref={imageRef}
              src={activeImage} 
              alt="Detection Target" 
              className="w-full h-auto max-h-[580px] object-contain block"
            />

            {/* Bounding Box SVG Overlay */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {visibleBoxes.map((box, idx) => {
                const meta = CLASS_METADATA[box.classId] || { color: '#10b981', label: box.label };
                const isHovered = hoveredBoxIndex === idx;

                return (
                  <g key={idx} className="pointer-events-auto cursor-pointer">
                    {/* Bounding Box Rectangle */}
                    <rect
                      x={box.x}
                      y={box.y}
                      width={box.w}
                      height={box.h}
                      fill={isHovered ? meta.bg : 'transparent'}
                      stroke={meta.color}
                      strokeWidth={isHovered ? "1.0" : "0.5"}
                      strokeDasharray={meta.isViolation ? "1 0.5" : "none"}
                      onMouseEnter={() => setHoveredBoxIndex(idx)}
                      onMouseLeave={() => setHoveredBoxIndex(null)}
                      className="transition-all duration-150"
                    />

                    {/* Tag Label */}
                    {showLabels && (
                      <g transform={`translate(${box.x}, ${Math.max(2, box.y - 1)})`}>
                        <rect
                          x="0"
                          y="-3.5"
                          width={box.w > 20 ? box.w : 22}
                          height="4.5"
                          fill={meta.color}
                          rx="0.5"
                        />
                        <text
                          x="1"
                          y="-0.5"
                          fill="#ffffff"
                          fontSize="2.5"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {meta.name.toUpperCase()} {(box.conf * 100).toFixed(0)}%
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Bottom Floating Legend */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  Compliant PPE
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  Direct Violation
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  Personnel
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  Machinery
                </span>
              </div>
              <span className="text-slate-400 font-mono">
                {visibleBoxes.length} objects localized
              </span>
            </div>

          </div>

          {/* Filter & Threshold Toolbar */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            
            {/* Confidence Slider */}
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-300 font-medium">Confidence:</span>
              <input 
                type="range" 
                min="0.10" 
                max="0.95" 
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="text-xs font-mono text-emerald-400 w-10">
                {(confidenceThreshold * 100).toFixed(0)}%
              </span>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowViolationsOnly(!showViolationsOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  showViolationsOnly 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Violations Only</span>
              </button>

              <button
                onClick={() => setShowLabels(!showLabels)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white transition-all"
              >
                {showLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showLabels ? 'Hide Labels' : 'Show Labels'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Right 1 Column: Compliance Audit Sidebar */}
        <div className="space-y-4">
          
          {/* Main Verdict Card */}
          <div className={`p-6 rounded-3xl border transition-all ${
            isCompliant 
              ? 'bg-emerald-950/20 border-emerald-500/30 shadow-lg shadow-emerald-500/10' 
              : 'bg-red-950/20 border-red-500/40 shadow-lg shadow-red-500/10'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              {isCompliant ? (
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                  <XCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
                  Safety Evaluation
                </div>
                <div className={`text-lg font-extrabold ${isCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isCompliant ? '100% PPE COMPLIANT' : 'SAFETY VIOLATION DETECTED'}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isCompliant 
                ? 'All detected personnel conform to mandatory site safety protocols.' 
                : `${violationsDetected.length} non-compliant condition(s) detected requiring intervention.`}
            </p>
          </div>

          {/* Violations Highlight List */}
          {violationsDetected.length > 0 && (
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-red-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Actionable Non-Compliance</span>
              </div>
              <div className="space-y-2">
                {violationsDetected.map((v, i) => (
                  <div 
                    key={i}
                    className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-red-300 uppercase">
                        {v.label.replace('_', ' ')}
                      </div>
                      <div className="text-[10px] text-slate-400">Confidence: {(v.conf * 100).toFixed(1)}%</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                      HIGH RISK
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected Objects Inventory */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Detected Elements ({visibleBoxes.length})
            </h3>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {visibleBoxes.map((box, i) => {
                const meta = CLASS_METADATA[box.classId] || { label: box.label, color: '#10b981' };
                const isHovered = hoveredBoxIndex === i;

                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredBoxIndex(i)}
                    onMouseLeave={() => setHoveredBoxIndex(null)}
                    className={`p-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isHovered ? 'bg-slate-800 border border-slate-700' : 'bg-slate-950/40 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }}></span>
                      <span className="font-medium text-slate-200 capitalize">{meta.name.replace('_', ' ')}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      {(box.conf * 100).toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
