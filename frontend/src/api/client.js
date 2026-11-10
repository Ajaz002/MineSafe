/**
 * MineSafe Frontend API Client
 * Uses same-origin relative URLs proxied through Vite dev server to FastAPI backend (http://127.0.0.1:8000),
 * avoiding any cross-origin/CORS discrepancies between localhost, 127.0.0.1, or remote hosts.
 */

const IS_LOCALHOST =
  typeof window !== 'undefined' &&
  window.location.hostname &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const REMOTE_CANDIDATES = [
  'https://minesafe-ajaz.onrender.com',
  'https://minesafe-azjz.onrender.com'
];

export let API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  : (IS_LOCALHOST ? '' : REMOTE_CANDIDATES[0]);

async function apiFetch(path, options) {
  if (IS_LOCALHOST || import.meta.env.VITE_API_URL) {
    return fetch(`${API_BASE_URL}${path}`, options);
  }
  for (const base of [API_BASE_URL, ...REMOTE_CANDIDATES.filter(b => b !== API_BASE_URL)]) {
    try {
      const res = await fetch(`${base}${path}`, options);
      if (res.status !== 404) {
        API_BASE_URL = base;
        return res;
      }
    } catch {
      // Try next candidate
    }
  }
  return fetch(`${API_BASE_URL}${path}`, options);
}

export function resolveMediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/static')) {
    return API_BASE_URL ? `${API_BASE_URL}${url}` : url;
  }
  return url;
}

async function compressImageForUpload(file, maxDim = 800, quality = 0.82) {
  if (typeof document === 'undefined' || !file || !file.type?.startsWith('image/')) {
    return file;
  }
  return new Promise((resolve) => {
    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objUrl);
      const { width, height } = img;
      if (width <= maxDim && height <= maxDim && file.size <= 150 * 1024) {
        resolve(file);
        return;
      }
      const scale = Math.min(1, maxDim / Math.max(width, height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], (file.name || 'upload').replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      resolve(file);
    };
    img.src = objUrl;
  });
}

export async function detectImageAPI(file, zone = 'Sector Alpha', conf = 0.35, iou = 0.45) {
  const optimizedFile = await compressImageForUpload(file);
  const formData = new FormData();
  formData.append('file', optimizedFile);
  formData.append('zone', zone);
  formData.append('conf_threshold', conf.toString());
  formData.append('iou_threshold', iou.toString());

  const response = await apiFetch(`/api/detect/image`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    let errorDetail = `Inference failed with HTTP status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.detail) {
        errorDetail = errJson.detail;
      }
    } catch {}
    throw new Error(errorDetail);
  }
  return await response.json();
}

export async function detectFrameAPI(base64Frame, conf = 0.35) {
  const formData = new FormData();
  formData.append('frame_data', base64Frame);
  formData.append('conf_threshold', conf.toString());

  const response = await apiFetch(`/api/detect/frame`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    let errorDetail = `Frame inference failed (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.detail) errorDetail = errJson.detail;
    } catch {}
    throw new Error(errorDetail);
  }
  return await response.json();
}

export async function detectVideoAPI(file, zone = 'Sector Alpha', conf = 0.35, iou = 0.45, frameStride = 5) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('zone', zone);
  formData.append('conf_threshold', conf.toString());
  formData.append('iou_threshold', iou.toString());
  formData.append('frame_stride', frameStride.toString());

  const response = await apiFetch(`/api/detect/video`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    let errorDetail = `Video processing failed (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.detail) errorDetail = errJson.detail;
    } catch {}
    throw new Error(errorDetail);
  }
  return await response.json();
}

export async function saveWebcamSessionAPI(sessionData) {
  const formData = new FormData();
  formData.append('zone', sessionData.zone || 'Sector Alpha');
  formData.append('duration_seconds', (sessionData.duration_seconds || 0).toString());
  formData.append('total_frames', (sessionData.total_frames || 0).toString());
  formData.append('total_workers', (sessionData.total_workers || 0).toString());
  formData.append('total_violations', (sessionData.total_violations || 0).toString());
  formData.append('compliance_rate', (sessionData.compliance_rate || 100).toString());
  formData.append('is_compliant', (sessionData.is_compliant !== false).toString());
  if (sessionData.snapshot_base64) {
    formData.append('snapshot_base64', sessionData.snapshot_base64);
  }

  const response = await apiFetch(`/api/detect/webcam/session`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Failed to save webcam session (${response.status})`);
  }
  return await response.json();
}

export async function fetchAnalyticsAPI() {
  try {
    const res = await apiFetch(`/api/analytics/summary`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchHistoryAPI(limit = 50) {
  try {
    const res = await apiFetch(`/api/history?limit=${limit}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchSystemHealthAPI() {
  try {
    const res = await apiFetch(`/api/system/health`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchSettingsAPI() {
  try {
    const res = await apiFetch(`/api/settings`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return null;
  }
}

export async function updateSettingsAPI(settings) {
  const res = await apiFetch(`/api/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  return await res.json();
}
