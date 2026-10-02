import { Reveal, RevealLines } from './ui/Reveal';
import { motion } from 'motion/react';

const experiments = [
  ['01', 'SIGNAL / TRACE', 'Pointer-responsive SVG paths and liquid-edged media reveals.'],
  ['02', 'GEOMETRY / SYSTEMS', 'Small Three.js studies for turning architecture into spatial form.'],
  ['03', 'TYPE / MOTION', 'Editorial title sequences where state and pacing do the explaining.'],
];

export default function Lab() {
  return (
    <section className="lab section section--paper" id="lab" aria-labelledby="lab-title">
      <div className="lab__head">
        <p className="eyebrow">05 — LAB</p>
        <RevealLines as="h2" id="lab-title" className="h2" lines={['SMALL TESTS,', <i key="accent">useful</i>, 'directions.']} />
        <Reveal className="lab__intro" y={18}>
          <p>A place for interaction studies and rendering experiments. These are visual probes, not claims about shipped products.</p>
        </Reveal>
      </div>
      <div className="lab__list">
        {experiments.map(([index, title, detail]) => (
          <motion.article
            className="lab__item"
            key={index}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <span className="lab__index">{index}</span>
            <h3>{title}</h3>
            <p>{detail}</p>
            <span className="lab__state">EXPERIMENTAL / IN PROGRESS</span>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
