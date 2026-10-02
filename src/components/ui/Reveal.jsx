import { useLayoutEffect, useRef } from 'react';
import { gsap, EASE } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useMediaQuery';

/**
 * Splits a string into animatable characters.
 *
 * The animated copy is hidden from assistive technology and a plain copy is
 * exposed instead, so screen readers never read a word letter by letter.
 */
export function SplitChars({ text, className = '', charClassName = 'split-char', srOnly = true }) {
  return (
    <>
      <span className={'split-text ' + className} aria-hidden="true">
        {Array.from(text).map((char, index) => (
          <span className={charClassName} key={index}>
            {char === ' ' ? '\u00a0' : char}
          </span>
        ))}
      </span>
      {srOnly ? <span className="sr-only">{text}</span> : null}
    </>
  );
}

/**
 * Masked line reveal used for every large heading on the site.
 * Lines are real text nodes, so headings stay selectable and crawlable.
 */
export function RevealLines({
  lines = [],
  as: Tag = 'h2',
  id,
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.085,
  start = 'top 88%',
  trigger,
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const targets = el.querySelectorAll('[data-line-inner]');
    if (!targets.length) return undefined;

    if (reduced) {
      gsap.set(targets, { yPercent: 0, opacity: 1 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { yPercent: 112, opacity: 0.2 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.15,
          ease: EASE.out,
          stagger,
          delay,
          scrollTrigger: { trigger: trigger?.current || el, start, once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [reduced, delay, stagger, start, trigger]);

  return (
    <Tag ref={ref} id={id} className={className} {...rest}>
      {lines.map((line, index) => (
        <span className={'reveal-line ' + lineClassName} key={typeof line === 'string' ? line : index}>
          <span className="reveal-line__inner" data-line-inner>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Generic entrance reveal for blocks, lists and figures. */
export function Reveal({ children, as: Tag = 'div', className = '', y = 26, delay = 0, start = 'top 88%', stagger = 0, selector }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;

    const targets = selector ? el.querySelectorAll(selector) : [el];
    if (!targets.length) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: EASE.out,
          delay,
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [reduced, y, delay, start, stagger, selector]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Small hook used by scenes that need a stable "has mounted" flag. */
export function useHasMounted() {
  const ref = useRef(false);
  useLayoutEffect(() => {
    ref.current = true;
  }, []);
  return ref;
}
