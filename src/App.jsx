import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
gsap.registerPlugin(ScrollTrigger);

const projects=[
{n:"01",title:"LEAF",tag:"RESEARCH / CLI",text:"Layered Exploration & Analysis Framework for structured security experiments and repeatable investigation workflows.",href:"#"},
{n:"02",title:"MinBurpSuite",tag:"MOBILE / SECURITY",text:"A mobile-focused security testing project exploring practical HTTP interception and inspection on non-rooted devices.",href:"#"},
{n:"03",title:"Security Simulator",tag:"SIMULATION / EDUCATION",text:"An interactive educational simulator for understanding security and malware-lifecycle concepts safely.",href:"#"}];

function TextReveal({children}){
 const ref=useRef(null);
 useEffect(()=>{const el=ref.current;if(!el)return;gsap.fromTo(el.querySelectorAll(".char"),{y:"110%",opacity:0},{y:"0%",opacity:1,duration:.8,stagger:.025,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}})},[]);
 return <span ref={ref} className="text-reveal">{String(children).split("").map((c,i)=><span className="char" key={i}>{c===" "?"\u00a0":c}</span>)}</span>;
}

function HeroScene(){
 const ref=useRef(null);
 useEffect(()=>{
  const host=ref.current;if(!host)return;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,host.clientWidth/host.clientHeight,.1,100);
  camera.position.z=7;
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(host.clientWidth,host.clientHeight);host.appendChild(renderer.domElement);
  const group=new THREE.Group();scene.add(group);
  const points=[];for(let i=0;i<360;i++){const a=Math.random()*Math.PI*2,r=2.2+Math.random()*1.8;points.push(new THREE.Vector3(Math.cos(a)*r,(Math.random()-.5)*2.8,Math.sin(a)*r))}
  const geo=new THREE.BufferGeometry().setFromPoints(points),mat=new THREE.PointsMaterial({color:0x1cc8d9,size:.025,transparent:true,opacity:.7});
  group.add(new THREE.Points(geo,mat));
  const ring=new THREE.Mesh(new THREE.TorusKnotGeometry(1.55,.025,220,12),new THREE.MeshBasicMaterial({color:0x151515,wireframe:true,transparent:true,opacity:.32}));group.add(ring);
  let raf;const tick=()=>{group.rotation.y+=.0018;group.rotation.x+=.0006;renderer.render(scene,camera);raf=requestAnimationFrame(tick)};tick();
  const resize=()=>{camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight)};window.addEventListener("resize",resize);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);renderer.dispose();geo.dispose();mat.dispose();host.removeChild(renderer.domElement)};
 },[]);
 return <div ref={ref} className="hero-scene" aria-hidden="true"/>;
}

function SignalField(){
 const ref=useRef(null);
 useEffect(()=>{let effect;if(ref.current)effect=NET({el:ref.current,THREE,color:0x101010,color2:0x1ec7d8,backgroundColor:0xf2f0eb,points:9,maxDistance:20,spacing:18,showDots:true,mouseControls:true,touchControls:true});return()=>effect?.destroy()},[]);
 return <div ref={ref} className="signal-field"/>;
}

