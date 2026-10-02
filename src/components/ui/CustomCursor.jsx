import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useMediaQuery';

export default function CustomCursor() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const ring = el.querySelector('.cursor__ring');
    const dot = el.querySelector('.cursor__dot');
    const x = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power3.out' });
    const onMove = (event) => { x(event.clientX); y(event.clientY); };
    const onOver = (event) => {
      if (event.target.closest('a, button, .viewer__canvas')) el.classList.add('is-active');
    };
    const onOut = (event) => {
      if (event.target.closest('a, button, .viewer__canvas')) el.classList.remove('is-active');
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      gsap.killTweensOf([el, ring, dot]);
    };
  }, [reduced]);

  return <div className="cursor" ref={ref} aria-hidden="true"><span className="cursor__ring" /><span className="cursor__dot" /></div>;
}
