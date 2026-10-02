import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useReducedMotion, useCompactPointer } from '../../hooks/useMediaQuery';

const CAPABILITIES = [
  { name: 'system.read', state: 'ALLOWED' },
  { name: 'network.read', state: 'ALLOWED' },
  { name: 'browser.read', state: 'ALLOWED' },
  { name: 'storage.read', state: 'ALLOWED' },
];

const TRACE = [
  { cmd: true, text: 'LEAF> requirements system_info' },
  { text: 'Status: READY' },
  { text: '  system.read: AVAILABLE' },
  { text: '  events: AVAILABLE' },
  { cmd: true, text: 'LEAF> run system_info' },
  { text: 'Session: 8c1f…4e2a' },
  { text: 'Experiment completed.' },
  { text: 'Event generated: experiment.system_info' },
  { text: 'Event stored successfully.' },
];

/**
 * LEAF's visual language: the actual runtime path a single experiment takes,
 * from the CLI prompt to a persisted SQLite row. Every label here exists in
 * the repository — nothing is drawn that the code does not do.
 */
export default function LeafScene() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const compact = useCompactPointer();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const stages = el.querySelectorAll('[data-stage]');
    const rail = el.querySelector('[data-rail]');
    const signalTrack = el.querySelector('[data-signal]');
    const traceLines = el.querySelectorAll('[data-trace]');
    const rows = el.querySelectorAll('[data-row]');
    const note = el.querySelector('[data-note]');

    if (reduced) {
      gsap.set([rail, signalTrack, note], { opacity: 1 });
      gsap.set(rail, { scaleX: 1 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      if (compact) {
        gsap.set(rail, { scaleX: 1 });
        gsap.set(signalTrack, { opacity: 0 });
        gsap.fromTo(
          [stages, traceLines, rows],
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.05,
            scrollTrigger: { trigger: el, start: 'top 78%', once: true },
          }
        );
        gsap.fromTo(note, { opacity: 0 }, { opacity: 1, duration: 0.6, scrollTrigger: { trigger: el, start: 'top 60%', once: true } });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=190%',
          scrub: 0.55,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(rail, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
        .fromTo(signalTrack, { xPercent: 0, opacity: 0 }, { opacity: 1, duration: 0.08 }, 0)
        .to(signalTrack, { xPercent: 100, duration: 0.92 }, 0.08)
        .fromTo(stages, { opacity: 0.16, y: 22 }, { opacity: 1, y: 0, duration: 0.34, stagger: 0.14, ease: 'power2.out' }, 0.05)
        .fromTo(traceLines, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.14, stagger: 0.06, ease: 'power2.out' }, 0.4)
        .fromTo(rows, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.16, stagger: 0.08, ease: 'power2.out' }, 0.68)
        .fromTo(note, { opacity: 0 }, { opacity: 1, duration: 0.16 }, 0.8);
    }, el);

    return () => ctx.revert();
  }, [reduced, compact]);

  return (
    <figure className="scene scene--leaf" ref={ref}>
      <div className="scene__hud">
        <span className="scene__tag">LEAF / RUNTIME TRACE</span>
        <ul className="scene__stats">
          <li>
            <b>04</b> capabilities
          </li>
          <li>
            <b>01</b> service
          </li>
          <li>
            <b>02</b> tables
          </li>
          <li>
            <b>01</b> built-in experiment
          </li>
        </ul>
      </div>

      <div className="leaf__rail" aria-hidden="true">
        <span className="leaf__rail-fill" data-rail />
        <span className="leaf__signal-track" data-signal>
          <span className="leaf__signal" />
        </span>
      </div>

      <ol className="leaf__stages" aria-hidden="true">
        <li className="leaf-stage" data-stage>
          <span className="leaf-stage__n">01</span>
          <h4>CLI</h4>
          <p className="leaf-stage__cmd">LEAF&gt; run system_info</p>
          <ul className="leaf-stage__list">
            <li>experiments</li>
            <li>requirements</li>
            <li>capabilities</li>
            <li>sessions · events</li>
          </ul>
        </li>

        <li className="leaf-stage" data-stage>
          <span className="leaf-stage__n">02</span>
          <h4>EXPERIMENT CATALOG</h4>
          <p className="leaf-stage__cmd">system_info · v1.0</p>
          <ul className="leaf-stage__list">
            <li>category environment</li>
            <li>risk low</li>
            <li>requires system.read</li>
            <li>plugin discovery</li>
          </ul>
        </li>

        <li className="leaf-stage" data-stage>
          <span className="leaf-stage__n">03</span>
          <h4>PREFLIGHT GATE</h4>
          <ul className="leaf-stage__chips">
            {CAPABILITIES.map((capability) => (
              <li key={capability.name}>
                <span>{capability.name}</span>
                <b>{capability.state}</b>
              </li>
            ))}
          </ul>
          <p className="leaf-stage__verdict">VERDICT / READY</p>
        </li>

        <li className="leaf-stage" data-stage>
          <span className="leaf-stage__n">04</span>
          <h4>EVENT ENGINE</h4>
          <p className="leaf-stage__cmd">emit(event_type, source, data)</p>
          <ul className="leaf-stage__list">
            <li>type experiment.system_info</li>
            <li>source experiment.system_info</li>
            <li>session &#123;uuid4&#125;</li>
            <li>timestamp UTC ISO</li>
          </ul>
        </li>

        <li className="leaf-stage" data-stage>
          <span className="leaf-stage__n">05</span>
          <h4>SQLITE STORE</h4>
          <ul className="leaf-stage__tables">
            <li>
              <b>sessions</b>
              <span>session_id · started_at · ended_at</span>
            </li>
            <li>
              <b>events</b>
              <span>id · event_type · source · session_id · timestamp · data</span>
            </li>
          </ul>
        </li>
      </ol>

      <div className="leaf__panels">
        <div className="leaf__terminal">
          <p className="leaf__panel-label">CLI TRACE / OUTPUT FORMAT FROM cli/main.py</p>
          <pre aria-hidden="true">
            {TRACE.map((line, index) => (
              <span className={'leaf__trace' + (line.cmd ? ' is-cmd' : '')} data-trace key={index}>
                {line.text}
                {'\n'}
              </span>
            ))}
          </pre>
        </div>

        <div className="leaf__store">
          <p className="leaf__panel-label">PERSISTED ROWS</p>
          <table>
            <caption className="sr-only">
              Illustrative rows showing the columns LEAF writes to its SQLite events table
            </caption>
            <thead>
              <tr>
                <th scope="col">event_type</th>
                <th scope="col">source</th>
                <th scope="col">data</th>
              </tr>
            </thead>
            <tbody>
              <tr data-row>
                <td>experiment.system_info</td>
                <td>experiment.system_info</td>
                <td>&#123; platform, architecture, python &#125;</td>
              </tr>
            </tbody>
          </table>
          <p className="leaf__store-note">
            Queried afterwards with <code>events</code>, <code>events type &lt;type&gt;</code> or{' '}
            <code>events session &lt;id&gt;</code>.
          </p>
        </div>
      </div>

      <figcaption className="scene__caption">
        <span className="chip chip--warn" data-note>
          SCAFFOLDED, NOT IMPLEMENTED — analysis/headers.py · cookies.py · origins.py
        </span>
        <span className="scene__caption-text">
          One experiment and one example plugin exist today. The runtime around them is real; the analysis modules are
          empty files, so they are not drawn as working parts.
        </span>
      </figcaption>
    </figure>
  );
}
