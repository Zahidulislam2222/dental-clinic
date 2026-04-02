import DOMPurify from 'dompurify';

/**
 * Sanitize a single string — strips all HTML tags, returns plain text only.
 */
export const sanitizeText = (input) => {
  if (typeof input !== 'string') return input;
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }).trim();
};

/**
 * Sanitize all string values in a flat object (one level deep).
 */
export const sanitizeFormData = (data) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(data)) {
    cleaned[key] = typeof value === 'string' ? sanitizeText(value) : value;
  }
  return cleaned;
};
