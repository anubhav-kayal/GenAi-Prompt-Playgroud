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

const sanitizeUrl = (value, maxLength = 2048) => {
  const url = sanitizeText(value, maxLength);
  if (!url) return '';

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return '';
};

const getAvatarFromProfile = (profile) => {
  if (!profile || typeof profile !== 'object') return '';

  return (
    sanitizeUrl(profile.avatar) ||
    sanitizeUrl(profile.photoURL) ||
    sanitizeUrl(profile.picture) ||
    sanitizeUrl(profile.imageUrl) ||
    ''
  );
};

export const getDefaultAvatar = (seed = 'Guest') => {
  const safeSeed = sanitizeText(seed, 80) || 'Guest';
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(safeSeed)}`;
};

export const buildUserProfile = (profile, fallbackProfile = {}) => {
  const name = sanitizeText(profile?.name, 80) || sanitizeText(fallbackProfile.name, 80) || 'Nexus User';
  const email = sanitizeText(profile?.email, 120) || sanitizeText(fallbackProfile.email, 120) || 'No email connected';
  const avatar =
    getAvatarFromProfile(profile) ||
    getAvatarFromProfile(fallbackProfile) ||
    getDefaultAvatar(name || email);

  return { name, email, avatar };
};

export const normalizeUserProfile = (profile) => {
  if (!profile || typeof profile !== 'object') return null;

  const name = sanitizeText(profile.name, 80) || sanitizeText(profile.displayName, 80);
  const email = sanitizeText(profile.email, 120);
  const avatar = getAvatarFromProfile(profile);

  if (!name || !email) return null;
  return {
    name,
    email,
    avatar: avatar || getDefaultAvatar(name || email),
  };
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
