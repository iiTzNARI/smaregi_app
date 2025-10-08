// lib/session.ts

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem('smaregi_access_token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem('smaregi_refresh_token');
}

export function setSessionTokens(accessToken: string, refreshToken?: string) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem('smaregi_access_token', accessToken);
  if (refreshToken) {
    window.sessionStorage.setItem('smaregi_refresh_token', refreshToken);
  }
}

export function clearSessionTokens() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem('smaregi_access_token');
  window.sessionStorage.removeItem('smaregi_refresh_token');
}
