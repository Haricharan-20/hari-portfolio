import { useEffect, useState } from 'react';

const read = (query) =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false;

/** Subscribe to a media query without layout thrash. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => read(query));

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;

    const mql = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);

    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** Coarse pointer = touch-first device; used to simplify heavy visuals. */
export const useCompactPointer = () => useMediaQuery('(max-width: 900px), (pointer: coarse)');
