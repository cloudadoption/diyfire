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

/**
 * Normalize path (ensure leading slash).
 * @param {string} path - Path string
 * @returns {string}
 */
export function normalizePath(path = '') {
  if (!path) return '#';
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Parse comma-separated keywords into array.
 * @param {string} raw - Raw string
 * @returns {string[]}
 */
export function parseKeywords(raw = '') {
  return String(raw)
    .split(',')
    .map((keyword) => keyword.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Get keywords from article object.
 * @param {Object} article - Article data
 * @returns {string}
 */
export function getArticleKeywords(article = {}) {
  return String(article.keywords || '');
}

/**
 * Get content timestamp from entry.
 * @param {Object} entry - Content entry
 * @returns {number}
 */
export function getContentTimestamp(entry = {}) {
  const value = entry.lastModified || entry.date || entry.publisheddate;
  if (!value) return 0;
  if (/^[0-9]+$/.test(String(value))) return Number(value);
  const parsed = Date.parse(String(value));
  return Number.isNaN(parsed) ? 0 : parsed;
}

/** Default page size for query-index pagination */
export const QUERY_INDEX_PAGE_SIZE = 200;

/**
 * Fetch a page of query-index.
 * @param {number} offset - Offset
 * @param {number} limit - Limit
 * @param {string} [baseUrl=''] - Base URL
 * @returns {Promise<Array>}
 */
export async function fetchQueryIndexPage(offset, limit, baseUrl = '') {
  const path = `/query-index.json?offset=${offset}&limit=${limit}`;
  const url = baseUrl ? `${String(baseUrl).replace(/\/+$/, '')}${path}` : path;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Query index request failed: ${resp.status}`);
  const json = await resp.json();
  return json?.data || [];
}

/**
 * Fetch all rows from query-index by paginating.
 * @param {{ pageSize?: number, baseUrl?: string }} [options]
 * @returns {Promise<Array>}
 */
export async function fetchQueryIndexAll(options = {}) {
  const { pageSize = QUERY_INDEX_PAGE_SIZE, baseUrl = '' } = options;

  async function fetchPage(offset, acc) {
    const rows = await fetchQueryIndexPage(offset, pageSize, baseUrl);
    if (!rows.length) return acc;
    const next = [...acc, ...rows];
    return rows.length === pageSize ? fetchPage(offset + rows.length, next) : next;
  }

  return fetchPage(0, []);
}

/**
 * Normalize URL or path to canonical path (no trailing slash).
 * @param {string} href - URL or path
 * @param {string} [base] - Base URL
 * @returns {string}
 */
export function pathFromHref(href, base = typeof window !== 'undefined' ? window.location.origin : '') {
  try {
    const u = new URL(href, base);
    return u.pathname.replace(/\/+$/, '') || '/';
  } catch {
    return '';
  }
}

/**
 * Shuffle array (Fisher–Yates). Returns new array.
 * @param {Array} arr - Input array
 * @returns {Array}
 */
export function shuffle(arr) {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}
