import { approach } from '../data/profile';
import { Reveal, RevealLines } from './ui/Reveal';
import Picture from './ui/Picture';

export default function Approach() {
  return (
    <section className="approach section section--paper" id="approach" aria-labelledby="approach-title">
      <div className="approach__media">
        <Reveal className="approach__figure" y={34}>
          <Picture
            src="/assets/editorial.jpg"
            webp="/assets/editorial.webp"
            alt="Monochrome editorial photograph from the field notes series"
            className="approach__photo"
            width={1000}
            height={1778}
            sizes="(max-width: 900px) 86vw, 32vw"
          />
          <p className="approach__caption">
            <span>{approach.caption.tag}</span>
            <b>{approach.caption.text}</b>
          </p>
        </Reveal>
      </div>

      <div className="approach__copy">
        <p className="eyebrow">{approach.eyebrow}</p>

        <RevealLines
          as="h2"
          id="approach-title"
          className="h2 approach__title"
          lines={[
            approach.title[0],
            <i key="accent">{approach.title[1]}</i>,
          ]}
        />

        <div className="approach__body">
          {approach.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <Reveal as="ol" className="principles" selector=".principle" stagger={0.12} y={22}>
          {approach.principles.map((principle) => (
            <li className="principle" key={principle.n}>
              <span className="principle__n">{principle.n}</span>
              <h3 className="principle__title">{principle.title}</h3>
              <p className="principle__detail">{principle.detail}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
