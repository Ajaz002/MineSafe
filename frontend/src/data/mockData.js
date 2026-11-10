/**
 * MineSafe Mock & Configuration Data
 * Tagged clearly as [DEMO DATA] for demonstration purposes.
 * Ready for connection to the FastAPI YOLO11s inference backend.
 */

export const CLASS_METADATA = {
  0: { name: 'person', label: 'Worker / Person', category: 'worker', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', isViolation: false },
  1: { name: 'helmet', label: 'Safety Helmet', category: 'compliant', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', isViolation: false },
  2: { name: 'no_helmet', label: 'NO HELMET', category: 'violation', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', isViolation: true },
  3: { name: 'vest', label: 'Hi-Vis Vest', category: 'compliant', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', isViolation: false },
  4: { name: 'no_vest', label: 'NO VEST', category: 'violation', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', isViolation: true },
  5: { name: 'gloves', label: 'Safety Gloves', category: 'compliant', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', isViolation: false },
  6: { name: 'no_gloves', label: 'NO GLOVES', category: 'violation', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', isViolation: true },
  7: { name: 'goggles', label: 'Safety Goggles', category: 'compliant', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', isViolation: false },
  8: { name: 'no_goggle', label: 'NO GOGGLES', category: 'violation', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', isViolation: true },
  9: { name: 'boots', label: 'Steel-Toe Boots', category: 'compliant', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', isViolation: false },
  10: { name: 'no_boots', label: 'NO BOOTS', category: 'violation', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', isViolation: true },
  11: { name: 'mask', label: 'Dust / Respiration Mask', category: 'compliant', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', isViolation: false },
  12: { name: 'forklift', label: 'Forklift / Heavy Machinery', category: 'machinery', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)', isViolation: false }
};

export const SITE_METRICS = {
  activeWorkers: 42,
  totalDetectionsToday: 14820,
  overallComplianceRate: 91.4,
  complianceRateChange: '+2.8%',
  activeViolationsCount: 14,
  inspectedFrames: 48920,
  monitoredZones: 6,
  modelStatus: {
    name: 'YOLO11s-MineSafe',
    classes: 13,
    status: 'ONLINE',
    latency: '3.8 ms',
    fps: '263 FPS',
    precision: '84.6% (Target)',
    device: 'MineSafe Industrial Vision Engine (Edge)'
  }
};

export const EQUIPMENT_STATS = [
  { name: 'Head Protection', item: 'Safety Helmet', compliantRate: 95.8, violations: 4, icon: 'HardHat', status: 'optimal' },
  { name: 'Torso Visibility', item: 'Hi-Vis Vest', compliantRate: 93.2, violations: 7, icon: 'Shirt', status: 'optimal' },
  { name: 'Hand Protection', item: 'Safety Gloves', compliantRate: 88.5, violations: 12, icon: 'Hand', status: 'attention' },
  { name: 'Eye Protection', item: 'Safety Goggles', compliantRate: 84.1, violations: 16, icon: 'Glasses', status: 'warning' },
  { name: 'Footwear Safety', item: 'Steel-Toe Boots', compliantRate: 97.4, violations: 2, icon: 'Footprints', status: 'optimal' },
  { name: 'Respiratory', item: 'Dust Mask', compliantRate: 89.0, violations: 9, icon: 'ShieldAlert', status: 'attention' }
];

export const RECENT_AUDIT_LOGS = [
  {
    id: 'AUD-8921',
    timestamp: '2026-11-10 13:42:15',
    zone: 'Underground Shaft B4',
    camera: 'CAM-04 (High-Speed Dome)',
    status: 'VIOLATION',
    personId: 'WRK-104',
    violations: ['no_helmet', 'no_goggle'],
    complianceScore: 60,
    confidence: 0.94,
    snapshotUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    actionTaken: 'Audio Alarm Dispatched'
  },
  {
    id: 'AUD-8920',
    timestamp: '2026-11-10 13:40:02',
    zone: 'Haulage Loading Deck',
    camera: 'CAM-02 (Perimeter Telephoto)',
    status: 'COMPLIANT',
    personId: 'WRK-088',
    violations: [],
    complianceScore: 100,
    confidence: 0.98,
    snapshotUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80',
    actionTaken: 'Logged'
  },
  {
    id: 'AUD-8919',
    timestamp: '2026-11-10 13:37:44',
    zone: 'Mineral Processing Pit 2',
    camera: 'CAM-07 (Thermal PTZ)',
    status: 'VIOLATION',
    personId: 'WRK-219',
    violations: ['no_vest'],
    complianceScore: 80,
    confidence: 0.91,
    snapshotUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    actionTaken: 'Shift Supervisor Notified'
  },
  {
    id: 'AUD-8918',
    timestamp: '2026-11-10 13:31:10',
    zone: 'Main Equipment Workshop',
    camera: 'CAM-01 (Wide Angle 4K)',
    status: 'CRITICAL',
    personId: 'WRK-033',
    violations: ['no_helmet', 'no_boots', 'no_gloves'],
    complianceScore: 40,
    confidence: 0.96,
    snapshotUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    actionTaken: 'Access Turnstile Locked'
  },
  {
    id: 'AUD-8917',
    timestamp: '2026-11-10 13:28:55',
    zone: 'Conveyor Gallery East',
    camera: 'CAM-03 (Explosion-Proof Fixed)',
    status: 'COMPLIANT',
    personId: 'WRK-012',
    violations: [],
    complianceScore: 100,
    confidence: 0.97,
    snapshotUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
    actionTaken: 'Logged'
  }
];

export const HOURLY_COMPLIANCE_TREND = [
  { time: '06:00', compliance: 96, violations: 2, detections: 420 },
  { time: '07:00', compliance: 94, violations: 5, detections: 980 },
  { time: '08:00', compliance: 89, violations: 14, detections: 1450 },
  { time: '09:00', compliance: 87, violations: 18, detections: 1680 },
  { time: '10:00', compliance: 91, violations: 11, detections: 1520 },
  { time: '11:00', compliance: 93, violations: 8, detections: 1490 },
  { time: '12:00', compliance: 88, violations: 15, detections: 1120 },
  { time: '13:00', compliance: 92, violations: 9, detections: 1380 },
  { time: '14:00', compliance: 95, violations: 6, detections: 1410 }
];

export const VIOLATION_DISTRIBUTION = [
  { name: 'Missing Goggles', count: 48, fill: '#f87171' },
  { name: 'Missing Gloves', count: 36, fill: '#fb923c' },
  { name: 'Missing Vest', count: 24, fill: '#fbbf24' },
  { name: 'Missing Mask', count: 19, fill: '#a3e635' },
  { name: 'Missing Helmet', count: 12, fill: '#ef4444' },
  { name: 'Missing Boots', count: 5, fill: '#dc2626' }
];

export const ZONE_STATUS = [
  { id: 'Z1', name: 'Underground Shaft B4', risk: 'HIGH', workers: 14, compliance: 84, cameras: 3 },
  { id: 'Z2', name: 'Haulage Loading Deck', risk: 'MEDIUM', workers: 8, compliance: 92, cameras: 2 },
  { id: 'Z3', name: 'Mineral Processing Pit', risk: 'HIGH', workers: 11, compliance: 88, cameras: 4 },
  { id: 'Z4', name: 'Main Equipment Workshop', risk: 'LOW', workers: 5, compliance: 98, cameras: 2 },
  { id: 'Z5', name: 'Conveyor Gallery East', risk: 'MEDIUM', workers: 4, compliance: 95, cameras: 2 }
];

export const DEMO_PRESET_IMAGES = [
  {
    id: 'scene-1',
    title: 'Extraction Pit Operation',
    category: 'Compliant Mining',
    description: 'Ground personnel in extraction zone wearing standard protective gear.',
    url: '/samples/sample_mining_1.jpg',
  },
  {
    id: 'scene-violation',
    title: 'Safety Violation (Missing PPE)',
    category: 'Violation Flagged',
    description: 'Ground worker detected without mandatory helmet, hi-vis vest, and gloves.',
    url: '/samples/sample_violation_worker.jpg',
  },
  {
    id: 'scene-multi',
    title: 'Multi-Personnel Staging Crew',
    category: 'Multiple Workers',
    description: 'Active construction crew inspected for simultaneous multi-worker PPE compliance.',
    url: '/samples/sample_multi_workers.jpg',
  },
  {
    id: 'scene-machinery',
    title: 'Heavy Machinery & Forklift Zone',
    category: 'Hazard Perimeter',
    description: 'Forklift proximity hazard check with personnel in transport perimeter.',
    url: '/samples/sample_machinery_hazard.jpg',
  },
  {
    id: 'scene-zero-workers',
    title: 'Empty Haulage Zone (0 Workers)',
    category: 'Zero Workers Check',
    description: 'Zone with equipment and infrastructure but zero workers to test N/A compliance.',
    url: '/samples/sample_zero_workers.jpg',
  }
];

export const DEMO_PRESET_VIDEOS = [
  {
    id: 'demo-video-1',
    title: 'Active Construction Worksite',
    description: 'Full footage of active personnel on site for frame-by-frame compliance scanning.',
    url: '/samples/demo_construction_site.mp4',
    duration: '8.1s',
    resolution: '4K / 720p'
  },
  {
    id: 'demo-video-2',
    title: 'Worksite Inspection Clip',
    description: 'Compact 5-second worksite inspection clip for high-throughput batch detection.',
    url: '/samples/sample_construction_workers.mp4',
    duration: '5.0s',
    resolution: '720p HD'
  }
];
