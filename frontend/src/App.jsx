import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import ImageDetectionView from './components/ImageDetectionView';
import VideoDetectionView from './components/VideoDetectionView';
import WebcamDetectionView from './components/WebcamDetectionView';
import AnalyticsView from './components/AnalyticsView';
import HistoryView from './components/HistoryView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import { fetchSystemHealthAPI } from './api/client';

export default function App() {
  const [isLanding, setIsLanding] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('minesafe_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });
  const [backendHealth, setBackendHealth] = useState(null);

  // Sync dark class with document root and persist
  useEffect(() => {
    try {
      localStorage.setItem('minesafe_theme', isDark ? 'dark' : 'light');
    } catch {}
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Periodic health check
  useEffect(() => {
    fetchSystemHealthAPI().then(data => {
      if (data) setBackendHealth(data);
    });
    const interval = setInterval(() => {
      fetchSystemHealthAPI().then(data => {
        if (data) setBackendHealth(data);
      });
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7F6] dark:bg-[#111715] text-[#202A27] dark:text-[#F5F7F6] flex flex-col transition-colors duration-200 overflow-x-hidden selection:bg-[#B8D8C5] selection:text-[#173D35]">
      
      {/* Top Application Header */}
      <Navbar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        isDark={isDark}
        setIsDark={setIsDark}
        isLanding={isLanding}
        setIsLanding={setIsLanding}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      {isLanding ? (
        <main className="flex-1">
          <LandingPage 
            onLaunchWorkspace={() => {
              setIsLanding(false);
              setCurrentView('image-detect');
            }}
            onExploreDashboard={() => {
              setIsLanding(false);
              setCurrentView('dashboard');
            }}
          />
        </main>
      ) : (
        <div className="flex-1 flex">
          
          {/* Collapsible Left Sidebar */}
          <Sidebar 
            currentView={currentView}
            setCurrentView={setCurrentView}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />

          {/* Dynamic Platform Viewport (Zero Overflow, Responsive Margin) */}
          <main 
            className={`flex-1 transition-all duration-300 min-h-[calc(100vh-3.5rem)] pb-12 overflow-x-hidden ml-0 ${
              isSidebarCollapsed ? 'md:ml-18' : 'md:ml-64'
            }`}
          >
            {/* System Transparency Banner (No personal specs) */}
            <div className="bg-white/80 dark:bg-[#141C19]/80 border-b border-[#E2E8E5] dark:border-[#24302B] px-4 lg:px-8 py-2 flex items-center justify-between text-[11px] text-[#78827D]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#173D35] dark:bg-[#2DD4BF] animate-pulse"></span>
                <span>Active Engine: <strong className="text-[#202A27] dark:text-[#F5F7F6]">MineSafe Industrial Vision Platform</strong></span>
              </div>
              <div className="hidden sm:flex items-center gap-3 font-mono text-[10px]">
                <span>13 CLASSES ONTOLOGY</span>
                <span className="text-[#E2E8E5] dark:text-[#24302B]">|</span>
                <span className="text-[#173D35] dark:text-[#2DD4BF]">
                  CHECKPOINT: YOLO11s (PRODUCTION)
                </span>
              </div>
            </div>

            {/* View Switching */}
            <div className="animate-fade-in">
              {currentView === 'dashboard' && (
                <DashboardView onNavigate={(view) => setCurrentView(view)} />
              )}

              {currentView === 'image-detect' && (
                <ImageDetectionView onNavigateHistory={() => setCurrentView('history')} />
              )}

              {currentView === 'video-detect' && (
                <VideoDetectionView onNavigateHistory={() => setCurrentView('history')} />
              )}

              {currentView === 'webcam' && (
                <WebcamDetectionView onNavigateHistory={() => setCurrentView('history')} />
              )}

              {currentView === 'analytics' && (
                <AnalyticsView />
              )}

              {currentView === 'history' && (
                <HistoryView />
              )}

              {currentView === 'reports' && (
                <ReportsView />
              )}

              {currentView === 'settings' && (
                <SettingsView />
              )}
            </div>

          </main>
        </div>
      )}

    </div>
  );
}
