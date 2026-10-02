import { contact } from '../data/profile';
import { Reveal, RevealLines } from './ui/Reveal';

export default function Contact() {
  return (
    <section className="contact section" id="contact" aria-labelledby="contact-title">
      <div className="contact__bg" aria-hidden="true">
        <span className="contact__grid" />
        <span className="contact__glow" />
        <span className="contact__scan" />
      </div>

      <div className="contact__inner">
        <p className="eyebrow eyebrow--invert">{contact.eyebrow}</p>

        <RevealLines
          as="h2"
          id="contact-title"
          className="h2 contact__title"
          lines={[contact.title[0], <i key="accent">{contact.title[1]}</i>]}
        />

        <Reveal as="p" className="contact__body" y={20}>
          {contact.body}
        </Reveal>

        <Reveal as="ul" className="contact__links" selector=".contact__link" stagger={0.09} y={18}>
          {contact.links.map((link) => (
            <li key={link.href}>
              <a
                className="contact__link"
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer noopener' : undefined}
              >
                <span className="contact__link-label">{link.label}</span>
                <span className="contact__link-value">{link.value}</span>
                <span className="contact__link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </Reveal>

        <ul className="contact__meta">
          {contact.meta.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
