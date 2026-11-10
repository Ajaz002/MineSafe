import React, { useState, useEffect } from 'react';
import { HardHat, Moon, Sun, Activity, Clock, Menu } from 'lucide-react';
import { fetchSystemHealthAPI } from '../api/client';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  isDark, 
  setIsDark, 
  isLanding, 
  setIsLanding,
  isMobileOpen,
  setIsMobileOpen
}) {
  const [currentTime, setCurrentTime] = useState('');
  const [backendHealth, setBackendHealth] = useState(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchSystemHealthAPI().then(data => {
      if (data) setBackendHealth(data);
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#141C19]/95 backdrop-blur-md border-b border-[#E2E8E5] dark:border-[#24302B] px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Left Side: Mobile Hamburger + Brand Logo */}
        <div className="flex items-center gap-3">
          
          {/* Mobile Hamburger Toggle */}
          {!isLanding && (
            <button
              onClick={() => setIsMobileOpen && setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-lg text-[#78827D] hover:text-[#202A27] hover:bg-[#F5F7F6] dark:hover:bg-[#19221F] transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Brand Logo */}
          <div 
            onClick={() => {
              if (isLanding) setIsLanding(false);
              setCurrentView('dashboard');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#173D35] dark:bg-[#2DD4BF] text-white dark:text-[#111715] shadow-sm group-hover:scale-105 transition-transform">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-[#202A27] dark:text-[#F5F7F6] font-mono">
                  Mine<span className="text-[#173D35] dark:text-[#2DD4BF]">Safe</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#B8D8C5]/30 text-[#173D35] dark:bg-[#213B32] dark:text-[#2DD4BF] border border-[#B8D8C5]/60 dark:border-[#2DD4BF]/30 hidden sm:inline-block">
                  INDUSTRIAL AI
                </span>
              </div>
              <p className="text-[11px] text-[#78827D] hidden md:block">PPE Compliance & Hazard Prevention System</p>
            </div>
          </div>

        </div>

        {/* Center / Right Status & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Landing / Dashboard Switcher */}
          <button
            onClick={() => setIsLanding(!isLanding)}
            className="px-2.5 py-1.5 rounded-lg border border-[#E2E8E5] dark:border-[#24302B] bg-[#F5F7F6] dark:bg-[#19221F] text-[#202A27] dark:text-[#F5F7F6] text-xs font-semibold hover:bg-[#EAEFEA] transition-colors"
          >
            {isLanding ? 'Platform App' : 'Landing'}
          </button>

          {/* Active Shift Clock */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F7F6] dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] text-xs font-mono text-[#202A27] dark:text-[#F5F7F6]">
            <Clock className="w-3.5 h-3.5 text-[#78827D]" />
            <span>{currentTime || '14:30:00'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#173D35]/10 dark:bg-[#2DD4BF]/10 text-[#173D35] dark:text-[#2DD4BF] font-sans font-semibold">
              SHIFT 1
            </span>
          </div>

          {/* Backend Status Pill (No personal hardware) */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F7F6] dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#173D35] dark:bg-[#2DD4BF] animate-pulse"></span>
            <span className="text-[#78827D]">Engine:</span>
            <span className="font-mono font-semibold text-[#173D35] dark:text-[#2DD4BF]">
              YOLO11s-Prod
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-[#F5F7F6] dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] text-[#202A27] dark:text-[#F5F7F6] hover:bg-[#EAEFEA] transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#FBBF24]" /> : <Moon className="w-4 h-4 text-[#173D35]" />}
          </button>

          {/* Quick Action */}
          <button
            onClick={() => {
              if (isLanding) setIsLanding(false);
              setCurrentView('image-detect');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#173D35] hover:bg-[#1F4E44] dark:bg-[#2DD4BF] dark:hover:bg-[#26B8A5] text-white dark:text-[#111715] transition-all shadow-sm active:scale-95"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan</span>
          </button>
        </div>

      </div>
    </header>
  );
}
