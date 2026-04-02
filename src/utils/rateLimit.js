/**
 * Client-side rate limiter using localStorage.
 * Prevents form spam by tracking submission timestamps.
 *
 * @param {string} key    — unique identifier (e.g. 'contact-form')
 * @param {number} max    — max submissions allowed in the window (default 3)
 * @param {number} windowMs — time window in ms (default 5 minutes)
 * @returns {{ canSubmit: boolean, remainingMs: number }}
 */
export const checkRateLimit = (key, max = 3, windowMs = 5 * 60 * 1000) => {
  const storageKey = `eds-rate-${key}`;
  const now = Date.now();

  let timestamps = [];
  try {
    timestamps = JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch {
    timestamps = [];
  }

  // Keep only timestamps within the window
  timestamps = timestamps.filter((ts) => now - ts < windowMs);

  if (timestamps.length >= max) {
    const oldest = timestamps[0];
    const remainingMs = windowMs - (now - oldest);
    return { canSubmit: false, remainingMs };
  }

  // Record this submission
  timestamps.push(now);
  localStorage.setItem(storageKey, JSON.stringify(timestamps));
  return { canSubmit: true, remainingMs: 0 };
};

/**
 * Format remaining cooldown time for user display.
 */
export const formatCooldown = (ms) => {
  const minutes = Math.ceil(ms / 60000);
  return minutes <= 1 ? 'less than a minute' : `${minutes} minutes`;
};
