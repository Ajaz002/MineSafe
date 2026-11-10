import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Layers, 
  Activity, 
  Eye, 
  FileCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  HardHat,
  Truck,
  Scan,
  Database,
  Camera,
  Grid
} from 'lucide-react';
import { SITE_METRICS } from '../data/mockData';

export default function LandingPage({ onLaunchWorkspace, onExploreDashboard }) {
  return (
    <div className="space-y-20 py-8 px-4 sm:px-6 max-w-7xl mx-auto animate-fade-in">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-8 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173D35]/10 dark:bg-[#2DD4BF]/10 text-[#173D35] dark:text-[#2DD4BF] text-xs font-semibold mb-6 shadow-soft">
          <span className="w-2 h-2 rounded-full bg-[#173D35] dark:bg-[#2DD4BF] animate-pulse"></span>
          Industrial Vision AI 4.0 Platform &bull; YOLO11 Powered
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#202A27] dark:text-[#F5F7F6] mb-6 leading-tight">
          Intelligent PPE Detection & <br />
          <span className="text-[#173D35] dark:text-[#2DD4BF]">
            Workplace Compliance Monitoring
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#78827D] max-w-2xl mx-auto mb-8 leading-relaxed">
          MineSafe unifies multi-worker computer vision, direct negative violation tagging, 
          and heavy equipment proximity alerts on an edge-optimized YOLO architecture trained across 
          <strong className="text-[#202A27] dark:text-[#F5F7F6]"> 11,684 harmonized industrial images</strong>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onLaunchWorkspace}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#173D35] hover:bg-[#1F4E44] dark:bg-[#2DD4BF] dark:hover:bg-[#26B8A5] text-white dark:text-[#111715] font-bold text-sm shadow-soft transition-all hover:scale-102 active:scale-98"
          >
            <span>Open AI Detection Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onExploreDashboard}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-[#19221F] hover:bg-[#F5F7F6] dark:hover:bg-[#141C19] text-[#202A27] dark:text-[#F5F7F6] border border-[#E2E8E5] dark:border-[#24302B] font-semibold text-sm transition-all shadow-soft"
          >
            <span>Explore Safety Dashboard</span>
          </button>
        </div>
      </section>

      {/* 4 Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-6 rounded-2xl shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-[#B8D8C5]/30 dark:bg-[#213B32] flex items-center justify-center text-[#173D35] dark:text-[#2DD4BF] mb-4">
            <Scan className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#202A27] dark:text-[#F5F7F6] mb-1">Direct Negative Tagging</h3>
          <p className="text-xs text-[#78827D] leading-relaxed">
            Explicitly classifies missing gear (<code className="text-[#D9534F] font-mono">no_helmet</code>, <code className="text-[#D9534F] font-mono">no_vest</code>) to eliminate false negative assumptions.
          </p>
        </div>

        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-6 rounded-2xl shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-[#B8D8C5]/30 dark:bg-[#213B32] flex items-center justify-center text-[#173D35] dark:text-[#2DD4BF] mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#202A27] dark:text-[#F5F7F6] mb-1">Worker Entity Association</h3>
          <p className="text-xs text-[#78827D] leading-relaxed">
            Spatial geometric containment maps detected equipment to specific workers, evaluating per-individual compliance scores.
          </p>
        </div>

        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-6 rounded-2xl shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-[#B8D8C5]/30 dark:bg-[#213B32] flex items-center justify-center text-[#173D35] dark:text-[#2DD4BF] mb-4">
            <Camera className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#202A27] dark:text-[#F5F7F6] mb-1">Real-Time Edge Streaming</h3>
          <p className="text-xs text-[#78827D] leading-relaxed">
            Sub-second browser webcam and CCTV stream frame inference with instant audio alarms and automated turnstile lockout.
          </p>
        </div>

        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-6 rounded-2xl shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-[#B8D8C5]/30 dark:bg-[#213B32] flex items-center justify-center text-[#173D35] dark:text-[#2DD4BF] mb-4">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#202A27] dark:text-[#F5F7F6] mb-1">OSHA / MSHA Auditing</h3>
          <p className="text-xs text-[#78827D] leading-relaxed">
            Continuous forensic compliance logging, exportable CSV inspection records, and standardized printable safety audit certificates.
          </p>
        </div>
      </section>

      {/* Architecture Spec Card */}
      <section className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#78827D] uppercase tracking-wider font-mono">
            DEPLOYED MODEL ARCHITECTURE
          </span>
          <h2 className="text-2xl font-bold text-[#202A27] dark:text-[#F5F7F6] mt-1">
            YOLO11s Deep Neural Network &bull; 13 Classes
          </h2>
          <p className="text-xs text-[#78827D] mt-2 max-w-xl">
            Trained with early stopping on accelerated hardware using SGD optimizer with momentum 0.937, Cosine LR scheduling, Mosaic data augmentation, and PyTorch 2.14.
          </p>
        </div>

        <button
          onClick={onLaunchWorkspace}
          className="px-5 py-2.5 rounded-xl bg-[#173D35] hover:bg-[#1F4E44] dark:bg-[#2DD4BF] dark:hover:bg-[#26B8A5] text-white dark:text-[#111715] font-bold text-xs shadow-soft transition-all shrink-0"
        >
          Launch Visual Workspace
        </button>
      </section>

      {/* Discreet Platform Footer */}
      <footer className="pt-8 pb-4 border-t border-[#E2E8E5] dark:border-[#24302B] flex flex-col sm:flex-row items-center justify-between text-xs text-[#78827D] gap-4">
        <div>
          <span className="font-semibold text-[#202A27] dark:text-[#F5F7F6]">MineSafe Industrial AI Platform</span> &bull; Safety Compliance & PPE Monitoring
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px]">Developer Information:</span>
          <a
            href="https://github.com/Ajaz002"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#173D35] dark:text-[#2DD4BF] font-semibold hover:underline"
          >
            GitHub (@Ajaz002)
          </a>
          <span>&bull;</span>
          <a
            href="mailto:ajaz90450@gmail.com"
            className="text-[#173D35] dark:text-[#2DD4BF] font-semibold hover:underline"
          >
            ajaz90450@gmail.com
          </a>
        </div>
      </footer>

    </div>
  );
}
