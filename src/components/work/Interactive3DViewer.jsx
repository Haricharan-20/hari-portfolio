import { useEffect, useRef } from 'react';
import { useSpringValue } from '@react-spring/web';
import * as THREE from 'three';
import { useReducedMotion, useCompactPointer } from '../../hooks/useMediaQuery';

const ACCENTS = {
  signal: 0x5ca6ff,
  cyan: 0x8ce7e3,
  graphite: 0x202730,
  silver: 0xb4c0cb,
  ink: 0x07090c,
  acid: 0xcdf564,
};

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.5, ...options });
}

function line(points, color = ACCENTS.signal, opacity = 0.55) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const mesh = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  return mesh;
}

function addLeafVisual(root, simplified) {
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(simplified ? 0.95 : 1.15, 1),
    material(ACCENTS.graphite, { wireframe: true, emissive: ACCENTS.signal, emissiveIntensity: 0.16 })
  );
  root.add(core);

  const layers = [
    [1.55, 0.025, ACCENTS.signal, 0.52],
    [1.95, 0.014, ACCENTS.silver, 0.32],
  ];
  layers.forEach(([radius, tube, color, opacity], index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, 8, simplified ? 48 : 96),
      material(color, { transparent: true, opacity, emissive: color, emissiveIntensity: 0.18 })
    );
    ring.rotation.set(index * 0.65 + 0.4, index * 0.25, index * -0.45);
    root.add(ring);
  });

  const nodePoints = [
    [-1.9, 0.72, 0.2], [1.72, 0.7, -0.16], [-1.28, -0.9, 0.35], [1.25, -0.96, -0.28],
  ];
  nodePoints.forEach(([x, y, z], index) => {
    const node = new THREE.Mesh(new THREE.SphereGeometry(simplified ? 0.075 : 0.1, 12, 12), material(index % 2 ? ACCENTS.cyan : ACCENTS.signal, { emissive: index % 2 ? ACCENTS.cyan : ACCENTS.signal, emissiveIntensity: 0.7 }));
    node.position.set(x, y, z);
    root.add(node);
    root.add(line([new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)], index % 2 ? ACCENTS.cyan : ACCENTS.signal, 0.28));
  });

  const storage = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.16, 32), material(ACCENTS.silver, { wireframe: true, transparent: true, opacity: 0.55 }));
  storage.position.y = -1.55;
  storage.rotation.x = Math.PI / 2;
  root.add(storage);
}

function addMiniBurpVisual(root, simplified) {
  const phone = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 2.75, 0.18, 4, 4, 1),
    material(ACCENTS.graphite, { metalness: 0.78, roughness: 0.28 })
  );
  root.add(phone);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.24, 2.42), material(ACCENTS.ink, { emissive: ACCENTS.signal, emissiveIntensity: 0.18, roughness: 0.35 }));
  screen.position.z = 0.1;
  root.add(screen);

  const steps = [
    [-1.8, 1.45, ACCENTS.cyan],
    [-1.8, 0.55, ACCENTS.signal],
    [-1.8, -0.35, ACCENTS.silver],
    [-1.8, -1.25, ACCENTS.acid],
  ];
  steps.forEach(([x, y, color], index) => {
    const node = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.28, 0.12), material(color, { emissive: color, emissiveIntensity: 0.4 }));
    node.position.set(x, y, 0);
    root.add(node);
    root.add(line([new THREE.Vector3(x + 0.25, y, 0), new THREE.Vector3(-0.78, y, 0)], color, 0.48));
    if (!simplified && index < steps.length - 1) root.add(line([new THREE.Vector3(x, y - 0.18, 0), new THREE.Vector3(x, y - 0.72, 0)], color, 0.3));
  });

  const socket = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.035, 8, 36), material(ACCENTS.signal, { emissive: ACCENTS.signal, emissiveIntensity: 0.6 }));
  socket.position.set(-2.15, -1.8, 0);
  socket.rotation.x = Math.PI / 2;
  root.add(socket);
  root.add(line([new THREE.Vector3(-1.8, -1.25, 0), new THREE.Vector3(-2.15, -1.8, 0)], ACCENTS.signal, 0.45));
}

