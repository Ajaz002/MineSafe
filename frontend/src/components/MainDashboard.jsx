import React, { useState } from 'react';
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
  TrendingUp,
  Filter
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
import { 
  SITE_METRICS, 
  EQUIPMENT_STATS, 
  RECENT_AUDIT_LOGS, 
  HOURLY_COMPLIANCE_TREND 
} from '../data/mockData';

export default function MainDashboard({ onNavigateWorkspace }) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const filteredLogs = selectedFilter === 'ALL' 
    ? RECENT_AUDIT_LOGS 
    : RECENT_AUDIT_LOGS.filter(log => log.status === selectedFilter);

  const getEquipmentIcon = (name) => {
    switch(name) {
      case 'Head Protection': return <HardHat className="w-5 h-5 text-emerald-400" />;
      case 'Torso Visibility': return <Shirt className="w-5 h-5 text-emerald-400" />;
      case 'Hand Protection': return <Hand className="w-5 h-5 text-emerald-400" />;
      case 'Eye Protection': return <Glasses className="w-5 h-5 text-emerald-400" />;
      case 'Footwear Safety': return <Footprints className="w-5 h-5 text-emerald-400" />;
      default: return <ShieldAlert className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 lg:px-8 py-6">
      
      {/* Top Welcome & Site Score Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              [DEMO ENVIRONMENT] LIVE SENSOR TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Industrial Site Safety Command</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-camera AI monitoring across 6 active mine sectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Current Site Score</div>
            <div className="text-3xl font-black text-emerald-400 font-mono">91.4%</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Detections */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Total Detections Today</span>
            <Scan className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">14,820</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs last shift</span>
          </div>
        </div>

        {/* Compliance Rate */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">PPE Compliance Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">91.4%</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Target: &gt;90.0% (Passing)</span>
          </div>
        </div>

        {/* Active Violations */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Active Safety Violations</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 font-mono">14</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
            <span>3 Critical (Missing Helmets)</span>
          </div>
        </div>

        {/* Monitored Workers */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Personnel On Site</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">42</div>
          <div className="text-[11px] text-slate-400 mt-2">
            Across 6 Monitored Zones
          </div>
        </div>

      </div>

      {/* Equipment-Level Compliance Ring Breakdown */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Equipment-Level Compliance Telemetry</h2>
          <span className="text-xs text-slate-400">Audited in real time via YOLO11</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {EQUIPMENT_STATS.map((item, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-slate-800/60">
                  {getEquipmentIcon(item.name)}
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  item.compliantRate >= 92 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : item.compliantRate >= 87
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {item.compliantRate}%
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-white truncate">{item.item}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {item.violations} violation{item.violations !== 1 ? 's' : ''}
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    item.compliantRate >= 92 ? 'bg-emerald-400' :
                    item.compliantRate >= 87 ? 'bg-amber-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${item.compliantRate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Graph & Live Stream Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Trend Chart (2 columns) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Shift Compliance Rate Trend (%)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Continuous hourly tracking across morning and afternoon shifts</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                Compliance %
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_COMPLIANCE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[80, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#emeraldGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Detector Action Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              DETECTOR READY
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Test Any Image with Custom AI</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Upload custom site photos or test preset mining scenes to visualize real-time bounding boxes, 
              confidence percentages, and missing equipment alarms.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="text-slate-400 text-[11px]">Loaded YOLO Checkpoint:</div>
              <div className="text-emerald-400 font-mono font-medium mt-0.5 truncate">
                models/minesafe_yolo11s_best.pt
              </div>
            </div>

            <button
              onClick={onNavigateWorkspace}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Scan className="w-4 h-4" />
              <span>Open Detection Workspace</span>
            </button>
          </div>
        </div>

      </div>

      {/* Recent Incident / Audit Feed */}
      <section className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Live Site Event Stream</h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated detection events logged across all active security cameras</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'COMPLIANT', 'VIOLATION', 'CRITICAL'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedFilter === f 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Event List */}
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div 
              key={log.id}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img 
                  src={log.snapshotUrl} 
                  alt="Snapshot" 
                  className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono">{log.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      log.status === 'COMPLIANT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      log.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {log.status}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline">({log.personId})</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {log.zone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {log.timestamp.split(' ')[1]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Violations / Status Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {log.violations.length === 0 ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Full PPE Compliant
                  </span>
                ) : (
                  log.violations.map((v, i) => (
                    <span 
                      key={i} 
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 uppercase"
                    >
                      {v.replace('_', ' ')}
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
