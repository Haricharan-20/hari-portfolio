import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, EASE } from '../lib/gsap';
import { hero } from '../data/profile';
import { useReducedMotion, useCompactPointer } from '../hooks/useMediaQuery';
import Magnetic from './ui/Magnetic';

export default function Hero() {
  const ref = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const reduced = useReducedMotion();
  const compact = useCompactPointer();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const syncPlayback = () => {
      if (reduced || document.hidden) {
        video.pause();
        return;
      }
      video.play().catch(() => {});
    };

    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);
    return () => document.removeEventListener('visibilitychange', syncPlayback);
  }, [reduced]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced || compact) return undefined;

    const pointer = { x: 50, y: 50, strength: 0 };
    const settle = gsap.to(pointer, { x: 50, y: 50, strength: 0, paused: true });
    const render = () => {
      stage.style.setProperty('--signal-x', `${pointer.x}%`);
      stage.style.setProperty('--signal-y', `${pointer.y}%`);
      stage.style.setProperty('--signal-strength', pointer.strength.toFixed(3));
    };
    const onMove = (event) => {
      const bounds = stage.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 100;
      pointer.y = ((event.clientY - bounds.top) / bounds.height) * 100;
      pointer.strength = Math.min(1, pointer.strength + 0.18);
      settle.kill();
      gsap.to(pointer, { strength: 0, duration: 1.2, ease: 'power3.out', onUpdate: render });
      render();
    };
    const onLeave = () => {
      settle.kill();
      gsap.to(pointer, { x: 50, y: 50, strength: 0, duration: 1.3, ease: EASE.out, onUpdate: render });
    };

    stage.addEventListener('pointermove', onMove, { passive: true });
    stage.addEventListener('pointerleave', onLeave, { passive: true });
    render();
    return () => {
      settle.kill();
      gsap.killTweensOf(pointer);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced, compact]);

  useLayoutEffect(() => {
    const section = ref.current;
    const stage = stageRef.current;
    if (!section || !stage) return undefined;

    const lines = section.querySelectorAll('[data-line-inner]');
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(lines, { yPercent: 0, opacity: 1 });
        gsap.set('.hero__copy, .hero__signal, .hero__scroll', { opacity: 1 });
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: EASE.out }, delay: 0.08 });
      intro
        .fromTo('.hero__eyebrow', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo(lines, { yPercent: 112, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.1 }, '-=0.35')
        .fromTo('.hero__lede', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.55')
        .fromTo('.hero__actions > *, .hero__meta li', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.06 }, '-=0.45')
        .fromTo('.hero__signal, .hero__scroll', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.55');

      const scrollScene = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: ({ progress }) => {
          stage.style.setProperty('--hero-progress', progress.toFixed(3));
          gsap.set('.hero__copy', { y: progress * -26, opacity: 1 - progress * 0.46 });
          gsap.set('.hero__signal', { y: progress * 30, scale: 1 + progress * 0.08, opacity: 0.78 + progress * 0.18 });
          gsap.set('.hero__video', { scale: 1 + progress * 0.08 });
          gsap.set('.hero__scroll', { opacity: 1 - progress * 1.5 });
        },
      });

      return () => scrollScene.kill();
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title" ref={ref}>
      <div className="hero__stage" ref={stageRef}>
        <svg className="hero__filters" aria-hidden="true" focusable="false">
          <defs>
            <filter id="signal-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.018 0.032" numOctaves="2" seed="26" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        <video
          className="hero__video"
          ref={videoRef}
          src="/assets/portfolio-motion.mp4"
          poster="/assets/hero.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
        <div className="hero__video-tone" aria-hidden="true" />
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__signal" aria-hidden="true">
          <svg viewBox="0 0 1200 800" preserveAspectRatio="none" role="presentation">
            <path d="M0 602 C140 552 198 682 340 610 S578 488 716 566 1000 710 1200 540" />
            <path d="M0 238 C180 296 214 118 398 188 S642 330 802 226 1028 76 1200 162" />
            <path d="M72 0 V800 M254 0 V800 M438 0 V800 M622 0 V800 M806 0 V800 M990 0 V800" />
            <circle cx="806" cy="226" r="7" />
            <circle cx="340" cy="610" r="5" />
          </svg>
          <span className="hero__signal-label">INPUT / POINTER / TRACE</span>
        </div>

        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">{hero.eyebrow}</p>
          <h1 className="hero__title" id="hero-title">
            <span className="reveal-line"><span className="reveal-line__inner" data-line-inner>{hero.title[0]}</span></span>
            <span className="reveal-line hero__title-outline"><span className="reveal-line__inner" data-line-inner>{hero.title[1]}</span></span>
          </h1>
          <p className="hero__lede">{hero.lede}</p>
          <div className="hero__actions">
            <Magnetic className="btn btn--solid" href={hero.primaryCta.href}>{hero.primaryCta.label}<span aria-hidden="true">↘</span></Magnetic>
            <a className="link-quiet" href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
          </div>
          <ul className="hero__meta">{hero.meta.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>

        <div className="hero__hud" aria-hidden="true">
          <span>MEDIA / 1280 × 720 / 08.00 SEC</span>
          <span>INPUT / MOTION + POINTER</span>
          <span>STATE / <b>{reduced ? 'REST' : 'LIVE'}</b></span>
        </div>
        <p className="hero__vertical" aria-hidden="true">SYSTEMS / SECURITY / RESEARCH</p>
        <p className="hero__index" aria-hidden="true"><b>01</b><span>/</span>06</p>
        <p className="hero__scroll" aria-hidden="true"><span>SCROLL TO ENTER</span><i /></p>
      </div>
    </section>
  );
}
