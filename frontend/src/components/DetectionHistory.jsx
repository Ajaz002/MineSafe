import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  ExternalLink,
  X,
  Download
} from 'lucide-react';
import { RECENT_AUDIT_LOGS } from '../data/mockData';

export default function DetectionHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAudit, setSelectedAudit] = useState(null);

  const filteredLogs = RECENT_AUDIT_LOGS.filter(log => {
    const matchesSearch = 
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.personId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 lg:px-8 py-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            [AUDIT TRAIL] HISTORICAL ARCHIVE
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white">Detection Audit Trail & Incident Logs</h1>
        <p className="text-xs text-slate-400 mt-1">
          Searchable forensic repository of localized detection events, video snapshot archives, and action logs.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Audit ID, Zone, Worker ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {['ALL', 'COMPLIANT', 'VIOLATION', 'CRITICAL'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === status 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Audit Log Table */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-4 px-6 font-semibold">Incident Record</th>
                <th className="py-4 px-4 font-semibold">Timestamp</th>
                <th className="py-4 px-4 font-semibold">Zone & Camera</th>
                <th className="py-4 px-4 font-semibold">Compliance Status</th>
                <th className="py-4 px-4 font-semibold">Violations Detected</th>
                <th className="py-4 px-4 font-semibold">Action Dispatched</th>
                <th className="py-4 px-6 font-semibold text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={log.snapshotUrl} 
                        alt="Thumbnail" 
                        className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0" 
                      />
                      <div>
                        <div className="font-mono font-bold text-white">{log.id}</div>
                        <div className="text-[10px] text-slate-400">{log.personId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-white">{log.zone}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.camera}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'COMPLIANT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      log.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {log.violations.length === 0 ? (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Compliant
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {log.violations.map((v, idx) => (
                          <span 
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-semibold"
                          >
                            {v.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {log.actionTaken}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <button
                      onClick={() => setSelectedAudit(log)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal */}
      {selectedAudit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Forensic Audit: {selectedAudit.id}</h3>
                <p className="text-xs text-slate-400">{selectedAudit.timestamp} · {selectedAudit.zone}</p>
              </div>
              <button 
                onClick={() => setSelectedAudit(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800">
              <img 
                src={selectedAudit.snapshotUrl} 
                alt="Audit Snapshot" 
                className="w-full h-72 object-cover" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Target Personnel:</span>
                <span className="font-mono font-bold text-white">{selectedAudit.personId}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">AI Detection Confidence:</span>
                <span className="font-mono font-bold text-emerald-400">{(selectedAudit.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Compliance Score:</span>
                <span className="font-mono font-bold text-white">{selectedAudit.complianceScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Action Dispatched:</span>
                <span className="font-medium text-slate-200">{selectedAudit.actionTaken}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedAudit(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
