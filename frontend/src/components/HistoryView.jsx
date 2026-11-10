import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Eye, 
  AlertTriangle, 
  AlertCircle,
  ShieldCheck, 
  Clock, 
  MapPin, 
  Download, 
  X, 
  FileCheck, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { fetchHistoryAPI, resolveMediaUrl } from '../api/client';
import { RECENT_AUDIT_LOGS } from '../data/mockData';

export default function HistoryView() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoryAPI(50).then(data => {
      if (data?.events && data.events.length > 0) {
        setEvents(data.events);
      } else {
        // Fallback to demo audit logs if no real detections yet
        setEvents(RECENT_AUDIT_LOGS.map(log => ({
          id: log.id,
          timestamp: log.timestamp,
          zone: log.zone,
          total_persons: 1,
          total_violations: log.violations.length,
          compliance_rate: log.complianceScore,
          is_compliant: log.status === 'COMPLIANT',
          annotated_image: log.snapshotUrl,
          violations: log.violations,
          isDemo: true
        })));
      }
      setLoading(false);
    }).catch(() => {
      setEvents(RECENT_AUDIT_LOGS.map(log => ({
        id: log.id,
        timestamp: log.timestamp,
        zone: log.zone,
        total_persons: 1,
        total_violations: log.violations.length,
        compliance_rate: log.complianceScore,
        is_compliant: log.status === 'COMPLIANT',
        annotated_image: log.snapshotUrl,
        violations: log.violations,
        isDemo: true
      })));
      setLoading(false);
    });
  }, []);

  const getImageSrc = (url) => {
    return resolveMediaUrl(url);
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.zone.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === 'COMPLIANT') return matchesSearch && e.is_compliant;
    if (filterStatus === 'VIOLATION') return matchesSearch && !e.is_compliant;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#173D35]/10 dark:bg-[#2DD4BF]/10 text-[#173D35] dark:text-[#2DD4BF] text-[11px] font-bold tracking-wide uppercase mb-2">
            <History className="w-3.5 h-3.5" />
            Immutable Audit Trail
          </div>
          <h1 className="text-2xl font-bold text-[#202A27] dark:text-[#F5F7F6]">Forensic Detection History & Audit Log</h1>
          <p className="text-xs text-[#78827D] mt-1">
            Searchable historical archive of all photographic and sensor-based compliance evaluations.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#78827D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID or Zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] rounded-xl text-xs text-[#202A27] dark:text-[#F5F7F6] focus:outline-none w-48 sm:w-64"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] px-3 py-2 rounded-xl text-xs font-medium text-[#202A27] dark:text-[#F5F7F6] focus:outline-none"
          >
            <option value="ALL">All Records</option>
            <option value="COMPLIANT">Compliant Only</option>
            <option value="VIOLATION">Violations Only</option>
          </select>
        </div>
      </div>

      {/* Events Table Card */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7F6] dark:bg-[#141C19] border-b border-[#E2E8E5] dark:border-[#24302B] text-[#78827D] uppercase font-bold text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Event ID</th>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Sector / Zone</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Compliance</th>
                <th className="px-5 py-3.5">Workers / Violations</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E5] dark:divide-[#24302B]">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((evt) => (
                  <tr 
                    key={evt.id}
                    className="hover:bg-[#F5F7F6]/60 dark:hover:bg-[#141C19]/60 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono font-semibold text-[#202A27] dark:text-[#F5F7F6]">
                      <div className="flex items-center gap-1.5">
                        <span>{evt.id}</span>
                        {evt.isDemo && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-sans">
                            DEMO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#78827D] font-mono text-[11px]">
                      {evt.timestamp}
                    </td>
                    <td className="px-5 py-3.5 text-[#202A27] dark:text-[#F5F7F6] font-medium">
                      {evt.zone}
                    </td>
                    <td className="px-5 py-3.5">
                      {evt.total_persons === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#78827D]/10 text-[#78827D] border border-[#78827D]/30">
                          <AlertCircle className="w-3 h-3" />
                          Unable to calculate
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          evt.is_compliant
                            ? 'bg-[#B8D8C5]/30 text-[#173D35] dark:bg-[#213B32] dark:text-[#2DD4BF]'
                            : 'bg-[#D9534F]/10 text-[#D9534F]'
                        }`}>
                          {evt.is_compliant ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {evt.is_compliant ? 'Compliant' : 'Violation'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold">
                      {evt.total_persons === 0 || evt.compliance_rate === null ? (
                        <span className="text-[#78827D] font-normal text-xs">N/A</span>
                      ) : (
                        <span className={evt.compliance_rate >= 90 ? 'text-[#173D35] dark:text-[#2DD4BF]' : 'text-[#D9534F]'}>
                          {evt.compliance_rate}%
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[#78827D]">
                      <span>{evt.total_persons || 1} worker(s) &bull; </span>
                      <strong className={evt.total_violations > 0 ? 'text-[#D9534F]' : 'text-[#173D35] dark:text-[#2DD4BF]'}>
                        {evt.total_violations} violation(s)
                      </strong>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedEvent(evt)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] text-[#202A27] dark:text-[#F5F7F6] hover:bg-[#EAEFEA] transition-colors font-medium text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#78827D]" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#78827D]">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">No detection records match the current filter criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Inspection Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl max-w-2xl w-full p-6 shadow-card space-y-4 animate-fade-in">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E5] dark:border-[#24302B]">
              <div>
                <span className="text-[10px] font-bold text-[#78827D] uppercase font-mono">Forensic Snapshot</span>
                <h3 className="text-base font-bold text-[#202A27] dark:text-[#F5F7F6]">{selectedEvent.id}</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg text-[#78827D] hover:text-[#202A27] hover:bg-[#F5F7F6] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Snapshot Image */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-[#202A27]">
              <img
                src={getImageSrc(selectedEvent.annotated_image)}
                alt="Inspection Snapshot"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
                <span className="text-[#78827D] text-[10px]">Zone</span>
                <div className="font-bold text-[#202A27] dark:text-[#F5F7F6] truncate">{selectedEvent.zone}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
                <span className="text-[#78827D] text-[10px]">Compliance Index</span>
                <div className="font-bold font-mono text-[#173D35] dark:text-[#2DD4BF]">
                  {selectedEvent.total_persons === 0 || selectedEvent.compliance_rate === null ? 'N/A' : `${selectedEvent.compliance_rate}%`}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
                <span className="text-[#78827D] text-[10px]">Status</span>
                <div className={`font-bold ${
                  selectedEvent.total_persons === 0 
                    ? 'text-[#78827D]' 
                    : selectedEvent.is_compliant 
                    ? 'text-[#173D35] dark:text-[#2DD4BF]' 
                    : 'text-[#D9534F]'
                }`}>
                  {selectedEvent.total_persons === 0 
                    ? 'Unable to calculate' 
                    : selectedEvent.is_compliant 
                    ? 'Compliant' 
                    : 'Non-Compliant'}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
                <span className="text-[#78827D] text-[10px]">Timestamp</span>
                <div className="font-mono text-[#78827D] text-[11px] truncate">{selectedEvent.timestamp}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-[#173D35] text-white text-xs font-semibold hover:bg-[#1F4E44] transition-colors"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

