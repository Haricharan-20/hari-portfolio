import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import { animate } from 'animejs';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  { id: '01', title: 'LEAF', meta: 'RESEARCH / CLI', copy: 'Layered Exploration & Analysis Framework for structured security experiments and repeatable investigation workflows.', art: 'leaf-art' },
  { id: '02', title: 'VulnScope', meta: '3D / TELEMETRY', copy: 'An interactive 3D security command center for findings, evidence, live telemetry and spatial analysis.', art: 'vuln-art' },
  { id: '03', title: 'MinBurpSuite', meta: 'MOBILE / SECURITY', copy: 'A mobile security testing direction built around practical HTTP inspection and a constrained on-device workflow.', art: 'burp-art' },
  { id: '04', title: 'Security Simulator', meta: 'SIMULATION / EDUCATION', copy: 'A safe visual environment for learning how security events and malware-lifecycle concepts connect.', art: 'sim-art' },
  { id: '05', title: 'OMNIA-X', meta: 'HTTP / AUTOMATION', copy: 'A modular security toolkit direction with explicit scope gates and repeatable protocol-level checks.', art: 'omnia-art' }
];

const FOCUS = ['Web Security', 'Network Security', 'Application Security', 'Linux & Tooling', 'Security Research', 'Automation', 'AI / ML for Security'];

function ImageWithFallback({ src, alt = '', className = '' }) {
  const [ok, setOk] = useState(true);
  if (ok) return <img className={className} src={src} alt={alt} onError={() => setOk(false)} />;
  return <div className={className + ' image-fallback'} aria-hidden="true"><span>HC</span></div>;
}

function ThreeHero() {
  const ref = useRef(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let raf = 0;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const points = [];
    for (let i = 0; i < 420; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.1 + Math.random() * 1.8;
      points.push(new THREE.Vector3(Math.cos(a) * r, (Math.random() - 0.5) * 2.8, Math.sin(a) * r));
    }
    const pointGeo = new THREE.BufferGeometry().setFromPoints(points);
    const pointMat = new THREE.PointsMaterial({ color: 0x2f8cff, size: 0.018, transparent: true, opacity: 0.64 });
    group.add(new THREE.Points(pointGeo, pointMat));

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.25, 2),
      new THREE.MeshBasicMaterial({ color: 0x050608, wireframe: true, transparent: true, opacity: 0.25 })
    );
    group.add(core);

    const rings = [1.75, 2.2, 2.65].map((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.009, 8, 150),
        new THREE.MeshBasicMaterial({ color: index === 1 ? 0x2f8cff : 0x8b8f95, transparent: true, opacity: index === 1 ? 0.35 : 0.12 })
      );
      ring.rotation.x = index * 0.42;
      ring.rotation.z = index * 0.2;
      group.add(ring);
      return ring;
    });

    const pointer = { x: 0, y: 0 };
    const move = (e) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 0.2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 0.15;
    };
    window.addEventListener('pointermove', move);
    const tick = () => {
      group.rotation.y += 0.0015;
      group.rotation.x += 0.00035;
      core.rotation.y -= 0.0011;
      rings.forEach((ring, i) => { ring.rotation.y += (i + 1) * 0.0008; });
      camera.position.x += (pointer.x - camera.position.x) * 0.03;
      camera.position.y += (-pointer.y - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const resize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      pointGeo.dispose();
      pointMat.dispose();
      core.geometry.dispose();
      core.material.dispose();
      rings.forEach((ring) => { ring.geometry.dispose(); ring.material.dispose(); });
      renderer.domElement.remove();
    };
  }, []);
  return <div className="three-hero" ref={ref} aria-hidden="true" />;
}

function LabField() {
  const ref = useRef(null);
  useEffect(() => {
    let effect;
    try {
      effect = NET({
        el: ref.current,
        THREE,
        color: 0x2f8cff,
        color2: 0x23262b,
        backgroundColor: 0x07080a,
        points: 8,
        maxDistance: 20,
        spacing: 19,
        showDots: true,
        mouseControls: true,
        touchControls: true,
        gyroControls: false
      });
    } catch {}
    return () => effect && effect.destroy();
  }, []);
  return <div ref={ref} className="vanta-lab" aria-hidden="true" />;
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current.querySelectorAll('.char'), { yPercent: 120, opacity: 0 }, {
      yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.025, ease: 'power4.out',
      scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true }
    });
  }, []);
  return <span ref={ref} className={'text-reveal ' + className}>{String(children).split('').map((c, i) => <span className="char" key={i}>{c === ' ' ? '\u00a0' : c}</span>)}</span>;
}

