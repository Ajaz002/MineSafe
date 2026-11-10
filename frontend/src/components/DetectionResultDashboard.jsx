import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle,
  Download, 
  RotateCcw, 
  FileText, 
  Clock, 
  MapPin, 
  UserCheck, 
  Users, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  HardHat, 
  Shirt, 
  Glasses, 
  Footprints, 
  Hand, 
  ShieldAlert,
  ArrowRight,
  Eye,
  FileCheck
} from 'lucide-react';

export default function DetectionResultDashboard({ result, onReset, onViewHistory }) {
  const [viewMode, setViewMode] = useState('annotated'); // 'annotated', 'original', 'split'

  if (!result) return null;

  const isVideo = result.detection_type === 'video';
  const isWebcam = result.detection_type === 'webcam';
  const isImage = result.detection_type === 'image' || (!isVideo && !isWebcam);

  const compliance = result.compliance || {};
  const totalWorkers = result.total_workers ?? compliance.total_workers ?? (result.detections?.filter(d => d.class_name === 'person').length || 0);
  const totalViolations = result.total_violations ?? compliance.total_violations_count ?? 0;
  const detections = result.detections || [];
  const totalDetections = result.total_detections ?? detections.length;

  // Zero workers handling: If zero workers are detected, show "Unable to calculate compliance", never 100%
  const hasZeroWorkers = totalWorkers === 0;
  const isCompliant = !hasZeroWorkers && (result.is_compliant === true || compliance.is_site_compliant === true) && totalViolations === 0;
  const isViolation = totalViolations > 0 || result.is_compliant === false || compliance.is_site_compliant === false;
  const complianceRate = hasZeroWorkers ? null : (result.compliance_rate ?? compliance.compliance_rate ?? (isCompliant ? 100 : 0));

  // Equipment detection flags
  const detectedClasses = new Set(detections.map(d => d.class_name));
  const ppeChecklist = [
    { key: 'helmet', label: 'Safety Helmet', detected: detectedClasses.has('helmet'), violation: detectedClasses.has('no_helmet'), icon: HardHat },
    { key: 'vest', label: 'Hi-Vis Vest', detected: detectedClasses.has('vest'), violation: detectedClasses.has('no_vest'), icon: Shirt },
    { key: 'boots', label: 'Steel-Toe Boots', detected: detectedClasses.has('boots'), violation: detectedClasses.has('no_boots'), icon: Footprints },
    { key: 'gloves', label: 'Safety Gloves', detected: detectedClasses.has('gloves'), violation: detectedClasses.has('no_gloves'), icon: Hand },
    { key: 'goggles', label: 'Safety Goggles', detected: detectedClasses.has('goggles'), violation: detectedClasses.has('no_goggle'), icon: Glasses },
    { key: 'mask', label: 'Dust / Respiration Mask', detected: detectedClasses.has('mask'), violation: false, icon: ShieldAlert },
  ];

  // Download annotated image or video
  const handleDownload = () => {
    const downloadUrl = result.annotated_image || result.image_url || result.annotated_video_url || result.snapshot_url;
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `minesafe_${result.event_id || 'evidence'}_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`;
    link.click();
  };

  // Export JSON Report
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `minesafe_audit_${result.event_id || 'report'}.json`;
    link.click();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-4 animate-fade-in">
      
      {/* Session Top Banner */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#173D35] text-white dark:bg-[#2DD4BF] dark:text-[#111715]">
              {isImage ? 'IMAGE AUDIT' : isVideo ? 'VIDEO AUDIT' : 'WEBCAM SESSION'}
            </span>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#F5F7F6] dark:bg-[#141C19] text-[#78827D] border border-[#E2E8E5] dark:border-[#24302B]">
              ID: {result.event_id || 'EVT-RECORDED'}
            </span>
            <span className="text-[11px] text-[#78827D] font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {result.timestamp || new Date().toLocaleString()}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#202A27] dark:text-[#F5F7F6]">
            {hasZeroWorkers 
              ? 'Unable to calculate compliance'
              : isCompliant 
              ? 'Workplace Compliance Verified' 
              : 'Safety Compliance Violation Flagged'}
          </h1>
          <p className="text-xs text-[#78827D] mt-1">
            {hasZeroWorkers ? (
              <span>Zero workers detected in the scene. PPE compliance cannot be calculated.</span>
            ) : (
              <span>Zone: <strong className="text-[#202A27] dark:text-[#F5F7F6]">{result.zone || 'Sector Alpha'}</strong> &bull; Model: <span className="font-mono text-[#173D35] dark:text-[#2DD4BF] font-semibold">{result.model_loaded || 'YOLO11s-Production'}</span></span>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#173D35] hover:bg-[#1F4E44] dark:bg-[#2DD4BF] dark:hover:bg-[#26B8A5] text-white dark:text-[#111715] text-xs font-semibold shadow-soft transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Evidence</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] text-[#202A27] dark:text-[#F5F7F6] text-xs font-semibold hover:bg-[#EAEFEA] transition-all"
          >
            <FileText className="w-4 h-4 text-[#78827D]" />
            <span>Audit JSON</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] text-[#202A27] dark:text-[#F5F7F6] text-xs font-semibold hover:bg-[#F5F7F6] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#78827D]" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* 4 Core KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Compliance Status Card */}
        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
          <span className="text-[11px] font-semibold text-[#78827D] block mb-1">Compliance Status</span>
          <div className="flex items-center gap-2">
            {hasZeroWorkers ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#78827D]/10 text-[#78827D] border border-[#78827D]/30">
                <AlertCircle className="w-4 h-4 text-[#78827D]" />
                <span>Unable to calculate compliance</span>
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                isCompliant 
                  ? 'bg-[#B8D8C5]/30 text-[#173D35] dark:bg-[#213B32] dark:text-[#2DD4BF]' 
                  : 'bg-[#D9534F]/10 text-[#D9534F]'
              }`}>
                {isCompliant ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{isCompliant ? 'COMPLIANT' : 'VIOLATION DETECTED'}</span>
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#78827D] block mt-2">
            {hasZeroWorkers
              ? 'Zero workers detected in evidence'
              : isCompliant 
              ? 'Meets mandatory site PPE rules' 
              : 'Immediate supervisory action required'}
          </span>
        </div>

        {/* Compliance Rate Card */}
        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
          <span className="text-[11px] font-semibold text-[#78827D] block mb-1">Compliance Score</span>
          {hasZeroWorkers ? (
            <div className="text-xl font-bold font-mono text-[#78827D] mt-1">
              N/A
            </div>
          ) : (
            <div className={`text-2xl font-bold font-mono ${
              complianceRate >= 90 ? 'text-[#173D35] dark:text-[#2DD4BF]' :
              complianceRate >= 75 ? 'text-[#E6A23C]' : 'text-[#D9534F]'
            }`}>
              {complianceRate}%
            </div>
          )}
          <span className="text-[10px] text-[#78827D] block mt-1">
            {hasZeroWorkers ? 'Unable to calculate compliance' : 'Target Standard: \u2265 90.0%'}
          </span>
        </div>

        {/* Workers & Objects Card */}
        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
          <span className="text-[11px] font-semibold text-[#78827D] block mb-1">Workers & Objects</span>
          <div className="text-2xl font-bold font-mono text-[#202A27] dark:text-[#F5F7F6]">
            {totalWorkers} <span className="text-xs font-normal text-[#78827D]">worker(s)</span>
          </div>
          <span className="text-[10px] text-[#78827D] block mt-1">
            {totalDetections} total PPE pieces / items located
          </span>
        </div>

        {/* Latency / Frames Card */}
        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
          <span className="text-[11px] font-semibold text-[#78827D] block mb-1">Processing Performance</span>
          <div className="text-2xl font-bold font-mono text-[#173D35] dark:text-[#2DD4BF]">
            {isVideo ? `${result.evaluated_frames || 0} frames` : `${result.inference_time_ms || 213} ms`}
          </div>
          <span className="text-[10px] text-[#78827D] block mt-1">
            {isVideo ? `Video Duration: ${result.duration_seconds || 0}s` : 'High-Speed YOLO Inference'}
          </span>
        </div>

      </div>

      {/* Main Evidence Visualizer & Detections Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Evidence Viewer (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-4 rounded-2xl shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#78827D] uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Visual Inspection Evidence
              </h3>

              {!isVideo && result.original_url && (
                <div className="flex items-center gap-1 bg-[#F5F7F6] dark:bg-[#141C19] p-1 rounded-xl border border-[#E2E8E5] dark:border-[#24302B]">
                  <button
                    onClick={() => setViewMode('annotated')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'annotated'
                        ? 'bg-[#173D35] text-white dark:bg-[#2DD4BF] dark:text-[#111715]'
                        : 'text-[#78827D] hover:text-[#202A27]'
                    }`}
                  >
                    AI Annotated
                  </button>
                  <button
                    onClick={() => setViewMode('original')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'original'
                        ? 'bg-[#173D35] text-white dark:bg-[#2DD4BF] dark:text-[#111715]'
                        : 'text-[#78827D] hover:text-[#202A27]'
                    }`}
                  >
                    Original
                  </button>
                </div>
              )}
            </div>

            {/* Media Canvas */}
            <div className="relative bg-[#202A27] dark:bg-[#141C19] rounded-xl overflow-hidden aspect-video flex items-center justify-center">
              {isVideo ? (
                <video
                  src={result.annotated_video_url || result.original_video_url}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={viewMode === 'annotated' ? (result.annotated_image || result.image_url) : result.original_url}
                  alt="Inspection Evidence"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Bottom Evidence Footnote */}
            <div className="flex items-center justify-between text-[11px] text-[#78827D] mt-3 pt-3 border-t border-[#E2E8E5] dark:border-[#24302B]">
              <span className="flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-[#173D35] dark:text-[#2DD4BF]" />
                Audit Trail Recorded in SQLite: <code className="font-mono text-[#202A27] dark:text-[#F5F7F6]">{result.event_id || 'EVT'}</code>
              </span>
              <button
                onClick={onViewHistory}
                className="text-[#173D35] dark:text-[#2DD4BF] font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Full Audit Log</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Equipment Checklist & Detections Inventory (1 Column) */}
        <div className="space-y-4">
          
          {/* PPE Adherence Grid */}
          <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
            <h3 className="text-xs font-bold text-[#78827D] uppercase tracking-wider mb-3">
              Mandatory Gear Checklist
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {ppeChecklist.map((item) => {
                const Icon = item.icon;
                const statusColor = item.violation 
                  ? 'text-[#D9534F] bg-[#D9534F]/10 border-[#D9534F]/30'
                  : item.detected 
                  ? 'text-[#173D35] dark:text-[#2DD4BF] bg-[#B8D8C5]/30 border-[#B8D8C5]'
                  : 'text-[#78827D] bg-[#F5F7F6] dark:bg-[#141C19] border-[#E2E8E5] dark:border-[#24302B]';

                return (
                  <div key={item.key} className={`p-2.5 rounded-xl border flex items-center gap-2 ${statusColor}`}>
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-[11px] truncate">{item.label}</div>
                      <div className="text-[10px] font-mono">
                        {item.violation ? 'VIOLATION' : item.detected ? 'DETECTED' : 'NOT PRESENT'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detections List */}
          <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#78827D] uppercase tracking-wider">
                Object Detections Inventory
              </h3>
              <span className="font-mono text-xs font-semibold text-[#78827D]">
                {detections.length} tagged
              </span>
            </div>

            {detections.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {detections.map((d, i) => (
                  <div 
                    key={i} 
                    className="p-2.5 rounded-xl border border-[#E2E8E5] dark:border-[#24302B] bg-[#F5F7F6] dark:bg-[#141C19] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#202A27] dark:text-[#F5F7F6] font-mono">
                        {d.class_name}
                      </span>
                      <div className="text-[10px] text-[#78827D]">
                        Box: [{Math.round(d.x1)}, {Math.round(d.y1)}, {Math.round(d.x2)}, {Math.round(d.y2)}]
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#173D35] dark:text-[#2DD4BF]">
                        {Math.round(d.confidence * 100)}%
                      </span>
                      <div className="text-[9px] text-[#78827D]">Confidence</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isVideo && result.timeline_incidents ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {result.timeline_incidents.map((inc, i) => (
                  <div key={i} className="p-2 rounded-xl bg-[#D9534F]/10 border border-[#D9534F]/20 text-xs text-[#D9534F]">
                    <div className="font-mono font-bold">{inc.timestamp} — Violation</div>
                    <div className="text-[11px]">{inc.violations.join(', ')}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#78827D]">
                No separate objects itemized.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

