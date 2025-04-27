// File: src/utils/timeUtils.ts

/**
 * Formats an ISO timestamp into a human-readable time string.
 * Returns '—' for invalid or missing inputs.
 */
export function formatTime(iso?: string): string {
  if (!iso) return '—';
  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch {
    return '—';
  }
}

/**
 * Formats a duration in minutes into 'Xh Ym' or 'Zm'.
 */
export function formatHM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}