function ProjectStack() {
  const stageRef = useRef(null);
  const cards = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const items = cards.current.filter(Boolean);
    const ctx = gsap.context(() => {
      gsap.set(items, {
        transformOrigin: 'center center',
        y: (i) => i * 14,
        x: (i) => i * 2,
        scale: (i) => 1 - i * 0.035,
        rotate: (i) => i % 2 ? 1.2 : -1.1
      });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: 'top top',
          end: '+=' + (PROJECTS.length * 105) + '%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => setActive(Math.min(PROJECTS.length - 1, Math.floor(self.progress * PROJECTS.length + 0.001)))
        }
      });
      items.forEach((card, i) => {
        if (i === items.length - 1) return;
        tl.to(card, { yPercent: -145, xPercent: i % 2 ? 18 : -18, rotate: i % 2 ? 7 : -7, scale: 0.88, opacity: 0.14, duration: 1, ease: 'power2.inOut' }, i);
        tl.to(items[i + 1], { y: 0, x: 0, scale: 1, rotate: 0, opacity: 1, duration: 1, ease: 'power2.out' }, i);
      });
    }, stageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={stageRef} className="project-stage">
      <div className="hands-frame" aria-hidden="true"><div className="hand hand-top" /><div className="hand hand-bottom" /></div>
      <div className="stack-copy"><span className="section-kicker">05 — FEATURED PROJECTS</span><span className="stack-count">{String(active + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}</span></div>
      <div className="stack-canvas">
        <div className="stack-glow" />
        {PROJECTS.map((p, i) => (
          <a href={p.title === 'LEAF' ? 'https://github.com/Haricharan-20/LEAF' : '#contact'} target={p.title === 'LEAF' ? '_blank' : undefined} rel={p.title === 'LEAF' ? 'noreferrer' : undefined} className={'project-stack-card ' + p.art} key={p.id} ref={(el) => { cards.current[i] = el; }}>
            {p.title === 'LEAF' ? (
              <div className="leaf-project-art">
                <div className="leaf-visual"><img src="/assets/leaf-architecture.svg" alt="" /></div>
                <div className="leaf-hud">
                  <span>LEAF / v1.13</span><b>RESEARCH RUNTIME</b><i>LOCAL / VERIFIED</i>
                </div>
                <div className="leaf-metrics"><span><b>55</b> SESSIONS</span><span><b>43</b> EVENTS</span><span><b>SQLite</b> PERSISTENCE</span></div>
                <div className="leaf-scan" />
              </div>
            ) : <div className="stack-card-art"><div className="art-grid" /><div className="art-core"><span>{p.id}</span><b>{p.title}</b></div></div>}
            <div className="stack-card-top"><span>{p.id}</span><span>{p.meta}</span></div>
            <div className="stack-card-bottom"><div><h3>{p.title}</h3><p>{p.copy}</p></div><span className="stack-arrow">↗</span></div>
          </a>
        ))}
      </div>
      <div className="stack-hint">SCROLL — RELEASE THE STACK</div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false, smoothWheel: true, syncTouch: true });
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((el) => gsap.fromTo(el, { y: 45, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.05, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }));
      gsap.to('.hero-image', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      animate('.pulse-dot', { scale: [1, 1.5], opacity: [1, 0.35], duration: 1600, ease: 'inOutSine', loop: true, alternate: true });
      animate('.scan-line', { x: ['-100%', '100%'], duration: 2600, ease: 'inOutQuad', loop: true });
    });
    return () => { ctx.revert(); gsap.ticker.remove(raf); lenis.destroy(); };
  }, []);

  return (
    <main>
      <header className="nav">
        <a className="brand" href="#top">HARI<span>.</span></a>
        <nav><a href="#about">ABOUT</a><a href="#journey">JOURNEY</a><a href="#focus">FOCUS</a><a href="#projects">PROJECTS</a><a href="#contact">CONTACT</a></nav>
        <div className="availability"><span className="pulse-dot" /> SECURITY / SYSTEMS / BUILDING</div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="section-kicker">CYBERSECURITY · SECURITY RESEARCH · BUILDER</span>
          <h1><Reveal>HARI</Reveal><br /><span className="outline-word">CHARAN</span></h1>
          <p>Exploring systems, building security tooling, and turning technical curiosity into useful work.</p>
          <div className="hero-actions"><a className="button" href="#projects">ENTER THE WORK <span>↘</span></a><a className="quiet-link" href="#about">ABOUT ME</a></div>
          <div className="hero-foot"><span>INDIA</span><span>WEB · NETWORKS · LINUX</span><span>SCROLL ↓</span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo-wrap"><video className="hero-motion" src="/assets/portfolio-motion.mp4" poster="/assets/hero.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" /><ImageWithFallback src="/assets/hero.jpg" alt="Hari Charan editorial portrait" className="hero-image" /></div>
          <ThreeHero />
          <div className="hero-grid" />
          <div className="hero-index"><b>01</b><span>/</span>06</div>
        </div>
      </section>

      <section className="about section-light" id="about">
        <div className="about-media"><div className="media-frame"><ImageWithFallback src="/assets/editorial.jpg" className="media-photo" /><span className="frame-tag">IDENTITY / 02</span></div></div>
        <div className="about-copy"><span className="section-kicker">02 — ABOUT ME</span><h2><Reveal>Curiosity</Reveal><br /><i>drives the work.</i></h2><p>I build around cybersecurity, security research, Linux, networking, web security and security tooling, with a practical focus on understanding how systems behave.</p><p>I enjoy taking an idea from a rough experiment to a cleaner, repeatable system, while exploring AI / ML where it can make security workflows more useful.</p><div className="about-pills"><span>SECURITY RESEARCH</span><span>LINUX</span><span>NETWORKING</span><span>TOOLING</span></div></div>
      </section>

      <section className="journey" id="journey">
        <div className="journey-bg" />
        <div className="journey-title"><span className="section-kicker">03 — JOURNEY</span><h2>EXPLORE<br />LEARN<br />BUILD<br /><i>IMPROVE.</i></h2></div>
        <div className="journey-line">{['OBSERVE', 'EXPLORE', 'CREATE', 'TEST', 'IMPROVE'].map((x, i) => <div className="journey-node" key={x} style={{ left: (8 + i * 21) + '%' }}><span>{x}</span><i /></div>)}<div className="scan-line" /></div>
        <p className="journey-note">Understand the system, test an assumption, document the result, then build the next iteration.</p>
      </section>

      <section className="focus section-light" id="focus">
        <div><span className="section-kicker">04 — FOCUS</span><h2>Where I<br /><i>go deep.</i></h2></div>
        <div className="focus-grid">{FOCUS.map((item) => <div className="focus-chip" key={item}><span className="chip-icon">+</span><b>{item}</b><span>EXPLORE →</span></div>)}</div>
      </section>

      <section id="projects" className="projects-wrap"><ProjectStack /></section>

      <section className="contact" id="contact">
        <div className="contact-visual"><ImageWithFallback src="/assets/hero.jpg" className="contact-photo" /><div className="contact-overlay" /><LabField /></div>
        <div className="contact-content"><span className="section-kicker">06 — CONTACT</span><h2>Let’s build<br /><i>something useful.</i></h2><p>Open to conversations around security, tooling, experiments and interesting technical problems.</p><div className="contact-links">
          <a href="https://github.com/Haricharan-20" target="_blank" rel="noreferrer"><span>GITHUB</span><b>Haricharan-20</b><em>↗</em></a>
          <a href="https://instagram.com/hari_charan_20" target="_blank" rel="noreferrer"><span>INSTAGRAM</span><b>hari_charan_20</b><em>↗</em></a>
          <a href="mailto:haricharan9845@gmail.com"><span>EMAIL</span><b>haricharan9845@gmail.com</b><em>↗</em></a>
        </div><div className="contact-meta"><span>HARI CHARAN / 2026</span><span>SECURITY · SYSTEMS · CURIOSITY</span></div></div>
      </section>
    </main>
  );
}
