import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useReducedMotion, useCompactPointer } from '../../hooks/useMediaQuery';

const FLOW = [
  { n: '01', title: 'DEVICE', detail: 'An app opens a connection. Nothing is intercepted yet — traffic leaves the device normally.' },
  { n: '02', title: 'VPN / TUN', detail: 'A local Android VPNService takes the TUN interface, so packets arrive in user space.' },
  { n: '03', title: 'NATIVE', detail: 'libtun2socks.so — JNI nativeRun — converts the IP stream into a socket connection.' },
  { n: '04', title: 'SOCKS5', detail: 'Hev socks5-tunnel 2.18.0 terminates that stream as a SOCKS5 endpoint.' },
  { n: '05', title: 'INSPECT', detail: 'The proxy endpoint sees ordinary HTTP: requests, responses, headers, status, timing.' },
];

const REQUEST_LINES = [
  { label: 'Host', value: 'target.local' },
  { label: 'Accept', value: 'application/json' },
  { label: 'User-Agent', value: 'mobile-client' },
  { label: 'Authorization', value: '••••••••••••' },
];

const VERIFIED = [
  'libtun2socks.so — ELF64 DYN, AArch64',
  '16 KB LOAD alignment (0x4000)',
  'JNI exports nativeRun / nativeStop',
  'Hev exports main / quit',
  'No undefined global externals observed',
  'DT_NEEDED limited to liblog, libdl, libm, libc',
];

const PENDING = [
  'APK Gradle build and packaging of the native library',
  'System.loadLibrary and JNI invocation on a device',
  'TUN → tun2socks → SOCKS5 → proxy end-to-end capture',
  'Hev 2.18.0 configuration behaviour and DNS handling',
];

/**
 * MiniBurp's visual language: the path traffic takes once the on-device
 * interception stack is running, plus an explicit build gate that separates
 * what has been verified from what has not.
 */
export default function MiniBurpScene() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const compact = useCompactPointer();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const steps = el.querySelectorAll('[data-step]');
    const flowLine = el.querySelector('[data-flow]');
    const packets = el.querySelector('[data-packets]');
    const requestLines = el.querySelectorAll('[data-request]');
    const responseLine = el.querySelector('[data-response]');
    const timing = el.querySelector('[data-timing]');
    const gateItems = el.querySelectorAll('[data-gate]');
    const disclaimer = el.querySelector('[data-disclaimer]');

    if (reduced) {
      gsap.set([flowLine, packets, responseLine, timing, disclaimer], { opacity: 1 });
      gsap.set(flowLine, { scaleY: 1 });
      gsap.set(timing, { scaleX: 1 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      if (compact) {
        gsap.set(flowLine, { scaleY: 1 });
        gsap.set(packets, { opacity: 0 });
        gsap.set(timing, { scaleX: 1 });
        gsap.fromTo(
          [steps, requestLines, gateItems],
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.05,
            scrollTrigger: { trigger: el, start: 'top 78%', once: true },
          }
        );
        gsap.fromTo(
          [responseLine, disclaimer],
          { opacity: 0 },
          { opacity: 1, duration: 0.6, scrollTrigger: { trigger: el, start: 'top 65%', once: true } }
        );
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=190%',
          scrub: 0.55,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(flowLine, { scaleY: 0 }, { scaleY: 1, duration: 0.8 }, 0)
        .fromTo(packets, { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.02)
        .fromTo(packets, { yPercent: 0 }, { yPercent: 100, duration: 0.8 }, 0.02)
        .fromTo(steps, { opacity: 0.14, x: -18 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.13, ease: 'power2.out' }, 0.03)
        .fromTo(requestLines, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.14, stagger: 0.07, ease: 'power2.out' }, 0.42)
        .fromTo(responseLine, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.16 }, 0.66)
        .fromTo(timing, { scaleX: 0 }, { scaleX: 1, duration: 0.2 }, 0.7)
        .fromTo(gateItems, { opacity: 0.2 }, { opacity: 1, duration: 0.16, stagger: 0.05 }, 0.68)
        .fromTo(disclaimer, { opacity: 0 }, { opacity: 1, duration: 0.16 }, 0.78);
    }, el);

    return () => ctx.revert();
  }, [reduced, compact]);

  return (
    <figure className="scene scene--burp" ref={ref}>
      <div className="scene__hud">
        <span className="scene__tag">MINIBURP / NATIVE PATH</span>
        <ul className="scene__stats">
          <li>
            <b>arm64-v8a</b> target
          </li>
          <li>
            <b>ELF64</b> dyn
          </li>
          <li>
            <b>16 KB</b> alignment
          </li>
          <li>
            <b>Hev</b> 2.18.0
          </li>
        </ul>
      </div>

      <div className="burp__grid">
        <div className="burp__flow">
          <span className="burp__flow-line" data-flow />
          <span className="burp__packets" data-packets>
            <i />
            <i />
          </span>

          <ol className="burp__steps" aria-hidden="true">
            {FLOW.map((step) => (
              <li className="burp-step" data-step key={step.n}>
                <span className="burp-step__n">{step.n}</span>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="burp__inspector">
          <p className="burp__panel-label">INSPECTION SURFACE</p>

          <div className="burp__request">
            <p className="burp__request-line" aria-hidden="true">
              <b>GET</b> /api/session <em>HTTP/1.1</em>
            </p>
            <ul className="burp__headers" aria-hidden="true">
              {REQUEST_LINES.map((line) => (
                <li data-request key={line.label}>
                  <span>{line.label}:</span>
                  <b>{line.value}</b>
                </li>
              ))}
            </ul>
            <p className="burp__response-line" data-response aria-hidden="true">
              <b>200</b> OK
              <em>142 ms</em>
            </p>
            <div className="burp__timing" aria-hidden="true">
              <span data-timing />
            </div>
          </div>

          <p className="burp__disclaimer" data-disclaimer>
            Interface model — this is the inspection surface the pipeline is being built for, not a captured session.
            No traffic from a real device has been recorded yet.
          </p>
        </div>
      </div>

      <div className="burp__gate">
        <div className="burp__gate-col burp__gate-col--verified">
          <h4>VERIFIED</h4>
          <ul>
            {VERIFIED.map((item) => (
              <li data-gate key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="burp__gate-col burp__gate-col--pending">
          <h4>PENDING</h4>
          <ul>
            {PENDING.map((item) => (
              <li data-gate key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <figcaption className="scene__caption">
        <span className="chip chip--warn">NOT A FINISHED PRODUCT — THE ANDROID LAYER IS UNVALIDATED AT RUNTIME</span>
        <span className="scene__caption-text">
          The native library is complete and checked as an artefact. The application around it — build, load, capture —
          is still ahead, and the repository says so.
        </span>
      </figcaption>
    </figure>
  );
}
