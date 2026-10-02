import { focus } from '../data/profile';
import { Reveal, RevealLines } from './ui/Reveal';

export default function Focus() {
  return (
    <section className="focus section section--paper" id="focus" aria-labelledby="focus-title">
      <div className="focus__head">
        <p className="eyebrow">{focus.eyebrow}</p>
        <RevealLines
          as="h2"
          id="focus-title"
          className="h2 focus__title"
          lines={[focus.title[0], <i key="accent">{focus.title[1]}</i>]}
        />
        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            <span>{focus.marquee}</span>
            <span>{focus.marquee}</span>
          </div>
        </div>
      </div>

      <Reveal as="ol" className="focus__list" selector=".focus__row" stagger={0.08} y={20}>
        {focus.items.map((item) => (
          <li className="focus__row" key={item.n}>
            <span className="focus__n">{item.n}</span>
            <h3 className="focus__name">{item.title}</h3>
            <p className="focus__detail">{item.detail}</p>
            <span className="focus__mark" aria-hidden="true">
              ↗
            </span>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
