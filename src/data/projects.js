/**
 * Project data.
 *
 * Every claim below is traceable to the source repository. Nothing here is
 * inferred, estimated or decorative: LEAF's entries come from its Python
 * modules, and MiniBurp's entries come from its recovery checkpoint document
 * (README.md / MINIBURP_CHECKPOINT.md). Where a capability is scaffolded or
 * unfinished, the status field says so explicitly.
 */

export const projects = [
  {
    id: '01',
    slug: 'leaf',
    name: 'LEAF',
    subtitle: 'Layered Exploration & Analysis Framework',
    category: 'Python · Research runtime · CLI',
    thesis: 'A research runtime that refuses to run anything the environment is not explicitly authorised to do.',
    problem: [
      'Security experiments tend to live as loose scripts. Once a script has run, very little survives: no record of which environment it touched, which access it used, or whether the services it depended on were actually ready. Repeating the same investigation later means rebuilding context from memory.',
      'LEAF treats that as an architecture problem rather than a discipline problem. Access, services and experiments are declared up front, and every run leaves a durable, queryable trace.',
    ],
    approach: [
      'A capability layer declares the four kinds of access a run may need — system.read, network.read, browser.read, storage.read — and separates "does this capability exist" from "is it authorised here".',
      'Services declare the capability they require and move through an explicit lifecycle: initialise, start, become ready, stop. Nothing is assumed to be running because it was imported.',
      'Experiments are declarative: name, description, version, category, risk level and required capabilities and services live on the class. A preflight check resolves those requirements into READY or NOT READY, reporting each capability and service as available, unauthorised, unknown or not ready before a single line of experiment code executes.',
      'Execution is instrumented end to end. The runner opens a session, builds an execution context, starts the services, runs the experiment and persists the resulting event to SQLite — so a run can be reconstructed afterwards by session, by event type, or in full.',
    ],
    stack: ['Python 3', 'SQLite (stdlib)', 'Plugin loader', 'CLI REPL', 'Dataclass capabilities'],
    capabilities: [
      {
        label: 'Capability authorisation',
        detail: 'Four declared capabilities, each resolvable as allowed or denied, with unknown and unauthorised reported separately during preflight.',
      },
      {
        label: 'Service lifecycle + readiness',
        detail: 'A service registry that initialises, starts, stops and reports readiness per service, and blocks execution when a required service is not ready.',
      },
      {
        label: 'Experiment catalog',
        detail: 'Built-in experiments plus a plugin discovery path that registers third-party experiments into the same catalog.',
      },
      {
        label: 'Requirement preflight',
        detail: 'READY / NOT READY reports that name exactly which capability or service blocked a run, before the run starts.',
      },
      {
        label: 'Event engine',
        detail: 'Typed events carrying event type, source, session id, timestamp and structured data, emitted through a capability-checked service.',
      },
      {
        label: 'Session persistence',
        detail: 'SQLite storage with sessions and events tables, queried by type, by session, or in sequence.',
      },
    ],
    facts: [
      { k: 'Interface', v: 'LEAF> interactive CLI' },
      { k: 'Commands', v: 'experiments · requirements · capabilities · run · sessions · events' },
      { k: 'Storage', v: 'SQLite — sessions, events' },
      { k: 'Repository', v: 'github.com/Haricharan-20/LEAF' },
    ],
    state: {
      summary:
        'The runtime core is implemented and usable from the CLI: capability checks, service lifecycle, the experiment catalog, requirement preflight, event emission and session storage all work together.',
      done: [
        'Core runtime, service registry and capability manager',
        'Experiment catalog with plugin discovery',
        'Requirement preflight reporting',
        'SQLite session and event persistence',
        'CLI covering experiments, capabilities, services, sessions and events',
      ],
      pending: [
        'One built-in experiment (system_info) plus one example plugin — the catalog is small',
        'analysis/headers.py, cookies.py and origins.py are scaffolded placeholders, not implemented',
        'No test suite in the repository yet',
      ],
    },
    links: [
      {
        label: 'github.com/Haricharan-20/LEAF',
        href: 'https://github.com/Haricharan-20/LEAF',
        note: 'Public repository',
      },
    ],
  },
  {
    id: '02',
    slug: 'miniburp',
    name: 'MiniBurp',
    subtitle: 'On-device Android HTTP interception',
    category: 'Android · Kotlin + native · VPN/TUN',
    thesis: 'Move HTTP inspection onto the device itself, so capturing an app’s traffic does not require tethering it to a laptop.',
    problem: [
      'Inspecting the traffic an Android app produces normally means a laptop, a proxy and a device pointed at it. That works at a desk and stops working everywhere else, and it makes the capture depend on a second machine that has to be configured identically every time.',
      'Android also makes this harder than a desktop: a user-space app cannot simply read another app’s sockets, so interception has to be built on the platform’s own VPN and TUN interfaces, with the network stack pushed into native code.',
    ],
    approach: [
      'The device runs a local VPN service that takes the TUN interface. Traffic leaving the device is handed to a native tun2socks implementation — Hev’s socks5-tunnel, pinned at tag 2.18.0 — which converts the IP stream into a SOCKS5 connection.',
      'That SOCKS5 connection is where inspection belongs: the proxy endpoint receives normal HTTP requests, so requests, responses, headers, status codes and timings can be read and modified on the device instead of on a second machine.',
      'The native layer is treated as a build-engineering problem with reproducible constraints: a pinned upstream tag, an explicit include surface, a deliberate exclusion of upstream’s JNI shim, a documented link strategy for the task-system archive, and a fixed optimisation clamp so the artefact can be rebuilt byte-for-byte on a different toolchain.',
    ],
    stack: ['Kotlin', 'Android VPNService + JNI', 'C (Hev socks5-tunnel 2.18.0)', 'tun2socks', 'SOCKS5', 'Gradle'],
    capabilities: [
      {
        label: 'TUN-based capture',
        detail: 'A VPN service that owns the TUN interface, so traffic is intercepted at the IP layer rather than per-app.',
      },
      {
        label: 'Native tunnelling',
        detail: 'libtun2socks.so converts the TUN stream into SOCKS5, exposing traffic to an inspector instead of an opaque socket.',
      },
      {
        label: 'JNI boundary',
        detail: 'nativeRun / nativeStop exports give Kotlin explicit control over the tunnel lifecycle rather than an opaque background thread.',
      },
      {
        label: 'Reproducible native build',
        detail: 'Pinned Hev tag, fixed optimisation clamp, isolated TMPDIR and a documented final-link workaround — the build is specified, not incidental.',
      },
    ],
    facts: [
      { k: 'Native artefact', v: 'libtun2socks.so · ELF64 DYN · AArch64' },
      { k: 'Page alignment', v: '16 KB LOAD alignment (0x4000)' },
      { k: 'JNI exports', v: 'nativeRun · nativeStop' },
      { k: 'Native deps', v: 'liblog · libdl · libm · libc only' },
      { k: 'Last checkpoint', v: '2026-10-02 — Module B native layer complete' },
    ],
    state: {
      summary:
        'The native layer is complete and verified as an artefact. The Android application around it is not yet validated at runtime, so this is an interception stack in progress, not a finished product.',
      done: [
        'Native library built for arm64-v8a with 16 KB page alignment',
        'JNI and Hev entry points exported and checked',
        'Runtime dependencies reduced to the four Android/glibc libraries',
        'Build decisions documented for reproduction',
      ],
      pending: [
        'APK Gradle build and packaging of the native library',
        'System.loadLibrary and JNI invocation verified on a device',
        'TUN → tun2socks → SOCKS5 → proxy end-to-end capture',
        'Hev 2.18.0 configuration behaviour and DNS handling',
      ],
    },
    links: [
      {
        label: 'github.com/Haricharan-20',
        href: 'https://github.com/Haricharan-20',
        note: 'Repository is private — available on request',
      },
    ],
  },
];

export const projectIndex = projects.map(({ id, slug, name, category }) => ({ id, slug, name, category }));
