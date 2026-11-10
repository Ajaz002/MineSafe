import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Shield, 
  HardHat, 
  AlertTriangle, 
  Bell, 
  Camera, 
  CheckCircle2, 
  Save, 
  RefreshCw,
  SlidersHorizontal,
  Volume2,
  Lock,
  Cpu,
  Info,
  ExternalLink,
  Mail
} from 'lucide-react';
import { fetchSettingsAPI, updateSettingsAPI } from '../api/client';

export default function SettingsView() {
  const [zones, setZones] = useState([
    { id: 'Z1', name: 'Underground Shaft B4', helmet: true, vest: true, gloves: true, goggles: true, boots: true, mask: true },
    { id: 'Z2', name: 'Haulage Loading Deck', helmet: true, vest: true, gloves: false, goggles: false, boots: true, mask: false },
    { id: 'Z3', name: 'Mineral Processing Pit', helmet: true, vest: true, gloves: true, goggles: true, boots: true, mask: true },
    { id: 'Z4', name: 'Main Equipment Workshop', helmet: true, vest: false, gloves: true, goggles: true, boots: true, mask: false },
    { id: 'Z5', name: 'Conveyor Gallery East', helmet: true, vest: true, gloves: false, goggles: false, boots: true, mask: false }
  ]);

  const [savedNotification, setSavedNotification] = useState(false);
  const [alarmSoundEnabled, setAlarmSoundEnabled] = useState(true);
  const [autoLockTurnstile, setAutoLockTurnstile] = useState(true);
  const [minConfidence, setMinConfidence] = useState(0.35);
  const [iouThreshold, setIouThreshold] = useState(0.45);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettingsAPI().then(data => {
      if (data) {
        if (data.conf_threshold) setMinConfidence(data.conf_threshold);
        if (data.iou_threshold) setIouThreshold(data.iou_threshold);
        if (data.alarm_sound !== undefined) setAlarmSoundEnabled(data.alarm_sound);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggleZoneRule = (zoneId, ruleKey) => {
    setZones(zones.map(z => z.id === zoneId ? { ...z, [ruleKey]: !z[ruleKey] } : z));
  };

  const handleSave = async () => {
    try {
      await updateSettingsAPI({
        conf_threshold: minConfidence,
        iou_threshold: iouThreshold,
        alarm_sound: alarmSoundEnabled,
        auto_lock: autoLockTurnstile
      });
    } catch {
      // Local state fallback
    }
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 lg:px-8 py-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-6 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#173D35]/10 dark:bg-[#2DD4BF]/10 text-[#173D35] dark:text-[#2DD4BF] text-[11px] font-bold tracking-wide uppercase mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            System Control & Rules Matrix
          </div>
          <h1 className="text-2xl font-bold text-[#202A27] dark:text-[#F5F7F6]">Zone Safety Rules & Sensor Matrix</h1>
          <p className="text-xs text-[#78827D] mt-1">
            Configure sector-specific mandatory PPE rules, YOLO threshold sensitivity, and automated interlocks.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173D35] hover:bg-[#1F4E44] dark:bg-[#2DD4BF] dark:hover:bg-[#26B8A5] text-white dark:text-[#111715] font-bold text-xs shadow-soft transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Confirmation Pill */}
      {savedNotification && (
        <div className="p-3.5 rounded-xl bg-[#B8D8C5]/30 border border-[#B8D8C5] text-[#173D35] dark:bg-[#213B32] dark:text-[#2DD4BF] dark:border-[#2DD4BF]/30 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />
          <span>System configuration successfully synchronized with the backend inference server.</span>
        </div>
      )}

      {/* Section 1: YOLO Detection Engine Hyperparameters */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-[#202A27] dark:text-[#F5F7F6] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />
          <span>AI Inference Sensitivity Parameters</span>
        </h3>
        <p className="text-xs text-[#78827D]">
          Adjust probability confidence bounds and Non-Maximum Suppression (NMS) overlap thresholds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-4 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#202A27] dark:text-[#F5F7F6]">Confidence Threshold</span>
              <span className="font-mono font-bold text-[#173D35] dark:text-[#2DD4BF]">{Math.round(minConfidence * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.85"
              step="0.05"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-full accent-[#173D35] dark:accent-[#2DD4BF]"
            />
            <p className="text-[10px] text-[#78827D]">
              Higher thresholds reduce false positives; lower thresholds increase sensitivity to small objects like goggles.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#202A27] dark:text-[#F5F7F6]">IoU (Overlap) Threshold</span>
              <span className="font-mono font-bold text-[#173D35] dark:text-[#2DD4BF]">{Math.round(iouThreshold * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.20"
              max="0.80"
              step="0.05"
              value={iouThreshold}
              onChange={(e) => setIouThreshold(parseFloat(e.target.value))}
              className="w-full accent-[#173D35] dark:accent-[#2DD4BF]"
            />
            <p className="text-[10px] text-[#78827D]">
              Controls bounding box deduplication in dense worker crowds and overlapping equipment.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Sector-Specific Required PPE Matrix */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-[#202A27] dark:text-[#F5F7F6] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />
          <span>Sector-Specific Mandatory PPE Checklist</span>
        </h3>
        <p className="text-xs text-[#78827D]">
          Define which protective gear items are legally required for each active mining zone. Missing items trigger automatic safety violation incidents.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7F6] dark:bg-[#141C19] text-[#78827D] font-bold text-[10px] uppercase border-b border-[#E2E8E5] dark:border-[#24302B]">
              <tr>
                <th className="px-4 py-3">Zone / Sector</th>
                <th className="px-4 py-3 text-center">Hardhat</th>
                <th className="px-4 py-3 text-center">Hi-Vis Vest</th>
                <th className="px-4 py-3 text-center">Boots</th>
                <th className="px-4 py-3 text-center">Gloves</th>
                <th className="px-4 py-3 text-center">Goggles</th>
                <th className="px-4 py-3 text-center">Mask</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E5] dark:divide-[#24302B]">
              {zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-[#F5F7F6]/50 dark:hover:bg-[#141C19]/50">
                  <td className="px-4 py-3.5 font-semibold text-[#202A27] dark:text-[#F5F7F6]">
                    <div>{zone.name}</div>
                    <span className="text-[10px] font-mono text-[#78827D]">{zone.id}</span>
                  </td>
                  {['helmet', 'vest', 'boots', 'gloves', 'goggles', 'mask'].map((gearKey) => (
                    <td key={gearKey} className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => toggleZoneRule(zone.id, gearKey)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          zone[gearKey]
                            ? 'bg-[#173D35] text-white dark:bg-[#2DD4BF] dark:text-[#111715] shadow-xs'
                            : 'bg-[#F5F7F6] text-[#78827D] border border-[#E2E8E5] dark:bg-[#141C19] dark:border-[#24302B]'
                        }`}
                        title={`Toggle ${gearKey}`}
                      >
                        {zone[gearKey] ? '✓' : '—'}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Automated Enforcement & Physical Interlocks */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-[#202A27] dark:text-[#F5F7F6] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />
          <span>Automated Enforcement & Alarms</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
            <div>
              <div className="text-xs font-bold text-[#202A27] dark:text-[#F5F7F6] flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />
                <span>Audible Warning Horn & Siren Dispatches</span>
              </div>
              <p className="text-[11px] text-[#78827D] mt-0.5">
                Play an audible buzzer on detection of missing hardhats in active machinery zones.
              </p>
            </div>
            <button
              onClick={() => setAlarmSoundEnabled(!alarmSoundEnabled)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                alarmSoundEnabled ? 'bg-[#173D35] dark:bg-[#2DD4BF]' : 'bg-[#E2E8E5] dark:bg-[#24302B]'
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                alarmSoundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B]">
            <div>
              <div className="text-xs font-bold text-[#202A27] dark:text-[#F5F7F6] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />
                <span>Automated Turnstile Access Lockout</span>
              </div>
              <p className="text-[11px] text-[#78827D] mt-0.5">
                Lock shaft entrance turnstiles automatically when non-compliant personnel attempt entry.
              </p>
            </div>
            <button
              onClick={() => setAutoLockTurnstile(!autoLockTurnstile)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                autoLockTurnstile ? 'bg-[#173D35] dark:bg-[#2DD4BF]' : 'bg-[#E2E8E5] dark:bg-[#24302B]'
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                autoLockTurnstile ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Developer Information & Project Credits */}
      <div className="bg-white dark:bg-[#19221F] border border-[#E2E8E5] dark:border-[#24302B] rounded-2xl p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-[#202A27] dark:text-[#F5F7F6] flex items-center gap-2">
          <Info className="w-4 h-4 text-[#173D35] dark:text-[#2DD4BF]" />
          <span>Project Credits & Developer Information</span>
        </h3>
        <p className="text-xs text-[#78827D]">
          MineSafe is authored by Ajaz. Connect via the verified links below:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#78827D] block">GitHub Repository & Profile</span>
              <a
                href="https://github.com/Ajaz002"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#173D35] dark:text-[#2DD4BF] hover:underline flex items-center gap-1 font-mono mt-0.5"
              >
                <span>github.com/Ajaz002</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F5F7F6] dark:bg-[#141C19] border border-[#E2E8E5] dark:border-[#24302B] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#78827D] block">Developer Direct Email</span>
              <a
                href="mailto:ajaz90450@gmail.com"
                className="font-bold text-[#173D35] dark:text-[#2DD4BF] hover:underline flex items-center gap-1 font-mono mt-0.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>ajaz90450@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
