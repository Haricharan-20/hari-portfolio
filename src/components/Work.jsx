import { useEffect, useRef, useState } from 'react';
import { work } from '../data/profile';
import { projects, projectIndex } from '../data/projects';
import { Reveal, RevealLines } from './ui/Reveal';
import ProjectChapter from './work/ProjectChapter';

export default function Work() {
  const [active, setActive] = useState(projectIndex[0].slug);
  const ref = useRef(null);

  // Scroll spy for the index rail — one observer, no scroll handlers.
  useEffect(() => {
    const nodes = projectIndex
      .map((project) => document.getElementById('work-' + project.slug))
      .filter(Boolean);
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id.replace('work-', ''));
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="work section" id="work" aria-labelledby="work-title" ref={ref}>
      <div className="work__head">
        <p className="eyebrow eyebrow--invert">{work.eyebrow}</p>
        <RevealLines
          as="h2"
          id="work-title"
          className="h2 work__title"
          lines={[work.title[0], <i key="accent">{work.title[1]}</i>, work.titleTail]}
        />
        <Reveal className="work__standfirst" y={22}>
          <p>{work.standfirst}</p>
        </Reveal>
      </div>

      <nav className="work__rail" aria-label="Project index">
        <span className="work__rail-label">PROJECT INDEX</span>
        <ul>
          {projectIndex.map((project) => (
            <li key={project.slug}>
              <a
                href={'#work-' + project.slug}
                className={active === project.slug ? 'is-active' : undefined}
                aria-current={active === project.slug ? 'true' : undefined}
              >
                <span className="work__rail-n">{project.id}</span>
                <span className="work__rail-name">{project.name}</span>
                <span className="work__rail-cat">{project.category}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="work__rail-count">
          {projectIndex.length} OF {projectIndex.length} SHOWN — BY DESIGN
        </p>
      </nav>

      <div className="work__chapters">
        {projects.map((project, index) => (
          <ProjectChapter key={project.slug} project={project} position={index} total={projects.length} />
        ))}
      </div>

      <p className="work__note">{work.note}</p>
    </section>
  );
}
