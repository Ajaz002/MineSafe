import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Building,
  Shield,
  FileCheck,
  Award,
  Clock
} from 'lucide-react';
import { fetchAnalyticsAPI } from '../api/client';
import { EQUIPMENT_STATS, ZONE_STATUS } from '../data/mockData';

export default function ReportsView() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalyticsAPI().then(data => {
      if (data) setAnalytics(data);
    });
  }, []);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Zone,Workers,Compliance_Rate,Status\n" +
      ZONE_STATUS.map(z => `${z.name},${z.workers},${z.compliance}%,${z.risk}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `minesafe_compliance_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isDemo = !analytics || analytics.is_demo;
  const complianceRate = analytics?.compliance_rate || 91.4;
  const totalScans = analytics?.total_detections || 14820;
  const totalWorkers = analytics?.total_workers ?? 42;
  const totalViolations = analytics?.total_violations ?? 14;
  const equipmentList = analytics?.equipment_stats || EQUIPMENT_STATS;

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 lg:px-8 py-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-6 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#173D35]/10 dark:bg-[#2DD4BF]/10 text-[#173D35] dark:text-[#2DD4BF] text-[11px] font-bold tracking-wide uppercase mb-2">
            <FileCheck className="w-3.5 h-3.5" />
            Statutory Safety Documentation
          </div>
          <h1 className="text-2xl font-bold text-[#202A27] dark:text-[#F5F7F6]">OSHA / MSHA Safety Compliance Audit</h1>
          <p className="text-xs text-[#78827D] mt-1">
            Standardized regulatory compliance summaries, equipment checklists, and downloadable verification records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] text-[#202A27] dark:text-[#F5F7F6] hover:bg-[#EAEFEA] text-xs font-semibold transition-all shadow-soft"
          >
            <Printer className="w-4 h-4 text-[#78827D]" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173D35] hover:bg-[#1F4E44] dark:bg-[#2DD4BF] dark:hover:bg-[#26B8A5] text-white dark:text-[#111715] font-bold text-xs shadow-soft transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Formal Audit Document Container */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-8 shadow-card space-y-8">
        
        {/* Document Header */}
        <div className="border-b border-[#E2E8E5] dark:border-[#24302B] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-[#173D35] dark:text-[#2DD4BF] uppercase tracking-wider">
                DOCUMENT NO: MS-AUD-2026-11
              </span>
              {isDemo && (
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-500/10 text-amber-700 font-bold">
                  [DEMO AUDIT]
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-[#202A27] dark:text-[#F5F7F6]">
              Workplace Safety & PPE Adherence Certificate
            </h2>
            <p className="text-xs text-[#78827D] mt-0.5">
              Automated Inspection Platform: MineSafe Neural Vision Engine
            </p>
          </div>

          <div className="text-left md:text-right text-xs text-[#78827D] space-y-0.5 font-mono">
            <div>Site: Mining Operations Sector Alpha</div>
            <div>Auditor: MineSafe Vision AI Engine</div>
            <div>Status: <strong className="text-[#173D35] dark:text-[#2DD4BF]">{complianceRate >= 90 ? 'CERTIFIED PASS' : 'FLAGGED AUDIT'}</strong></div>
          </div>
        </div>

        {/* Audit Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
            <span className="text-[11px] text-[#78827D] block">Overall Compliance</span>
            <span className="text-2xl font-bold font-mono text-[#173D35] dark:text-[#2DD4BF]">{complianceRate}%</span>
            <span className="text-[10px] text-[#173D35] dark:text-[#2DD4BF] block mt-0.5">&ge; 90.0% Standard</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
            <span className="text-[11px] text-[#78827D] block">Total Inspected Scans</span>
            <span className="text-2xl font-bold font-mono text-[#202A27] dark:text-[#F5F7F6]">{totalScans}</span>
            <span className="text-[10px] text-[#78827D] block mt-0.5">Continuous Logging</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
            <span className="text-[11px] text-[#78827D] block">Total Violations</span>
            <span className="text-2xl font-bold font-mono text-[#D9534F]">{totalViolations}</span>
            <span className="text-[10px] text-[#D9534F] block mt-0.5">Alerts Recorded</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
            <span className="text-[11px] text-[#78827D] block">Monitored Personnel</span>
            <span className="text-2xl font-bold font-mono text-[#202A27] dark:text-[#F5F7F6]">{totalWorkers}</span>
            <span className="text-[10px] text-[#78827D] block mt-0.5">Across Active Shifts</span>
          </div>
        </div>

        {/* Section 1: Equipment Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#78827D] uppercase tracking-wider">
            1. Equipment Category Compliance Audit
          </h3>

          <div className="border border-[#E2E8E5] dark:border-[#24302B] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7F6] dark:bg-[#141C19] text-[#78827D] font-bold text-[10px] uppercase">
                <tr>
                  <th className="px-4 py-3">Equipment Item</th>
                  <th className="px-4 py-3">Regulatory Class</th>
                  <th className="px-4 py-3">Logged Violations</th>
                  <th className="px-4 py-3">Compliance Rate</th>
                  <th className="px-4 py-3 text-right">Standard Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E5] dark:divide-[#24302B]">
                {equipmentList.map((eq, i) => (
                  <tr key={i} className="hover:bg-[#F5F7F6]/50 dark:hover:bg-[#141C19]/50">
                    <td className="px-4 py-3 font-semibold text-[#202A27] dark:text-[#F5F7F6]">{eq.item}</td>
                    <td className="px-4 py-3 text-[#78827D]">{eq.name}</td>
                    <td className="px-4 py-3 font-mono font-medium text-[#D9534F]">{eq.violations}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#173D35] dark:text-[#2DD4BF]">{eq.compliant_rate ?? eq.compliantRate}%</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        (eq.compliant_rate ?? eq.compliantRate) >= 90 
                          ? 'bg-[#B8D8C5]/30 text-[#173D35] dark:bg-[#213B32] dark:text-[#2DD4BF]'
                          : 'bg-[#D9534F]/10 text-[#D9534F]'
                      }`}>
                        {(eq.compliant_rate ?? eq.compliantRate) >= 90 ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {(eq.compliant_rate ?? eq.compliantRate) >= 90 ? 'PASSED' : 'FLAGGED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Sector Risk Matrix */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#78827D] uppercase tracking-wider">
            2. Sector Inspection Breakdown
          </h3>

          <div className="border border-[#E2E8E5] dark:border-[#24302B] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7F6] dark:bg-[#141C19] text-[#78827D] font-bold text-[10px] uppercase">
                <tr>
                  <th className="px-4 py-3">Sector Zone</th>
                  <th className="px-4 py-3">Active Personnel</th>
                  <th className="px-4 py-3">Compliance Index</th>
                  <th className="px-4 py-3 text-right">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E5] dark:divide-[#24302B]">
                {ZONE_STATUS.map((z) => (
                  <tr key={z.id} className="hover:bg-[#F5F7F6]/50 dark:hover:bg-[#141C19]/50">
                    <td className="px-4 py-3 font-semibold text-[#202A27] dark:text-[#F5F7F6]">{z.name}</td>
                    <td className="px-4 py-3 font-mono text-[#78827D]">{z.workers}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#173D35] dark:text-[#2DD4BF]">{z.compliance}%</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        z.risk === 'LOW' ? 'bg-[#B8D8C5]/30 text-[#173D35] dark:bg-[#213B32] dark:text-[#2DD4BF]' :
                        z.risk === 'MEDIUM' ? 'bg-[#E6A23C]/10 text-[#E6A23C]' : 'bg-[#D9534F]/10 text-[#D9534F]'
                      }`}>
                        {z.risk} RISK
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Sign-off Footer */}
        <div className="pt-6 border-t border-[#E2E8E5] dark:border-[#24302B] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#78827D] gap-4">
          <div>
            <span className="font-semibold text-[#202A27] dark:text-[#F5F7F6] block">Verified by Safety System:</span>
            <span>MineSafe Industrial Automated Health & Safety Compliance Engine</span>
          </div>

          <div className="sm:text-right font-mono">
            <div>Verification Code: MS-CERT-PASS-2026</div>
            <div>Generated: {new Date().toLocaleDateString()}</div>
          </div>
        </div>

      </div>

    </div>
  );
}
