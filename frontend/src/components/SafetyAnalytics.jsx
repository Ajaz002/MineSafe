import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Layers
} from 'lucide-react';
import { 
  HOURLY_COMPLIANCE_TREND, 
  VIOLATION_DISTRIBUTION, 
  ZONE_STATUS 
} from '../data/mockData';

export default function SafetyAnalytics() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 lg:px-8 py-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            [DATA ANALYTICS] SITE TELEMETRY
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white">Workplace Safety & Compliance Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Longitudinal compliance monitoring, hazard frequency distribution, and risk zone heatmaps.
        </p>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Violation Breakdown Bar Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-1">Violation Frequency by PPE Category</h3>
          <p className="text-xs text-slate-400 mb-6">Aggregated non-compliance occurrences over the last 30 operational days</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VIOLATION_DISTRIBUTION} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff' 
                  }} 
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {VIOLATION_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Shift Comparison */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Operational Shift Compliance Breakdown</h3>
            <p className="text-xs text-slate-400 mb-6">Comparison of safety adherence across mine work shifts</p>

            <div className="space-y-4">
              {[
                { shift: 'Morning Shift (06:00 - 14:00)', compliance: 93.8, workers: 56, violations: 18, color: 'bg-emerald-400' },
                { shift: 'Evening Shift (14:00 - 22:00)', compliance: 89.2, workers: 44, violations: 31, color: 'bg-amber-400' },
                { shift: 'Night Shift (22:00 - 06:00)', compliance: 84.5, workers: 28, violations: 42, color: 'bg-red-400' },
              ].map((s, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-white">{s.shift}</span>
                    <span className="font-mono font-bold text-emerald-400">{s.compliance}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.compliance}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{s.workers} Workers active</span>
                    <span>{s.violations} Violations recorded</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            * Night shift shows 9.3% lower compliance, primarily driven by eye protection removal during low-illumination operations.
          </div>
        </div>

      </div>

      {/* Zone Safety Risk Matrix */}
      <section className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-1">Monitored Zone Risk Matrix</h3>
        <p className="text-xs text-slate-400 mb-6">Current safety ratings across all operational sectors</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Zone Identifier</th>
                <th className="pb-3 font-semibold">Sector Name</th>
                <th className="pb-3 font-semibold">Risk Classification</th>
                <th className="pb-3 font-semibold">Active Workers</th>
                <th className="pb-3 font-semibold">Cameras</th>
                <th className="pb-3 font-semibold text-right">Compliance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ZONE_STATUS.map((zone) => (
                <tr key={zone.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 font-mono text-emerald-400">{zone.id}</td>
                  <td className="py-3.5 font-medium text-white">{zone.name}</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      zone.risk === 'HIGH' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                      zone.risk === 'MEDIUM' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {zone.risk}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-300 font-mono">{zone.workers}</td>
                  <td className="py-3.5 text-slate-300 font-mono">{zone.cameras}</td>
                  <td className="py-3.5 text-right font-mono font-bold text-emerald-400">
                    {zone.compliance}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
