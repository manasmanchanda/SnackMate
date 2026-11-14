import { useEffect, useState } from 'react';

export type Route = {
  segments: string[];
  params: URLSearchParams;
};

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  const segments = path.split('/').filter(Boolean);
  return { segments, params: new URLSearchParams(query) };
}

export function navigate(to: string) {
  window.location.hash = to;
}

export function useRoute(): Route {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return parseHash(hash);
}