export default function App(){
 useEffect(()=>{
  const lenis=new Lenis({autoRaf:true,anchors:true,smoothWheel:true});
  lenis.on("scroll",()=>ScrollTrigger.update());
  const ctx=gsap.context(()=>{
   gsap.utils.toArray(".reveal").forEach(el=>gsap.fromTo(el,{y:50,opacity:0},{y:0,opacity:1,duration:1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}}));
   gsap.utils.toArray(".project-card").forEach((el,i)=>gsap.fromTo(el,{y:70,rotateX:5,opacity:0},{y:0,rotateX:0,opacity:1,duration:.9,delay:(i%2)*.08,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}}));
   gsap.to(".hero-title",{yPercent:-18,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
   gsap.to(".hero-portrait",{yPercent:10,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
  });
  return()=>{ctx.revert();lenis.destroy()};
 },[]);
 return <main>
  <header className="nav"><a className="brand" href="#top">HC<span>/</span>26</a><nav><a href="#work">WORK</a><a href="#about">ABOUT</a><a href="#lab">LAB</a><a href="#contact">CONTACT</a></nav><span className="status"><i/> AVAILABLE FOR BUILDING</span></header>
  <section className="hero" id="top">
   <div className="hero-copy"><p className="eyebrow">CYBERSECURITY · SYSTEMS · RESEARCH</p><h1 className="hero-title"><TextReveal>HARI</TextReveal><br/><span className="outline">CHARAN</span></h1><p className="hero-sub">I explore systems, security and the space between <em>curiosity</em> and <em>craft.</em></p><div className="hero-actions"><a className="button dark" href="#work">Explore work <span>↘</span></a><a className="text-link" href="#about">Read the story</a></div></div>
   <div className="hero-visual"><div className="portrait-shell"><img className="hero-portrait" src="/portrait.jpg" alt="Hari Charan portrait" onError={e=>e.currentTarget.style.opacity=0}/><div className="portrait-fallback"><span>HC</span><small>IDENTITY / 01</small></div></div><HeroScene/><div className="hero-index">01 <span>/</span> 03</div></div>
   <div className="hero-meta"><span>BASED IN INDIA</span><span>COMPUTER SCIENCE · DIPLOMA</span><span>SCROLL TO EXPLORE ↓</span></div>
  </section>
  <section className="manifesto"><div className="section-kicker">01 — THE APPROACH</div><div className="manifesto-copy"><p className="big reveal">Not a “hacker” aesthetic. A <u>builder</u> who happens to think about security.</p><p className="body reveal">My work sits around cybersecurity, Linux, networking, web security, security tooling and practical experimentation. I like turning complex systems into things I can inspect, understand and improve.</p></div></section>
  <section className="work" id="work"><div className="section-head"><div><span className="section-kicker">02 — SELECTED WORK</span><h2>Systems I’ve<br/><i>built & explored.</i></h2></div><span className="count">03 PROJECTS</span></div><div className="project-grid">{projects.map(p=><a className="project-card" key={p.n} href={p.href} target={p.href.startsWith("http")?"_blank":undefined} rel="noreferrer"><div className="card-top"><span>{p.n}</span><span>{p.tag}</span></div><div className="project-mark">{p.title.slice(0,2)}</div><h3>{p.title}</h3><p>{p.text}</p><span className="card-arrow">↗</span></a>)}</div></section>
  <section className="lab" id="lab"><SignalField/><div className="lab-content"><span className="section-kicker">03 — THE LAB</span><h2>Learn.<br/><span>Experiment.</span><br/>Build.</h2><p>Every project is a checkpoint: observe the system, test an idea, document what changed, then build the next version.</p><div className="lab-stats"><div><strong>AI / ML</strong><span>Current specialization</span></div><div><strong>LINUX</strong><span>Daily environment</span></div><div><strong>SECURITY</strong><span>Long-term direction</span></div></div></div></section>
  <section className="about" id="about"><div className="about-image"><div className="about-photo"><img src="/portrait.jpg" alt="" onError={e=>e.currentTarget.style.opacity=0}/><span>PORTRAIT / 02</span></div></div><div className="about-copy"><span className="section-kicker">04 — ABOUT</span><h2>Curiosity is<br/><i>the engine.</i></h2><p>I’m a CSE diploma student at Siddaganga Polytechnic, focused on building practical cybersecurity skills while studying AI/ML.</p><p>I prefer hands-on work: Linux environments, security tooling, web technologies, networking, Java, Python and experiments that teach me how systems actually behave.</p><div className="details"><span>01 / SECURITY RESEARCH</span><span>02 / LINUX & NETWORKING</span><span>03 / SECURITY TOOLING</span><span>04 / AI / ML</span></div></div></section>
  <section className="contact" id="contact"><div className="contact-no">05</div><span className="section-kicker">05 — CONTACT</span><h2>Let’s build<br/><i>something useful.</i></h2><a className="contact-mail" href="https://github.com/Haricharan-20" target="_blank" rel="noreferrer">GITHUB / HARICHARAN-20 <span>↗</span></a><div className="contact-bottom"><span>SECURITY · SYSTEMS · CURIOSITY</span><span>© 2026 HARI CHARAN</span></div></section>
 </main>
}