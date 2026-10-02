import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { nav, hero } from '../data/profile';
import { useReducedMotion } from '../hooks/useMediaQuery';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const barRef = useRef(null);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const reduced = useReducedMotion();

  // Entrance + scroll state. The progress line is written straight to the DOM,
  // so scrolling never re-renders the tree.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

    if (!reduced) {
      gsap.fromTo(
        bar,
        { yPercent: -110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', delay: 0.2 }
      );
    }

    const fill = bar.querySelector('.nav__progress-fill');
    const trigger = ScrollTrigger.create({
      start: 40,
      end: 'max',
      onUpdate: (self) => {
        if (fill) fill.style.transform = `scaleX(${self.progress.toFixed(4)})`;
      },
      onToggle: (self) => setCondensed(self.isActive),
    });

    return () => trigger.kill();
  }, [reduced]);

  // Compact panel: escape to close, scroll lock, focus handoff.
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('is-menu-open');
    window.__lenis?.stop();
    panelRef.current?.querySelector('a')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('is-menu-open');
      window.__lenis?.start();
    };
  }, [open]);

  return (
    <>
      <header className={'nav' + (condensed ? ' is-condensed' : '')} ref={barRef}>
        <div className="nav__progress" aria-hidden="true">
          <span className="nav__progress-fill" />
        </div>

        <a className="nav__brand" href="#top">
          <span className="nav__brand-mark">HC</span>
          <span className="nav__brand-slash" aria-hidden="true">
            /
          </span>
          <span className="nav__brand-year">26</span>
          <span className="sr-only">Hari Charan — back to top</span>
        </a>

        <nav className="nav__links" aria-label="Section navigation">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <p className="nav__status">
          <span className="pulse" aria-hidden="true" />
          {hero.statusLabel}
        </p>

        <button
          className="nav__toggle"
          type="button"
          ref={toggleRef}
          aria-expanded={open}
          aria-controls="nav-panel"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="nav__toggle-bars" aria-hidden="true">
            <i />
            <i />
          </span>
          <span className="sr-only">{open ? 'Close section menu' : 'Open section menu'}</span>
        </button>
      </header>

      <div
        id="nav-panel"
        className={'nav__panel' + (open ? ' is-open' : '')}
        ref={panelRef}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Section navigation (compact)">
          {nav.map((item, index) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              <span className="nav__panel-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="nav__panel-label">{item.label}</span>
              <span className="nav__panel-arrow" aria-hidden="true">
                ↘
              </span>
            </a>
          ))}
        </nav>
        <p className="nav__panel-foot">{hero.statusLabel}</p>
      </div>
    </>
  );
}
