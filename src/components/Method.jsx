import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { method } from '../data/profile';
import { RevealLines } from './ui/Reveal';
import { useReducedMotion } from '../hooks/useMediaQuery';

export default function Method() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;

    let current = -1;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.method__scan',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.method__track', start: 'top 82%', end: 'bottom 55%', scrub: 0.35 },
        }
      );

      ScrollTrigger.create({
        trigger: '.method__track',
        start: 'top 78%',
        end: 'bottom 50%',
        onUpdate: (self) => {
          const next = Math.min(method.stages.length - 1, Math.floor(self.progress * method.stages.length));
          if (next !== current) {
            current = next;
            setActive(next);
          }
        },
      });
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="method section" id="method" aria-labelledby="method-title" ref={ref}>
      <div className="method__bg" aria-hidden="true" />

      <div className="method__head">
        <p className="eyebrow eyebrow--invert">{method.eyebrow}</p>
        <RevealLines
          as="h2"
          id="method-title"
          className="h2 method__title"
          lines={[method.title[0], <i key="accent">{method.title[1]}</i>]}
        />
      </div>

      <div className="method__track">
        <div className="method__rail" aria-hidden="true">
          <span className="method__scan" />
        </div>

        <ol className="method__stages">
          {method.stages.map((stage, index) => (
            <li
              className={'stage' + (index === active ? ' is-active' : '') + (index < active ? ' is-past' : '')}
              key={stage.key}
            >
              <span className="stage__index">{stage.index}</span>
              <span className="stage__dot" aria-hidden="true" />
              <h3 className="stage__key">{stage.key}</h3>
              <p className="stage__detail">{stage.detail}</p>
            </li>
          ))}
        </ol>
      </div>

      <p className="method__note">
        Understand the system. Test one assumption. Keep the evidence. Build the next version from what the system
        actually taught you.
      </p>
    </section>
  );
}
