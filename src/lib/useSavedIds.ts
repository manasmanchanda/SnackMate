import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { fetchSavedProductIds, removeSavedProduct, saveSnack } from '@/lib/passportApi';

export function useSavedIds() {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!user) {
      setSavedIds(new Set());
      return;
    }
    (async () => {
      try {
        const ids = await fetchSavedProductIds();
        if (!active) return;
        setSavedIds(new Set(ids));
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Could not load your saved snacks.');
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const toggleSaved = useCallback(
    async (productId: string) => {
      setError(null);
      if (!user) {
        setError('Sign in to save snacks to your passport.');
        return;
      }
      try {
        if (savedIds.has(productId)) {
          await removeSavedProduct(productId);
          setSavedIds((current) => {
            const next = new Set(current);
            next.delete(productId);
            return next;
          });
        } else {
          await saveSnack(productId);
          setSavedIds((current) => new Set(current).add(productId));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not update your passport. Please try again.');
      }
    },
    [savedIds, user],
  );

  return { savedIds, toggleSaved, error };
}
