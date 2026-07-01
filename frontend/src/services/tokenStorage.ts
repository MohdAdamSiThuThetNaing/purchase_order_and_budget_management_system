/**
 * Token storage strategy:
 * - Access token: kept ONLY in memory (React state, see AuthContext). Never
 *   written to localStorage/sessionStorage, so it can't be read by an XSS
 *   payload that dumps storage, and it naturally disappears on tab close.
 * - Refresh token: persisted in localStorage so a page refresh doesn't force
 *   re-login. This is a deliberate tradeoff for an assessment-scope SPA;
 *   in a production system the refresh token would instead live in an
 *   httpOnly, Secure, SameSite=strict cookie set by the backend, which is
 *   immune to XSS exfiltration entirely. Documented here intentionally so
 *   it can be discussed in review rather than discovered as an oversight.
 */
const REFRESH_TOKEN_KEY = "po_budget_refresh_token";

export const refreshTokenStorage = {
  get(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  set(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  clear(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
