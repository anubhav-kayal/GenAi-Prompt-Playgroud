const AUTH_CACHE_KEY = 'nexus_user';

const safeJsonParse = (value, fallback = null) => {
  if (typeof value !== 'string' || value.trim() === '') return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const sanitizeText = (value, maxLength) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

export const normalizeUserProfile = (profile) => {
  if (!profile || typeof profile !== 'object') return null;

  const name = sanitizeText(profile.name, 80);
  const email = sanitizeText(profile.email, 120);
  const avatar = sanitizeText(profile.avatar, 500);

  if (!name || !email) return null;
  return { name, email, avatar };
};

export const cacheUserProfile = (profile) => {
  const normalized = normalizeUserProfile(profile);
  if (!normalized) return null;

  sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(normalized));
  return normalized;
};

export const getCachedUserProfile = () => {
  const fromSession = normalizeUserProfile(safeJsonParse(sessionStorage.getItem(AUTH_CACHE_KEY), null));
  if (fromSession) return fromSession;

  // Backward compatibility with old storage shape.
  const fromLegacyLocal = normalizeUserProfile(safeJsonParse(localStorage.getItem(AUTH_CACHE_KEY), null));
  if (!fromLegacyLocal) return null;

  sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(fromLegacyLocal));
  localStorage.removeItem(AUTH_CACHE_KEY);
  return fromLegacyLocal;
};

export const clearCachedUserProfile = () => {
  sessionStorage.removeItem(AUTH_CACHE_KEY);
  localStorage.removeItem(AUTH_CACHE_KEY);
};

export const getSafeStoredObject = (storageKey, fallback = null) => {
  return safeJsonParse(localStorage.getItem(storageKey), fallback);
};