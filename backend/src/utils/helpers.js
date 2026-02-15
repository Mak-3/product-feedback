/**
 * Paginate query results
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {{ from: number, to: number }}
 */
export const paginate = (page = 1, limit = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to };
};

/**
 * Generate a unique slug from text
 * @param {string} text - Text to slugify
 * @returns {string}
 */
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Delay execution (useful for rate limiting)
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));




