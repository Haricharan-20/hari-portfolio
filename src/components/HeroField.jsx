import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Signal lattice behind the hero portrait.
 *
 * Kept deliberately cheap: static geometry, one requestAnimationFrame loop,
 * capped pixel ratio, and the loop stops entirely when the hero scrolls out of
 * view or the tab is hidden. Everything is disposed on unmount.
 */
export default function HeroField() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch {
      return undefined;
    }

    const compact = window.matchMedia('(max-width: 900px)').matches;
    const width = host.clientWidth || 1;
    const height = host.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.6);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.5));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    // Point lattice — one static buffer, no per-frame work.
    const count = compact ? 320 : 560;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.2 + Math.random() * 1.9;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pointMaterial = new THREE.PointsMaterial({
      color: 0x5ca6ff,
      size: 0.016,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    root.add(new THREE.Points(pointGeometry, pointMaterial));

    const coreGeometry = new THREE.IcosahedronGeometry(1.18, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x8fb8e8,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    root.add(core);

    const ringGeometry = [1.62, 2.08].map((radius, index) => new THREE.TorusGeometry(radius, index ? 0.006 : 0.012, 6, 128));
    const rings = ringGeometry.map((geometry, index) => {
      const ring = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color: index ? 0x9aa6b4 : 0x5ca6ff,
          transparent: true,
          opacity: index ? 0.14 : 0.34,
        })
      );
      ring.rotation.x = index * 0.5 + 0.2;
      ring.rotation.z = index * 0.2;
      root.add(ring);
      return ring;
    });

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.3;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.2;
    };

    let frame = 0;
    let visible = true;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;

      root.rotation.y += 0.0011;
      core.rotation.y -= 0.0016;
      rings.forEach((ring, index) => {
        ring.rotation.y += (index + 1) * 0.0007;
      });

      camera.position.x += (pointer.x - camera.position.x) * 0.03;
      camera.position.y += (-pointer.y - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    const resize = () => {
      const nextWidth = host.clientWidth || 1;
      const nextHeight = host.clientHeight || 1;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(host);

    const onVisibility = () => {
      visible = !document.hidden && visible;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      pointGeometry.dispose();
      pointMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      rings.forEach((ring) => {
        ring.geometry.dispose();
        ring.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero__field" ref={hostRef} aria-hidden="true" />;
}
