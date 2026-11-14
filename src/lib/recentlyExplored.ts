const STORAGE_KEY = 'snackmate-recently-explored';
const MAX_ITEMS = 6;

export function readRecentlyExplored(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function rememberExplored(productId: string) {
  const next = [productId, ...readRecentlyExplored().filter((id) => id !== productId)].slice(0, MAX_ITEMS);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable in private browsing; the history is optional.
  }
}
