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
  {
    id: '01',
    title: 'LEAF',
    meta: 'RESEARCH RUNTIME',
    copy: 'A layered framework for structured security experiments, service readiness, event capture and repeatable investigation workflows.',
    kind: 'leaf',
    href: 'https://github.com/Haricharan-20/LEAF'
  },
  {
    id: '02',
    title: 'MinBurpSuite',
    meta: 'MOBILE HTTP',
    copy: 'A practical mobile security testing direction focused on HTTP interception, inspection and constrained on-device workflows.',
    kind: 'burp',
    href: '#contact'
  },
  {
    id: '03',
    title: 'PROJECT NIGHTFALL',
    meta: 'SAFE SIMULATION',
    copy: 'A controlled visual simulator for understanding malware lifecycle concepts without turning the experience into a live offensive tool.',
    kind: 'nightfall',
    href: '#contact'
  },
  {
    id: '04',
    title: 'TERMUX CHAT BRIDGE',
    meta: 'DEV / AUTOMATION',
    copy: 'A lightweight bridge for turning natural-language actions into controlled filesystem and terminal operations on an authorized device.',
    kind: 'bridge',
    href: '#contact'
  }
];

const FOCUS = [
  ['01', 'WEB SECURITY', 'Requests, sessions, browser behavior'],
  ['02', 'NETWORK SECURITY', 'Protocols, traffic, inspection'],
  ['03', 'LINUX + TOOLING', 'CLI workflows and repeatability'],
  ['04', 'SECURITY RESEARCH', 'Observe, test, document'],
  ['05', 'AUTOMATION', 'Small systems that remove friction'],
  ['06', 'AI / ML FOR SECURITY', 'Useful intelligence, not decoration']
];

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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const points = [];
    for (let i = 0; i < 520; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const radius = 2.25 + Math.random() * 1.75;
      points.push(new THREE.Vector3(
        Math.cos(a) * radius,
        (Math.random() - 0.5) * 3.15,
        Math.sin(a) * radius
      ));
    }

    const pointGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const pointMaterial = new THREE.PointsMaterial({
      color: 0x5ca6ff,
      size: 0.017,
      transparent: true,
      opacity: 0.55
    });
    root.add(new THREE.Points(pointGeometry, pointMaterial));

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.15, 2),
      new THREE.MeshBasicMaterial({
        color: 0x0a0b0e,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      })
    );
    root.add(core);

    const rings = [1.6, 2.05, 2.55].map((radius, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, i === 1 ? 0.014 : 0.008, 8, 180),
        new THREE.MeshBasicMaterial({
          color: i === 1 ? 0x5ca6ff : 0x7c838c,
          transparent: true,
          opacity: i === 1 ? 0.38 : 0.13
        })
      );
      ring.rotation.x = i * 0.45;
      ring.rotation.z = i * 0.18;
      root.add(ring);
      return ring;
    });

    const pointer = { x: 0, y: 0 };
    const onPointer = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.25;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.18;
    };

    let raf = 0;
    const tick = () => {
      root.rotation.y += 0.0012;
      root.rotation.x += 0.00022;
      core.rotation.y -= 0.001;
      rings.forEach((ring, i) => { ring.rotation.y += (i + 1) * 0.00065; });
      camera.position.x += (pointer.x - camera.position.x) * 0.025;
      camera.position.y += (-pointer.y - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };

    window.addEventListener('pointermove', onPointer);
    window.addEventListener('resize', resize);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', resize);
      pointGeometry.dispose();
      pointMaterial.dispose();
      core.geometry.dispose();
      core.material.dispose();
      rings.forEach((ring) => {
        ring.geometry.dispose();
        ring.material.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} className="three-hero" aria-hidden="true" />;
}

function LabField() {
  const ref = useRef(null);

  useEffect(() => {
    let effect;
    try {
      effect = NET({
        el: ref.current,
        THREE,
        color: 0x5ca6ff,
        color2: 0x272c34,
        backgroundColor: 0x07080a,
        points: 9,
        maxDistance: 21,
        spacing: 18,
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

function SplitText({ children, className = '' }) {
  return (
    <span className={'split-text ' + className}>
      {String(children).split('').map((char, index) => (
        <span className="split-char" key={index}>{char === ' ' ? '\u00a0' : char}</span>
      ))}
    </span>
  );
}

function Magnetic({ children, className = '', ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const move = (event) => {
      const box = node.getBoundingClientRect();
      const x = event.clientX - (box.left + box.width / 2);
      const y = event.clientY - (box.top + box.height / 2);
      animate(node, {
        translateX: x * 0.13,
        translateY: y * 0.13,
        duration: 280,
        ease: 'out(3)'
      });
    };

    const leave = () => animate(node, {
      translateX: 0,
      translateY: 0,
      duration: 500,
      ease: 'out(4)'
    });

    node.addEventListener('pointermove', move);
    node.addEventListener('pointerleave', leave);

    return () => {
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerleave', leave);
    };
  }, []);

  return <a ref={ref} className={className} {...props}>{children}</a>;
}

function RevealHeading({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(node.querySelectorAll('.split-char'),
        { yPercent: 115, rotateX: -70, opacity: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.025,
          ease: 'expo.out',
          scrollTrigger: { trigger: node, start: 'top 84%', once: true }
        }
      );
    }, node);

    return () => ctx.revert();
  }, []);

  return <span ref={ref}><SplitText>{children}</SplitText></span>;
}

function ProjectArtwork({ project }) {
  if (project.kind === 'leaf') {
    return (
      <div className="project-art project-art-leaf">
        <img src="/assets/leaf-architecture.svg" alt="" />
        <div className="art-terminal">
          <span>leaf@runtime</span>
          <b>service_registry</b>
          <i>READY · STORAGE · EVENTS</i>
        </div>
        <div className="art-scan" />
      </div>
    );
  }

  if (project.kind === 'burp') {
    return (
      <div className="project-art project-art-burp">
        <div className="request-window">
          <div className="window-bar"><i /><i /><i /><span>intercept / request</span></div>
          <div className="request-line"><b>GET</b><span>/api/session</span><em>HTTP/2</em></div>
          <div className="request-lines">
            <span>Host: target.local</span>
            <span>Accept: application/json</span>
            <span>User-Agent: mobile-client</span>
            <span>Authorization: •••••••••••</span>
          </div>
          <div className="response-line"><b>200</b><span>application/json</span><em>142ms</em></div>
        </div>
        <div className="wire-orbit orbit-a" />
        <div className="wire-orbit orbit-b" />
      </div>
    );
  }

  if (project.kind === 'nightfall') {
    return (
      <div className="project-art project-art-nightfall">
        <div className="nightfall-core"><span>NIGHTFALL</span><b>SAFE MODE</b></div>
        <div className="lifecycle">
          {['ENTRY', 'EXECUTE', 'PERSIST', 'SIGNAL', 'CONTAIN'].map((step, i) => (
            <div key={step} className="life-step" style={{ '--i': i }}>
              <span>0{i + 1}</span><b>{step}</b>
            </div>
          ))}
        </div>
        <div className="nightfall-grid" />
      </div>
    );
  }

  return (
    <div className="project-art project-art-bridge">
      <div className="bridge-terminal">
        <span>$ bridge</span>
        <b>create_file</b>
        <i>→ authorized filesystem</i>
        <em>STATUS / COMPLETE</em>
      </div>
      <div className="bridge-path">
        <span>CHAT</span><i /><span>ACTION</span><i /><span>DEVICE</span>
      </div>
      <div className="bridge-pulse" />
    </div>
  );
}

function ProjectStack() {
  const stageRef = useRef(null);
  const cards = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const items = cards.current.filter(Boolean);
    if (!items.length) return;

    const ctx = gsap.context(() => {
      items.forEach((card, i) => {
        gsap.set(card, {
          zIndex: items.length - i,
          y: i * 18,
          x: i * 8,
          scale: 1 - i * 0.032,
          rotate: i === 0 ? 0 : (i % 2 ? 1.1 : -1.1),
          opacity: 1,
          transformOrigin: '50% 50%'
        });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: 'top top',
          end: '+=' + (items.length * 115) + '%',
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setActive(Math.min(items.length - 1, Math.floor(self.progress * items.length + 0.0001)));
          }
        }
      });

      items.forEach((card, i) => {
        if (i === items.length - 1) return;

        const next = items[i + 1];
        const nextRest = {
          y: 0,
          x: 0,
          scale: 1,
          rotate: 0,
          opacity: 1
        };

        timeline.to(card, {
          yPercent: -125,
          xPercent: i % 2 === 0 ? -15 : 15,
          rotate: i % 2 === 0 ? -6 : 6,
          scale: 0.84,
          opacity: 0,
          duration: 1,
          ease: 'power3.inOut'
        }, i);

        timeline.to(next, {
          ...nextRest,
          zIndex: items.length,
          duration: 1,
          ease: 'expo.out'
        }, i);

        items.slice(i + 2).forEach((behind, depth) => {
          timeline.to(behind, {
            y: (depth + 1) * 18,
            x: (depth + 1) * 8,
            scale: 1 - (depth + 1) * 0.032,
            duration: 1,
            ease: 'power2.out'
          }, i);
        });
      });
    }, stageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={stageRef} className="project-stage">
      <div className="hands-frame" aria-hidden="true">
        <div className="hand hand-left" />
        <div className="hand hand-right" />
      </div>

      <div className="project-header">
        <span className="section-kicker">05 — SELECTED WORK</span>
        <div className="project-counter">
          <strong>{String(active + 1).padStart(2, '0')}</strong>
          <span>/</span>
          <small>{String(PROJECTS.length).padStart(2, '0')}</small>
        </div>
      </div>

      <div className="project-label">
        <span>SCROLL DECK</span>
        <i>FRONT → OUT / REAR → FORWARD</i>
      </div>

      <div className="stack-canvas">
        <div className="stack-light" />
        {PROJECTS.map((project, i) => (
          <a
            key={project.id}
            ref={(el) => { cards.current[i] = el; }}
            href={project.href}
            target={project.href.startsWith('http') ? '_blank' : undefined}
            rel={project.href.startsWith('http') ? 'noreferrer' : undefined}
            className={'project-card project-' + project.kind}
          >
            <ProjectArtwork project={project} />
            <div className="project-card-shade" />
            <div className="project-card-top">
              <span>{project.id}</span>
              <span>{project.meta}</span>
            </div>
            <div className="project-card-bottom">
              <div>
                <h3>{project.title}</h3>
                <p>{project.copy}</p>
              </div>
              <span className="project-arrow">↗</span>
            </div>
          </a>
        ))}
      </div>

      <div className="project-side-note">
        <span>04 PROJECTS</span>
        <span>BUILT / TESTED / ITERATED</span>
      </div>

      <div className="project-hint">KEEP SCROLLING <span>↓</span></div>
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
      gsap.utils.toArray('.rise').forEach((el) => {
        gsap.fromTo(el, { y: 60, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      });

      gsap.to('.hero-image', {
        yPercent: 10,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });

      gsap.to('.hero-motion', {
        yPercent: -5,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });

      gsap.to('.hero-vertical', {
        yPercent: 35,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });

      animate('.pulse-dot', {
        scale: [1, 1.45],
        opacity: [1, 0.35],
        duration: 1500,
        ease: 'inOutSine',
        loop: true,
        alternate: true
      });

      animate('.scan-line', {
        x: ['-100%', '100%'],
        duration: 2800,
        ease: 'inOutQuad',
        loop: true
      });

      animate('.marquee-track', {
        translateX: ['0%', '-50%'],
        duration: 18000,
        ease: 'linear',
        loop: true
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      <header className="nav">
        <a className="brand" href="#top">HC<span>/</span>26</a>
        <nav>
          <a href="#about">ABOUT</a>
          <a href="#journey">JOURNEY</a>
          <a href="#focus">FOCUS</a>
          <a href="#projects">WORK</a>
          <a href="#contact">CONTACT</a>
        </nav>
        <div className="availability"><span className="pulse-dot" /> SECURITY / SYSTEMS / BUILDING</div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="section-kicker">CYBERSECURITY · RESEARCH · ENGINEERING</span>
          <h1>
            <RevealHeading>HARI</RevealHeading>
            <br />
            <span className="outline-word">CHARAN</span>
          </h1>
          <p className="hero-intro rise">I work close to the system: understanding behavior, building security tooling, and turning experiments into repeatable workflows.</p>
          <div className="hero-actions rise">
            <Magnetic className="button" href="#projects">ENTER THE WORK <span>↘</span></Magnetic>
            <a className="quiet-link" href="#about">READ THE STORY</a>
          </div>
          <div className="hero-foot rise">
            <span>INDIA</span>
            <span>WEB / NETWORK / LINUX</span>
            <span>SCROLL TO EXPLORE ↓</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-photo-wrap">
            <video className="hero-motion" src="/assets/portfolio-motion.mp4" poster="/assets/hero.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
            <ImageWithFallback src="/assets/hero.jpg" alt="Hari Charan editorial portrait" className="hero-image" />
            <div className="hero-film" />
          </div>
          <ThreeHero />
          <div className="hero-grid" />
          <div className="hero-vertical">SYSTEMS / SECURITY / 2026</div>
          <div className="hero-index"><b>01</b><span>/</span>06</div>
        </div>
      </section>

      <section className="about section-light" id="about">
        <div className="about-media">
          <div className="media-frame rise">
            <ImageWithFallback src="/assets/editorial.jpg" className="media-photo" alt="" />
            <div className="media-caption"><span>FIELD NOTE / 02</span><b>OBSERVE BEFORE YOU TOUCH</b></div>
          </div>
        </div>

        <div className="about-copy">
          <span className="section-kicker">02 — ABOUT ME</span>
          <h2><RevealHeading>Curiosity</RevealHeading><br /><i>drives the work.</i></h2>
          <p className="rise">My work sits around cybersecurity, security research, Linux, networking and practical tooling. I like the part before the polished result: the observation, the failed test, the log, the question that changes the architecture.</p>
          <p className="rise">I also explore AI / ML when it has a real job to do inside a security workflow rather than being added as decoration.</p>
          <div className="about-pills rise">
            <span>SECURITY RESEARCH</span>
            <span>LINUX</span>
            <span>NETWORKING</span>
            <span>TOOLING</span>
          </div>
        </div>
      </section>

      <section className="journey" id="journey">
        <div className="journey-bg" />
        <div className="journey-title">
          <span className="section-kicker">03 — JOURNEY</span>
          <h2><RevealHeading>OBSERVE</RevealHeading><br /><RevealHeading>EXPLORE</RevealHeading><br /><RevealHeading>BUILD</RevealHeading><br /><i>IMPROVE.</i></h2>
        </div>
        <div className="journey-line">
          {['OBSERVE', 'QUESTION', 'TEST', 'DOCUMENT', 'ITERATE'].map((step, i) => (
            <div className="journey-node" key={step} style={{ left: (7 + i * 21.5) + '%' }}>
              <span>{step}</span><i />
            </div>
          ))}
          <div className="scan-line" />
        </div>
        <p className="journey-note rise">Understand the system. Test an assumption. Keep the evidence. Build the next version from what the system actually taught you.</p>
      </section>

      <section className="focus section-light" id="focus">
        <div className="focus-title">
          <span className="section-kicker">04 — FOCUS</span>
          <h2><RevealHeading>WHERE I</RevealHeading><br /><i>GO DEEP.</i></h2>
          <div className="marquee"><div className="marquee-track"><span>SECURITY · SYSTEMS · CURIOSITY · </span><span>SECURITY · SYSTEMS · CURIOSITY · </span></div></div>
        </div>

        <div className="focus-list">
          {FOCUS.map(([num, title, detail]) => (
            <div className="focus-row" key={num}>
              <span>{num}</span>
              <b>{title}</b>
              <em>{detail}</em>
              <i>↗</i>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="projects-wrap">
        <ProjectStack />
      </section>

      <section className="contact" id="contact">
        <div className="contact-visual">
          <ImageWithFallback src="/assets/hero.jpg" className="contact-photo" alt="" />
          <div className="contact-overlay" />
          <LabField />
        </div>

        <div className="contact-content">
          <span className="section-kicker">06 — CONTACT</span>
          <h2><RevealHeading>LET’S BUILD</RevealHeading><br /><i>something useful.</i></h2>
          <p className="rise">Security, tooling, experiments, systems and interesting technical problems.</p>

          <div className="contact-links">
            <a href="https://github.com/Haricharan-20" target="_blank" rel="noreferrer"><span>GITHUB</span><b>Haricharan-20</b><em>↗</em></a>
            <a href="https://instagram.com/hari_charan_20" target="_blank" rel="noreferrer"><span>INSTAGRAM</span><b>hari_charan_20</b><em>↗</em></a>
            <a href="mailto:haricharan9845@gmail.com"><span>EMAIL</span><b>haricharan9845@gmail.com</b><em>↗</em></a>
          </div>

          <div className="contact-meta">
            <span>HARI CHARAN / 2026</span>
            <span>SECURITY · SYSTEMS · CURIOSITY</span>
          </div>
        </div>
      </section>
    </main>
  );
}