export default function Interactive3DViewer({ kind = 'leaf', title, labels = [] }) {
  const hostRef = useRef(null);
  const rootRef = useRef(null);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const idleRef = useRef(false);
  const reduced = useReducedMotion();
  const compact = useCompactPointer();
  const rotation = useSpringValue(0, { config: { mass: 1.1, tension: 180, friction: 28 } });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !compact, powerPreference: 'low-power' });
    } catch {
      return undefined;
    }

    const width = host.clientWidth || 1;
    const height = host.clientHeight || 1;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 0.15, kind === 'leaf' ? 7.2 : 7.6);
    camera.lookAt(0, 0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.15 : 1.5));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xaec7e8, 0x07090c, 1.25));
    const key = new THREE.DirectionalLight(0xffffff, 2.3);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.PointLight(kind === 'leaf' ? ACCENTS.signal : ACCENTS.cyan, 3.2, 8);
    rim.position.set(-3, 1.5, 3);
    scene.add(rim);

    const root = new THREE.Group();
    root.scale.setScalar(kind === 'leaf' ? 1 : 0.92);
    scene.add(root);
    rootRef.current = root;
    if (kind === 'leaf') addLeafVisual(root, compact); else addMiniBurpVisual(root, compact);

    const pointer = { x: 0, y: 0 };
    let frame = 0;
    let visible = true;
    let lastTime = performance.now();
    let idle = 0;

    const onPointerMove = (event) => {
      if (!draggingRef.current) return;
      const delta = event.clientX - lastXRef.current;
      lastXRef.current = event.clientX;
      velocityRef.current = delta * 0.012;
      rotation.start(rotation.get() + delta * (compact ? 0.012 : 0.009), { config: { tension: 240, friction: 32 } });
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.6;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.35;
    };
    const onPointerDown = (event) => {
      draggingRef.current = true;
      idleRef.current = false;
      lastXRef.current = event.clientX;
      velocityRef.current = 0;
      host.setPointerCapture?.(event.pointerId);
      host.classList.add('is-dragging');
    };
    const onPointerUp = (event) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      host.releasePointerCapture?.(event.pointerId);
      host.classList.remove('is-dragging');
      rotation.start(rotation.get() + velocityRef.current * 34, { config: { mass: 1.3, tension: 88, friction: 18 } });
      window.setTimeout(() => { idleRef.current = true; }, 1100);
    };
    const resize = () => {
      const nextWidth = host.clientWidth || 1;
      const nextHeight = host.clientHeight || 1;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.05 });
    observer.observe(host);

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const dt = Math.min(32, now - lastTime);
      lastTime = now;
      if (!reduced && idleRef.current && !draggingRef.current) idle += dt * 0.00012;
      const targetRotation = rotation.get() + idle;
      root.rotation.y = targetRotation;
      root.rotation.x += ((pointer.y * 0.08) - root.rotation.x) * 0.035;
      root.rotation.z += ((pointer.x * 0.035) - root.rotation.z) * 0.035;
      renderer.render(scene, camera);
    };

    host.addEventListener('pointerdown', onPointerDown);
    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerup', onPointerUp);
    host.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('resize', resize);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeEventListener('pointerdown', onPointerDown);
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerup', onPointerUp);
      host.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('resize', resize);
      root.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach((item) => item.dispose());
          else child.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [compact, kind, reduced, rotation]);

  return (
    <div className={'viewer viewer--' + kind}>
      <div className="viewer__canvas" ref={hostRef} role="img" aria-label={title + ' interactive 3D architecture visual'} />
      <div className="viewer__labels" aria-hidden="true">
        {labels.map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="viewer__hint"><span aria-hidden="true">←</span> DRAG TO EXPLORE 360° <span aria-hidden="true">→</span></p>
    </div>
  );
}
