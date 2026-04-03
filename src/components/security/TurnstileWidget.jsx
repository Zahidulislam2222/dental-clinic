/**
 * Cloudflare Turnstile CAPTCHA Widget
 * FLOW-CAPTCHA-001: Protects public forms from bot submissions
 *
 * Usage:
 *   <TurnstileWidget onVerify={(token) => setTurnstileToken(token)} />
 *
 * Requires VITE_TURNSTILE_SITE_KEY environment variable.
 * Get keys from: https://dash.cloudflare.com/?to=/:account/turnstile
 */

import { useEffect, useRef, useCallback } from 'react';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const SCRIPT_ID = 'cf-turnstile-script';

export const isTurnstileConfigured = Boolean(TURNSTILE_SITE_KEY) && !TURNSTILE_SITE_KEY?.includes('placeholder');

export default function TurnstileWidget({ onVerify, onError, onExpire, theme = 'light', size = 'normal' }) {
  const containerRef = useRef(null);
  const widgetId = useRef(null);

  const handleVerify = useCallback((token) => {
    onVerify?.(token);
  }, [onVerify]);

  useEffect(() => {
    if (!isTurnstileConfigured) return;

    // Load Turnstile script if not already loaded
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Wait for script to load and render widget
    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current) return;

      // Clean up existing widget
      if (widgetId.current !== null) {
        try { window.turnstile.remove(widgetId.current); } catch { /* ignore */ }
      }

      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: handleVerify,
        'error-callback': onError,
        'expired-callback': onExpire,
        theme,
        size,
      });
    };

    // Poll for script load (max 10s)
    const interval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(interval);
        renderWidget();
      }
    }, 200);
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      if (widgetId.current !== null && window.turnstile) {
        try { window.turnstile.remove(widgetId.current); } catch { /* ignore */ }
      }
    };
  }, [handleVerify, onError, onExpire, theme, size]);

  if (!isTurnstileConfigured) return null;

  return <div ref={containerRef} className="flex justify-center my-3" />;
}
