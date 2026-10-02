import { lazy, Suspense } from 'react';
import { projects } from '../../data/projects';
import { Reveal, RevealLines } from '../ui/Reveal';

const LeafVisual = lazy(() => import('./LeafVisual.jsx'));
const MiniBurpVisual = lazy(() => import('./MiniBurpVisual.jsx'));

const SCENES = {
  leaf: LeafVisual,
  miniburp: MiniBurpVisual,
};

export default function ProjectChapter({ project, position, total }) {
  const Scene = SCENES[project.slug];
  const next = projects[(position + 1) % total];

  return (
    <article className="chapter" id={'work-' + project.slug} aria-labelledby={'chapter-' + project.slug}>
      <header className="chapter__head">
        <div className="chapter__id" aria-hidden="true">
          <span className="chapter__num">{project.id}</span>
          <span className="chapter__of">/ {String(total).padStart(2, '0')}</span>
        </div>

        <div className="chapter__intro">
          <p className="eyebrow">{project.category}</p>
          <RevealLines
            as="h3"
            id={'chapter-' + project.slug}
            className="chapter__title"
            lines={[project.name]}
            stagger={0.06}
          />
          <p className="chapter__subtitle">{project.subtitle}</p>
          <p className="chapter__thesis">{project.thesis}</p>
        </div>

        <Reveal as="dl" className="chapter__facts" selector=".fact" stagger={0.07} y={18}>
          {project.facts.map((fact) => (
            <div className="fact" key={fact.k}>
              <dt>{fact.k}</dt>
              <dd>{fact.v}</dd>
            </div>
          ))}
        </Reveal>
      </header>

      <div className="chapter__body">
        <Reveal as="section" className="chapter__block" y={22}>
          <h4 className="block__label">PROBLEM</h4>
          {project.problem.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </Reveal>

        <Reveal as="section" className="chapter__block" y={22} delay={0.08}>
          <h4 className="block__label">APPROACH</h4>
          {project.approach.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </Reveal>
      </div>

      <div className="chapter__scene">
        <Suspense fallback={<div className="viewer viewer--loading" aria-label="Loading interactive project visual"><span>LOADING VISUAL SYSTEM</span></div>}>
          <Scene />
        </Suspense>
      </div>

      <div className="chapter__body chapter__body--split">
        <Reveal as="section" className="chapter__block" y={22}>
          <h4 className="block__label">KEY CAPABILITIES</h4>
          <ul className="caps">
            {project.capabilities.map((capability) => (
              <li key={capability.label}>
                <b>{capability.label}</b>
                <span>{capability.detail}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="section" className="chapter__block" y={22} delay={0.08}>
          <h4 className="block__label">CURRENT STATE</h4>
          <p className="chapter__state-summary">{project.state.summary}</p>

          <ul className="state state--done">
            {project.state.done.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <ul className="state state--pending">
            {project.state.pending.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      </div>

      <footer className="chapter__foot">
        <div className="chapter__stack">
          <h4 className="block__label">STACK</h4>
          <ul>
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="chapter__links">
          <h4 className="block__label">REPOSITORY</h4>
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="chapter__link"
            >
              <span className="chapter__link-value">{link.label}</span>
              <span className="chapter__link-note">{link.note}</span>
              <span className="chapter__link-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>

        <a className="chapter__next" href={'#work-' + next.slug}>
          <span className="block__label">NEXT</span>
          <b>{next.name}</b>
          <span aria-hidden="true">↓</span>
        </a>
      </footer>
    </article>
  );
}
