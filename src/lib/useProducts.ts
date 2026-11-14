import { useCallback, useEffect, useState } from 'react';
import { fetchProducts } from '@/lib/productApi';
import type { Product } from '@/lib/productModel';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setProducts(await fetchProducts());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  return { products, loading, error, reload: load };
}
