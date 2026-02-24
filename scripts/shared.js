/**
 * Create an element with attributes and optional content.
 * @param {string} tag - Tag name
 * @param {Record<string, string>} attributes - Attribute key-value pairs
 * @param {Element|Element[]|string|null} [content] - Child elements or text
 * @returns {Element}
 */

// eslint-disable-next-line import/prefer-default-export
export function createTag(tag, attributes = {}, content = null) {
  const el = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    el.setAttribute(key, String(value));
  });

  if (content !== null && content !== undefined) {
    if (Array.isArray(content)) {
      content.forEach((item) => {
        if (item != null) el.append(item);
      });
    } else {
      el.append(content);
    }
  }

  return el;
}

/**
 * Format a date value for display.
 * @param {string|number} dateValue - Date string or timestamp
 * @returns {string} Formatted date string
 */
export function formatDate(dateValue) {
  if (!dateValue) return '';
  const normalized = String(dateValue).trim();
  if (!normalized) return '';

  let date;
  if (/^[0-9]+$/.test(normalized)) {
    const ts = Number(normalized);
    date = new Date(ts < 1e12 ? ts * 1000 : ts);
  } else {
    date = new Date(normalized);
  }

  if (Number.isNaN(date.getTime())) return normalized;

  const formattedDateString = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return formattedDateString;
}
