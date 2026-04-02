/**
 * Server-side input sanitization (Deno-compatible)
 * Strips HTML tags and normalizes whitespace
 */

export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  // Strip all HTML tags
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function sanitizeFormData(data: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    cleaned[key] = typeof value === 'string' ? sanitizeText(value) : value;
  }
  return cleaned;
}
