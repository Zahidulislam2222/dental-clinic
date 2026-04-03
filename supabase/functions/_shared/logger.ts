/**
 * Structured Logging Utility
 * SEC-CONSOLE-001: Replace console.error with structured JSON logging
 *
 * In production, Supabase Edge Functions log to Logflare.
 * Structured logs enable better search, filtering, and alerting.
 *
 * IMPORTANT: Never include PHI in log messages.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogEntry {
  level: LogLevel;
  function_name: string;
  message: string;
  error_code?: string;
  timestamp: string;
  [key: string]: unknown;
}

function log(level: LogLevel, functionName: string, message: string, extra: Record<string, unknown> = {}) {
  const entry: LogEntry = {
    level,
    function_name: functionName,
    message,
    timestamp: new Date().toISOString(),
    ...extra,
  };

  // Use appropriate console method for log level routing
  const output = JSON.stringify(entry);
  switch (level) {
    case 'debug': console.debug(output); break;
    case 'info':  console.info(output);  break;
    case 'warn':  console.warn(output);  break;
    case 'error': console.error(output); break;
    case 'fatal': console.error(output); break;
  }
}

/**
 * Create a scoped logger for an Edge Function.
 *
 * Usage:
 *   const log = createLogger('submit-form');
 *   log.error('Submission failed', { error_code: 'VALIDATION' });
 */
export function createLogger(functionName: string) {
  return {
    debug: (msg: string, extra?: Record<string, unknown>) => log('debug', functionName, msg, extra),
    info:  (msg: string, extra?: Record<string, unknown>) => log('info',  functionName, msg, extra),
    warn:  (msg: string, extra?: Record<string, unknown>) => log('warn',  functionName, msg, extra),
    error: (msg: string, extra?: Record<string, unknown>) => log('error', functionName, msg, extra),
    fatal: (msg: string, extra?: Record<string, unknown>) => log('fatal', functionName, msg, extra),
  };
}
