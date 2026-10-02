import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, EASE } from '../lib/gsap';
import { hero } from '../data/profile';
import { useReducedMotion, useCompactPointer } from '../hooks/useMediaQuery';
import Magnetic from './ui/Magnetic';
import Picture from './ui/Picture';

const HeroField = lazy(() => import('./HeroField.jsx'));

export default function Hero() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const compact = useCompactPointer();
  const [fieldReady, setFieldReady] = useState(false);
  const [motionClipReady, setMotionClipReady] = useState(false);

  // Heavy media is deferred so the headline paints first (LCP).
  useEffect(() => {
    if (reduced) return undefined;
    const field = window.setTimeout(() => setFieldReady(true), 300);
    const clip = window.setTimeout(() => setMotionClipReady(!compact), 1600);
    return () => {
      window.clearTimeout(field);
      window.clearTimeout(clip);
    };
  }, [reduced, compact]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const lines = el.querySelectorAll('[data-line-inner]');

    if (reduced) {
      gsap.set(lines, { yPercent: 0, opacity: 1 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE.out }, delay: 0.25 });

      tl.fromTo(lines, { yPercent: 112, opacity: 0.2 }, { yPercent: 0, opacity: 1, duration: 1.25, stagger: 0.1 })
        .fromTo('.hero__eyebrow', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.1)
        .fromTo('.hero__lede', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=0.75')
        .fromTo('.hero__actions > *', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.09 }, '-=0.62')
        .fromTo('.hero__meta li', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.07 }, '-=0.5')
        .fromTo(
          '.hero__frame',
          { clipPath: 'inset(16% 10% 16% 10%)', opacity: 0 },
          { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.35 },
          0.3
        )
        .fromTo('.hero__hud > *', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.6');
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title" ref={ref}>
      <div className="hero__copy">
        <p className="eyebrow hero__eyebrow">{hero.eyebrow}</p>

        <h1 className="hero__title" id="hero-title">
          <span className="reveal-line">
            <span className="reveal-line__inner" data-line-inner>
              {hero.title[0]}
            </span>
          </span>
          <span className="reveal-line hero__title-outline">
            <span className="reveal-line__inner" data-line-inner>
              {hero.title[1]}
            </span>
          </span>
        </h1>

        <p className="hero__lede">{hero.lede}</p>

        <div className="hero__actions">
          <Magnetic className="btn btn--solid" href={hero.primaryCta.href}>
            {hero.primaryCta.label}
            <span aria-hidden="true">↘</span>
          </Magnetic>
          <a className="link-quiet" href={hero.secondaryCta.href}>
            {hero.secondaryCta.label}
          </a>
        </div>

        <ul className="hero__meta">
          {hero.meta.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="hero__visual">
        <div className="hero__frame">
          <Picture
            src="/assets/hero.jpg"
            webp="/assets/hero.webp"
            alt="Editorial portrait of Hari Charan, high-contrast monochrome"
            className="hero__photo"
            width={1200}
            height={675}
            priority
            sizes="(max-width: 900px) 92vw, 52vw"
          />

          {motionClipReady ? (
            <video
              className="hero__motion"
              src="/assets/portfolio-motion.mp4"
              poster="/assets/hero.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
            />
          ) : null}

          <div className="hero__film" aria-hidden="true" />
        </div>

        {fieldReady ? (
          <Suspense fallback={null}>
            <HeroField />
          </Suspense>
        ) : null}

        <div className="hero__grid" aria-hidden="true" />

        <div className="hero__hud" aria-hidden="true">
          <span>BUILD / REACT · VITE</span>
          <span>MOTION / GSAP · SCROLLTRIGGER</span>
          <span>FIELD / WEBGL</span>
        </div>

        <p className="hero__vertical" aria-hidden="true">
          SYSTEMS / SECURITY / RESEARCH
        </p>

        <p className="hero__index" aria-hidden="true">
          <b>01</b>
          <span>/</span>06
        </p>
      </div>
    </section>
  );
}
