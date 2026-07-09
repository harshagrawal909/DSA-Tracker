/**
 * Payment status helpers using cookies so middleware can read them.
 * Call these only on the client side.
 */

const COOKIE_NAME = "dsa_access";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

/**
 * Mark a user as paid. Stores a cookie that middleware can read.
 * @param {string} userId - the user's unique id (from Google account)
 */
export function setPaymentStatus(userId) {
  if (typeof document === "undefined") return;
  // Encode userId into cookie value so multiple users on same browser are tracked
  let existing = getPaidUsers();
  existing[userId] = Date.now();
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(existing))}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

/**
 * Check if a specific userId has paid.
 * @param {string} userId
 */
export function hasUserPaid(userId) {
  if (typeof document === "undefined") return false;
  const users = getPaidUsers();
  return !!users[userId];
}

function getPaidUsers() {
  if (typeof document === "undefined") return {};
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return {};
  try {
    const raw = decodeURIComponent(match.split("=").slice(1).join("="));
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}
