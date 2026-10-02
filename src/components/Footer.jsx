export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer__name">HARI CHARAN — SECURITY / SYSTEMS / RESEARCH</p>
      <p className="footer__build">
        © {year} · REACT · VITE · GSAP · LENIS · THREE.JS
      </p>
      <a className="footer__top" href="#top">
        BACK TO TOP
        <span aria-hidden="true">↑</span>
      </a>
    </footer>
  );
}
