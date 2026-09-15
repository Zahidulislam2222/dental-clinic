// @ts-check
/** @param {Record<string, string | boolean | undefined>} env */
export function readRuntime(env) {
  const siteUrl = new URL(String(env.VITE_SITE_URL || 'https://dental.zahidul-islam.com'));
  if (siteUrl.protocol !== 'https:' || siteUrl.username || siteUrl.password || siteUrl.search || siteUrl.hash || siteUrl.pathname !== '/') {
    throw new Error('VITE_SITE_URL must be an HTTPS origin without credentials or query parameters.');
  }
  if (env.VITE_APP_MODE && env.VITE_APP_MODE !== 'synthetic') {
    throw new Error('This release supports synthetic demonstration mode only.');
  }
  return Object.freeze({
    mode: 'synthetic',
    siteUrl: siteUrl.origin,
    clinicalEnabled: false,
    inactivityWarningMs: 14 * 60 * 1000,
    inactivityLogoutMs: 15 * 60 * 1000,
    sessionChannel: 'eds-session-sync',
    languageStorageKey: 'eds-language',
    maxAuditEvents: 50,
  });
}

export const runtime = readRuntime(import.meta.env ?? {});
