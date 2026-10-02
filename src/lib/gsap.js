import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// The site is scroll-driven; a single ticker-owned RAF keeps Lenis and
// ScrollTrigger in sync and avoids competing animation frames.
gsap.ticker.lagSmoothing(0);

export { gsap, ScrollTrigger };

/** Shared easing vocabulary so motion stays consistent across sections. */
export const EASE = {
  out: 'expo.out',
  inOut: 'power3.inOut',
  soft: 'power2.out',
};
