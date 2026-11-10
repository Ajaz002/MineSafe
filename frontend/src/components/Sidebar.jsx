import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ScanEye, 
  Camera, 
  Video, 
  BarChart3, 
  History, 
  FileText, 
  Sliders, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Info,
  ExternalLink,
  Mail,
  X
} from 'lucide-react';

export default function Sidebar({ 
  currentView, 
  setCurrentView, 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen, 
  setIsMobileOpen 
}) {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'image-detect', label: 'AI Image Detection', icon: ScanEye, badge: 'PROD' },
    { id: 'video-detect', label: 'Video Detection', icon: Video, badge: 'AUDIT' },
    { id: 'webcam', label: 'Live Webcam Detection', icon: Camera, badge: 'LIVE' },
    { id: 'analytics', label: 'PPE Analytics', icon: BarChart3 },
    { id: 'history', label: 'Detection History', icon: History },
    { id: 'reports', label: 'Compliance Reports', icon: FileText },
    { id: 'settings', label: 'Advanced Settings', icon: Sliders },
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      <aside 
        className={`fixed top-14 left-0 bottom-0 z-40 bg-white dark:bg-[#141C19] border-r border-[#E2E8E5] dark:border-[#24302B] transition-all duration-300 flex flex-col justify-between select-none ${
          isMobileOpen 
            ? 'translate-x-0 w-64 shadow-2xl' 
            : 'max-md:-translate-x-full'
        } ${
          isCollapsed ? 'md:w-18' : 'md:w-64'
        }`}
      >
        {/* Navigation Links */}
        <div className="py-4 px-3 space-y-1 overflow-y-auto">
          <div className="flex items-center justify-between px-2 mb-2">
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-[11px] font-bold text-[#78827D] uppercase tracking-wider font-mono">
                SAFETY MANAGEMENT
              </span>
            )}
            
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1 rounded-md text-[#78827D] hover:text-[#202A27] hover:bg-[#F5F7F6] dark:hover:bg-[#19221F] dark:hover:text-[#F5F7F6] transition-colors ml-auto"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1 rounded-md text-[#78827D] hover:text-[#202A27] ml-auto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#173D35] text-white dark:bg-[#2DD4BF] dark:text-[#111715] shadow-sm font-semibold'
                      : 'text-[#78827D] hover:text-[#202A27] dark:hover:text-[#F5F7F6] hover:bg-[#F5F7F6] dark:hover:bg-[#19221F]'
                  }`}
                  title={isCollapsed && !isMobileOpen ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white dark:text-[#111715]' : 'text-[#78827D]'}`} />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {(!isCollapsed || isMobileOpen) && item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide font-mono ${
                      isActive 
                        ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[#111715]' 
                        : 'bg-[#B8D8C5]/40 text-[#173D35] dark:bg-[#213B32] dark:text-[#2DD4BF]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Enterprise AI Engine Status (Zero Personal Specs) */}
        {(!isCollapsed || isMobileOpen) ? (
          <div className="p-3 m-3 rounded-2xl bg-[#F5F7F6] dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#78827D] uppercase tracking-wider font-mono">VISION ENGINE</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#173D35] dark:text-[#2DD4BF] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#173D35] dark:bg-[#2DD4BF] animate-pulse"></span>
                ONLINE
              </span>
            </div>
            <div className="text-xs font-mono font-semibold text-[#202A27] dark:text-[#F5F7F6] truncate">
              YOLO11s-Production
            </div>
            <div className="text-[10px] text-[#78827D] mt-0.5 truncate">
              13 Classes &bull; 85.8% Precision
            </div>
          </div>
        ) : (
          <div className="p-3 flex justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#173D35] dark:bg-[#2DD4BF]" title="AI Engine Active"></div>
          </div>
        )}

        {/* About & Project Credits Button */}
        <div className="px-3 pb-3">
          <button
            onClick={() => setShowAboutModal(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium text-[#78827D] hover:text-[#202A27] dark:hover:text-[#F5F7F6] hover:bg-[#F5F7F6] dark:hover:bg-[#19221F] transition-all"
            title="About MineSafe & Project Information"
          >
            <Info className="w-3.5 h-3.5 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>About & Credits</span>}
          </button>
        </div>
      </aside>

      {/* About & Project Information Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E5] dark:border-[#24302B]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#173D35] text-white dark:bg-[#2DD4BF] dark:text-[#111715]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#202A27] dark:text-[#F5F7F6]">About MineSafe</h3>
                  <span className="text-[10px] text-[#78827D] font-mono">INDUSTRIAL AI SAFETY SYSTEM</span>
                </div>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="p-1.5 rounded-lg text-[#78827D] hover:text-[#202A27] hover:bg-[#F5F7F6] dark:hover:bg-[#141C19] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#78827D] leading-relaxed">
              MineSafe is an enterprise deep learning system for automated Personal Protective Equipment (PPE) detection, hazard identification, and OSHA/MSHA safety compliance monitoring across mining and construction environments.
            </p>

            <div className="p-3.5 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] space-y-2 text-xs">
              <div className="font-semibold text-[#202A27] dark:text-[#F5F7F6]">Project Specifications</div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#78827D]">
                <div>Model: <span className="font-mono text-[#202A27] dark:text-[#F5F7F6]">YOLO11s-Production</span></div>
                <div>Ontology: <span className="font-mono text-[#202A27] dark:text-[#F5F7F6]">13 Classes</span></div>
                <div>Framework: <span className="font-mono text-[#202A27] dark:text-[#F5F7F6]">PyTorch & Ultralytics</span></div>
                <div>Backend: <span className="font-mono text-[#202A27] dark:text-[#F5F7F6]">FastAPI & SQLite</span></div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#B8D8C5]/20 dark:bg-[#213B32] border border-[#B8D8C5]/60 dark:border-[#2DD4BF]/30 space-y-2 text-xs">
              <div className="font-semibold text-[#173D35] dark:text-[#2DD4BF]">Developer Information & Project Credits</div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#78827D]">Lead Developer:</span>
                  <span className="font-semibold text-[#202A27] dark:text-[#F5F7F6]">Ajaz</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#78827D]">GitHub Profile:</span>
                  <a
                    href="https://github.com/Ajaz002"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#173D35] dark:text-[#2DD4BF] font-semibold hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>github.com/Ajaz002</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#78827D]">Contact Email:</span>
                  <a
                    href="mailto:ajaz90450@gmail.com"
                    className="text-[#173D35] dark:text-[#2DD4BF] font-semibold hover:underline flex items-center gap-1 font-mono"
                  >
                    <Mail className="w-3 h-3" />
                    <span>ajaz90450@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-2 rounded-xl bg-[#173D35] hover:bg-[#1F4E44] dark:bg-[#2DD4BF] dark:hover:bg-[#26B8A5] text-white dark:text-[#111715] font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
