'use client';

const TOKEN_KEYS = ['userToken', 'garja_token', 'token'] as const;

const getTokenFromCookies = (): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookieMap = document.cookie
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean);

  for (const key of TOKEN_KEYS) {
    const match = cookieMap.find((cookie) => cookie.startsWith(`${key}=`));
    if (match) {
      const [, value = ''] = match.split('=');
      if (value) {
        return decodeURIComponent(value);
      }
    }
  }

  return null;
};

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  for (const key of TOKEN_KEYS) {
    const value = window.localStorage.getItem(key);
    if (value) {
      return value;
    }
  }

  return getTokenFromCookies();
};

export const hasStoredToken = (): boolean => !!getStoredToken();
