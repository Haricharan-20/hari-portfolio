import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';

/**
 * Smooth scrolling is a progressive enhancement: when the visitor asks for
 * reduced motion we leave the document scroll completely native.
 */
export function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('has-smooth-scroll');
      return undefined;
    }

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    const raf = (time) => lenis.raf(time * 1000);
    const onScroll = () => ScrollTrigger.update();

    gsap.ticker.add(raf);
    lenis.on('scroll', onScroll);
    document.documentElement.classList.add('has-smooth-scroll');
    window.__lenis = lenis;

    // Late-loading fonts and images change document height.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    const timeout = window.setTimeout(refresh, 600);

    return () => {
      window.clearTimeout(timeout);
      document.documentElement.classList.remove('has-smooth-scroll');
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [enabled]);
}

/** In-page anchors route through Lenis when it is active, native otherwise. */
export function useAnchorScroll() {
  useEffect(() => {
    const onClick = (event) => {
      const anchor = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      if (!anchor) return;

      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      const lenis = window.__lenis;
      const offset = -84;

      if (lenis) lenis.scrollTo(target, { offset, duration: 1.15 });
      else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: 'auto' });

      // Keep the URL and keyboard focus in step with the visual jump.
      window.history.replaceState(null, '', id);
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}
