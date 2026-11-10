import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Download, 
  HardHat, 
  Shirt, 
  Glasses, 
  Footprints, 
  Hand, 
  ShieldAlert,
  Calendar,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { 
  EQUIPMENT_STATS, 
  HOURLY_COMPLIANCE_TREND, 
  VIOLATION_DISTRIBUTION, 
  ZONE_STATUS 
} from '../data/mockData';

export default function AnalyticsView() {
  const [selectedRange, setSelectedRange] = useState('Today (Shift 1 & 2)');

  const getEquipmentIcon = (name) => {
    switch(name) {
      case 'Head Protection': return <HardHat className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />;
      case 'Torso Visibility': return <Shirt className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />;
      case 'Hand Protection': return <Hand className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />;
      case 'Eye Protection': return <Glasses className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />;
      case 'Footwear Safety': return <Footprints className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />;
      default: return <ShieldAlert className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#173D35]/10 dark:bg-[#2DD4BF]/10 text-[#173D35] dark:text-[#2DD4BF] text-[11px] font-bold tracking-wide uppercase mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Safety Intelligence & Analytics
          </div>
          <h1 className="text-2xl font-bold text-[#202A27] dark:text-[#F5F7F6]">PPE Compliance & Hazard Metrics</h1>
          <p className="text-xs text-[#78827D] mt-1">
            Aggregated statistical distributions, hourly safety indices, and sector-by-sector risk assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] px-3 py-2 rounded-xl text-xs font-medium text-[#202A27] dark:text-[#F5F7F6] focus:outline-none"
          >
            <option value="Today (Shift 1 & 2)">Today (Shift 1 & 2)</option>
            <option value="Past 7 Days">Past 7 Days</option>
            <option value="Past 30 Days">Past 30 Days</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
          <span className="text-xs font-semibold text-[#78827D]">Shift Compliance Average</span>
          <div className="text-2xl font-bold font-mono text-[#173D35] dark:text-[#2DD4BF] mt-1">91.4%</div>
          <span className="text-[11px] text-[#173D35] dark:text-[#2DD4BF] font-medium">+2.1% higher than 7-day avg</span>
        </div>

        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
          <span className="text-xs font-semibold text-[#78827D]">Most Frequent Absence</span>
          <div className="text-xl font-bold text-[#D9534F] mt-1">Safety Goggles</div>
          <span className="text-[11px] text-[#78827D]">48 detections missing eye protection</span>
        </div>

        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
          <span className="text-xs font-semibold text-[#78827D]">Highest Compliance Sector</span>
          <div className="text-xl font-bold text-[#202A27] dark:text-[#F5F7F6] mt-1">Main Workshop</div>
          <span className="text-[11px] text-[#173D35] dark:text-[#2DD4BF] font-medium">98.0% adherence index</span>
        </div>

        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-5 rounded-2xl shadow-soft">
          <span className="text-xs font-semibold text-[#78827D]">Critical Red-Zone Alerts</span>
          <div className="text-2xl font-bold font-mono text-[#E6A23C] mt-1">3 Incidents</div>
          <span className="text-[11px] text-[#78827D]">No helmet in Shaft B4 entry</span>
        </div>
      </div>

      {/* Two Column Layout for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Hourly Compliance Trend */}
        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-6 rounded-2xl shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#202A27] dark:text-[#F5F7F6]">Shift Compliance Index Over Time</h3>
              <p className="text-xs text-[#78827D]">Hourly adherence curve vs. OSHA 90% compliance standard</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#B8D8C5]/30 text-[#173D35] dark:bg-[#213B32] dark:text-[#2DD4BF]">
              Target: 90%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_COMPLIANCE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="forestArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#173D35" stopOpacity={0.25}/>
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="#173D35" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#forestArea)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Violation Breakdown by PPE Category */}
        <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] p-6 rounded-2xl shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#202A27] dark:text-[#F5F7F6]">Hazard Violations by PPE Category</h3>
              <p className="text-xs text-[#78827D]">Distribution of logged missing gear instances</p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#78827D]">
              143 Total Tagged
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VIOLATION_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8E5" vertical={false} />
                <XAxis dataKey="name" stroke="#78827D" fontSize={10} tickLine={false} />
                <YAxis stroke="#78827D" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderColor: '#E2E8E5', 
                    borderRadius: '8px',
                    fontSize: '11px' 
                  }} 
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {VIOLATION_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#D9534F' : index === 1 ? '#E6A23C' : '#173D35'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Equipment Detailed Compliance Table */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-6 shadow-soft">
        <h3 className="text-sm font-bold text-[#202A27] dark:text-[#F5F7F6] mb-4">Mandatory Gear Adherence Breakdown</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EQUIPMENT_STATS.map((eq, i) => (
            <div 
              key={i} 
              className="p-4 rounded-xl border border-[#E2E8E5] dark:border-[#24302B] bg-[#F5F7F6] dark:bg-[#141C19] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#19221F] shadow-sm">
                  {getEquipmentIcon(eq.name)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#202A27] dark:text-[#F5F7F6]">{eq.item}</h4>
                  <span className="text-[11px] text-[#78827D]">{eq.violations} logged violations</span>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-base font-bold font-mono ${
                  eq.compliantRate >= 92 ? 'text-[#173D35] dark:text-[#2DD4BF]' :
                  eq.compliantRate >= 88 ? 'text-[#E6A23C]' : 'text-[#D9534F]'
                }`}>
                  {eq.compliantRate}%
                </div>
                <span className="text-[10px] text-[#78827D]">Compliance</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

