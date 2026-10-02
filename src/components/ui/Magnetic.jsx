import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useMediaQuery';

/**
 * Pointer-follow interaction for primary actions.
 * Pointer-device only, disabled for reduced motion, and cleaned up on unmount.
 */
export default function Magnetic({ as: Tag = 'a', className = '', strength = 0.16, children, ...rest }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return undefined;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' });

    const onMove = (event) => {
      const box = el.getBoundingClientRect();
      xTo((event.clientX - (box.left + box.width / 2)) * strength);
      yTo((event.clientY - (box.top + box.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.set(el, { clearProps: 'transform' });
    };
  }, [reduced, strength]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
