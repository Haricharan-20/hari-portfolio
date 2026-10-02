import { useEffect } from 'react';
import { ScrollTrigger } from './lib/gsap';
import { useAnchorScroll, useSmoothScroll } from './hooks/useSmoothScroll';
import { useReducedMotion } from './hooks/useMediaQuery';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Approach from './components/Approach';
import Method from './components/Method';
import Focus from './components/Focus';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const reduced = useReducedMotion();

  // Smooth scrolling is opt-in: reduced-motion visitors keep native scrolling.
  useSmoothScroll(!reduced);
  useAnchorScroll();

  // Images and fonts settle after first paint and change the document height.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Approach />
        <Method />
        <Focus />
        <Work />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
