import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Scan, 
  ArrowUpRight, 
  HardHat, 
  Shirt, 
  Glasses, 
  Footprints, 
  Hand, 
  ShieldAlert,
  Clock, 
  MapPin, 
  Camera, 
  Video, 
  Activity, 
  CheckCircle2, 
  FileText,
  Eye,
  FileCheck,
  RotateCcw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { fetchAnalyticsAPI, fetchHistoryAPI } from '../api/client';
import { EQUIPMENT_STATS, RECENT_AUDIT_LOGS, HOURLY_COMPLIANCE_TREND } from '../data/mockData';

export default function DashboardView({ onNavigate }) {
  const [analytics, setAnalytics] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAnalyticsAPI(), fetchHistoryAPI(6)]).then(([analyticsData, historyData]) => {
      if (analyticsData) {
        setAnalytics(analyticsData);
      }
      if (historyData?.events && historyData.events.length > 0) {
        setRecentLogs(historyData.events);
      } else {
        setRecentLogs(RECENT_AUDIT_LOGS);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const isDemo = !analytics || analytics.is_demo;

  const getEquipmentIcon = (name) => {
    switch(name) {
      case 'Head Protection': return <HardHat className="w-5 h-5 text-[#173D35] dark:text-[#2DD4BF]" />;
      case 'Torso Visibility': return <Shirt className="w-5 h-5 text-[#173D35] dark:text-[#2DD4BF]" />;
      case 'Hand Protection': return <Hand className="w-5 h-5 text-[#173D35] dark:text-[#2DD4BF]" />;
      case 'Eye Protection': return <Glasses className="w-5 h-5 text-[#173D35] dark:text-[#2DD4BF]" />;
      case 'Footwear Safety': return <Footprints className="w-5 h-5 text-[#173D35] dark:text-[#2DD4BF]" />;
      default: return <ShieldAlert className="w-5 h-5 text-[#173D35] dark:text-[#2DD4BF]" />;
    }
  };

  const equipmentList = analytics?.equipment_stats || EQUIPMENT_STATS;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      
      {/* Top Banner with Clear Demo vs Live Labelling */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase mb-2">
            {isDemo ? (
              <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                [DEMO BASELINE TELEMETRY — PERFORM A SCAN TO VIEW LIVE DATA]
              </span>
            ) : (
              <span className="bg-[#B8D8C5]/40 text-[#173D35] dark:bg-[#213B32] dark:text-[#2DD4BF] border border-[#B8D8C5] px-2 py-0.5 rounded-full flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#173D35] dark:bg-[#2DD4BF] animate-pulse"></span>
                [LIVE PRODUCTION AUDIT — SYNCHRONIZED WITH SQLITE DATABASE]
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-[#202A27] dark:text-[#F5F7F6]">Workplace Safety Compliance Command</h1>
          <p className="text-xs text-[#78827D] mt-1">
            Real-time deep learning detection of personal protective equipment, direct missing gear tagging, and forensic safety auditing.
          </p>
        </div>

        {/* Quick Launch Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('image-detect')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#173D35] hover:bg-[#1F4E44] dark:bg-[#2DD4BF] dark:hover:bg-[#26B8A5] text-white dark:text-[#111715] text-xs font-semibold shadow-soft transition-all"
          >
            <Scan className="w-4 h-4" />
            <span>Scan Image</span>
          </button>

          <button
            onClick={() => onNavigate('video-detect')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] text-[#202A27] dark:text-[#F5F7F6] text-xs font-semibold hover:bg-[#EAEFEA] transition-all"
          >
            <Video className="w-4 h-4 text-[#78827D]" />
            <span>Audit Video</span>
          </button>

          <button
            onClick={() => onNavigate('webcam')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] text-[#202A27] dark:text-[#F5F7F6] text-xs font-semibold hover:bg-[#EAEFEA] transition-all"
          >
            <Camera className="w-4 h-4 text-[#78827D]" />
            <span>Live Camera</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Compliance Rate Card */}
        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
          <div className="flex items-center justify-between text-[#78827D] mb-1">
            <span className="text-xs font-semibold">Overall PPE Compliance</span>
            <ShieldCheck className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#173D35] dark:text-[#2DD4BF]">
            {analytics && !analytics.is_demo && analytics.total_workers === 0 ? (
              <span className="text-xl text-[#78827D]">N/A</span>
            ) : (
              `${analytics?.compliance_rate ?? 91.4}%`
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#78827D] mt-2">
            <span>
              {analytics && !analytics.is_demo && analytics.total_workers === 0
                ? 'Unable to calculate compliance'
                : 'OSHA Threshold: 90%'}
            </span>
            {isDemo && <span className="text-[10px] text-amber-600 font-mono font-bold">[DEMO]</span>}
          </div>
        </div>

        {/* Total Workers Monitored */}
        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
          <div className="flex items-center justify-between text-[#78827D] mb-1">
            <span className="text-xs font-semibold">Total Workers Detected</span>
            <Users className="w-4 h-4 text-[#202A27] dark:text-[#F5F7F6]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#202A27] dark:text-[#F5F7F6]">
            {analytics?.total_workers ?? 42}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#78827D] mt-2">
            <span>Personnel In Scans</span>
            {isDemo && <span className="text-[10px] text-amber-600 font-mono font-bold">[DEMO]</span>}
          </div>
        </div>

        {/* Total PPE Items Located */}
        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
          <div className="flex items-center justify-between text-[#78827D] mb-1">
            <span className="text-xs font-semibold">Total PPE Items Detected</span>
            <Scan className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#202A27] dark:text-[#F5F7F6]">
            {analytics?.total_ppe_items ?? 11520}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#78827D] mt-2">
            <span>Helmets, Vests, Boots, etc.</span>
            {isDemo && <span className="text-[10px] text-amber-600 font-mono font-bold">[DEMO]</span>}
          </div>
        </div>

        {/* Total Safety Violations */}
        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
          <div className="flex items-center justify-between text-[#78827D] mb-1">
            <span className="text-xs font-semibold">Total Safety Violations</span>
            <AlertTriangle className="w-4 h-4 text-[#D9534F]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#D9534F]">
            {analytics?.total_violations ?? 14}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#78827D] mt-2">
            <span>Direct Missing PPE Tags</span>
            {isDemo && <span className="text-[10px] text-amber-600 font-mono font-bold">[DEMO]</span>}
          </div>
        </div>

      </div>

      {/* Detection Sessions Breakdown by Modality */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => onNavigate('image-detect')}
          className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-4 rounded-xl shadow-soft flex items-center justify-between cursor-pointer hover:border-[#173D35] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#F5F7F6] dark:bg-[#141C19]">
              <Scan className="w-5 h-5 text-[#173D35] dark:text-[#2DD4BF]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#202A27] dark:text-[#F5F7F6]">Images Analysed</div>
              <div className="text-[11px] text-[#78827D]">Photo evidence audits</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold font-mono text-[#202A27] dark:text-[#F5F7F6]">
              {analytics?.total_images ?? 9420}
            </div>
            {isDemo && <span className="text-[9px] text-amber-600 font-mono font-bold">[DEMO]</span>}
          </div>
        </div>

        <div 
          onClick={() => onNavigate('video-detect')}
          className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-4 rounded-xl shadow-soft flex items-center justify-between cursor-pointer hover:border-[#173D35] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#F5F7F6] dark:bg-[#141C19]">
              <Video className="w-5 h-5 text-[#173D35] dark:text-[#2DD4BF]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#202A27] dark:text-[#F5F7F6]">Videos Analysed</div>
              <div className="text-[11px] text-[#78827D]">Footage timelines</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold font-mono text-[#202A27] dark:text-[#F5F7F6]">
              {analytics?.total_videos ?? 3200}
            </div>
            {isDemo && <span className="text-[9px] text-amber-600 font-mono font-bold">[DEMO]</span>}
          </div>
        </div>

        <div 
          onClick={() => onNavigate('webcam')}
          className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-4 rounded-xl shadow-soft flex items-center justify-between cursor-pointer hover:border-[#173D35] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#F5F7F6] dark:bg-[#141C19]">
              <Camera className="w-5 h-5 text-[#173D35] dark:text-[#2DD4BF]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#202A27] dark:text-[#F5F7F6]">Webcam Sessions</div>
              <div className="text-[11px] text-[#78827D]">Live device camera</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold font-mono text-[#202A27] dark:text-[#F5F7F6]">
              {analytics?.total_webcam ?? 2200}
            </div>
            {isDemo && <span className="text-[9px] text-amber-600 font-mono font-bold">[DEMO]</span>}
          </div>
        </div>
      </div>

      {/* PPE-Wise Compliance Breakdown (6 Categories) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#202A27] dark:text-[#F5F7F6]">PPE-Wise Compliance Breakdown</h2>
            <p className="text-xs text-[#78827D]">Per-equipment adherence rate and active violation tracking</p>
          </div>
          {isDemo && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold">
              [DEMO BASELINE METRICS]
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {equipmentList.map((eq, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-4 rounded-xl shadow-soft flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-[#F5F7F6] dark:bg-[#141C19]">
                  {getEquipmentIcon(eq.name)}
                </div>
                <span className={`text-[11px] font-bold font-mono ${
                  eq.compliant_rate >= 92 ? 'text-[#173D35] dark:text-[#2DD4BF]' :
                  eq.compliant_rate >= 85 ? 'text-[#E6A23C]' : 'text-[#D9534F]'
                }`}>
                  {eq.compliant_rate}%
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#202A27] dark:text-[#F5F7F6] truncate">{eq.item}</div>
                <div className="text-[10px] text-[#78827D] mt-0.5">{eq.violations} violations</div>
              </div>
              <div className="w-full bg-[#E2E8E5] dark:bg-[#24302B] h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    eq.compliant_rate >= 92 ? 'bg-[#173D35] dark:bg-[#2DD4BF]' :
                    eq.compliant_rate >= 85 ? 'bg-[#E6A23C]' : 'bg-[#D9534F]'
                  }`}
                  style={{ width: `${eq.compliant_rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Chart & Recent Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Trend Chart (2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-6 rounded-2xl shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#202A27] dark:text-[#F5F7F6]">Hourly Shift Compliance Index (%)</h3>
              <p className="text-xs text-[#78827D]">Visual compliance rate over the past 8 hours vs. 90% OSHA threshold</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#B8D8C5]/30 text-[#173D35] dark:bg-[#213B32] dark:text-[#2DD4BF]">
              Passing Standard
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_COMPLIANCE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#173D35" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#173D35" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8E5" vertical={false} />
                <XAxis dataKey="time" stroke="#78827D" fontSize={11} tickLine={false} />
                <YAxis domain={[80, 100]} stroke="#78827D" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderColor: '#E2E8E5', 
                    borderRadius: '8px', 
                    fontSize: '11px',
                    color: '#202A27',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="#173D35" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#forestGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Detection Activity (1 Column) */}
        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-6 rounded-2xl shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#202A27] dark:text-[#F5F7F6]">Recent Detection Activity</h3>
              <Clock className="w-4 h-4 text-[#78827D]" />
            </div>
            <p className="text-xs text-[#78827D] mb-4">Latest forensic compliance audits</p>

            <div className="space-y-2.5">
              {recentLogs.slice(0, 5).map((log, i) => (
                <div 
                  key={log.id || i}
                  onClick={() => onNavigate('history')}
                  className="p-2.5 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] hover:bg-[#EAEFEA] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-[#202A27] dark:text-[#F5F7F6]">{log.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                      log.is_compliant || log.status === 'COMPLIANT'
                        ? 'bg-[#B8D8C5]/30 text-[#173D35]' 
                        : 'bg-[#D9534F]/10 text-[#D9534F]'
                    }`}>
                      {log.is_compliant || log.status === 'COMPLIANT' ? 'Compliant' : 'Violation'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#78827D] truncate">
                    Zone: {log.zone} &bull; {log.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8E5] dark:border-[#24302B] mt-4">
            <button
              onClick={() => onNavigate('history')}
              className="w-full py-2 rounded-xl bg-[#173D35] hover:bg-[#1F4E44] dark:bg-[#2DD4BF] dark:hover:bg-[#26B8A5] text-white dark:text-[#111715] text-xs font-semibold shadow-soft transition-all"
            >
              View Full Audit Trail
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
