/**
 * Editorial content.
 *
 * Written to describe how the work is done rather than to claim a history.
 * No employment, client, award, user or metric claims appear anywhere.
 */

export const hero = {
  eyebrow: 'SECURITY ENGINEERING · SYSTEMS · RESEARCH',
  title: ['HARI', 'CHARAN'],
  lede:
    'I work close to the system: reading how software actually behaves, building tooling that makes that behaviour legible, and keeping the evidence when an experiment changes my mind.',
  primaryCta: { label: 'READ THE WORK', href: '#work' },
  secondaryCta: { label: 'THE APPROACH', href: '#approach' },
  meta: ['INDIA', 'WEB · NETWORK · LINUX', 'TWO SYSTEMS IN PROGRESS'],
  statusLabel: 'SECURITY · SYSTEMS · RESEARCH',
};

export const approach = {
  eyebrow: '02 — APPROACH',
  title: ['I BUILD TO', 'understand.'],
  paragraphs: [
    'My work sits between security engineering and systems work. Most of it starts the same way: something behaves in a way I cannot explain, so I go down a layer — into the request, the socket, the process, the log — until the behaviour has a mechanism instead of a story.',
    'I would rather build the tool than argue about the theory. LEAF exists because ad-hoc research scripts do not survive their own output. MiniBurp exists because inspecting an app’s traffic should not require a second machine. Both are attempts to remove friction I kept running into.',
    'In practice that means Linux and the command line, HTTP and network protocols, and interfaces that stay out of the way of the work. When machine learning earns a place in that loop — classification, triage, pattern finding — I use it. Otherwise I leave it out.',
  ],
  principles: [
    {
      n: '01',
      title: 'OBSERVE BEFORE TOUCHING',
      detail: 'Understand the mechanism first. A fix that arrives before the diagnosis is a guess with better formatting.',
    },
    {
      n: '02',
      title: 'MAKE ACCESS EXPLICIT',
      detail: 'A tool should declare what it is allowed to do, and fail loudly when it is not. Silent privilege is how research becomes an accident.',
    },
    {
      n: '03',
      title: 'KEEP THE EVIDENCE',
      detail: 'If a run cannot be reconstructed afterwards — what ran, where, with what access — it did not produce knowledge.',
    },
  ],
  caption: { tag: 'FIELD NOTE / 02', text: 'A SYSTEM YOU HAVE NOT OBSERVED IS A SYSTEM YOU DO NOT YET UNDERSTAND' },
};

export const method = {
  eyebrow: '03 — METHOD',
  title: ['THE LOOP', 'I actually run.'],
  stages: [
    {
      key: 'OBSERVE',
      index: '01',
      detail:
        'Start from behaviour, not assumptions. Traffic, logs, process state — whatever shows what the system is actually doing rather than what it is supposed to do.',
    },
    {
      key: 'QUESTION',
      index: '02',
      detail:
        'Turn the observation into one testable claim. If a claim cannot be falsified by an experiment, it is not a question yet.',
    },
    {
      key: 'TEST',
      index: '03',
      detail:
        'Run the smallest experiment that can break the claim. Change one variable, hold the rest still, and note what the result rules out.',
    },
    {
      key: 'DOCUMENT',
      index: '04',
      detail:
        'Record what ran, in which environment, with which access. An undocumented result is an anecdote, and anecdotes do not compound.',
    },
    {
      key: 'ITERATE',
      index: '05',
      detail:
        'Rebuild the tool around what the system taught you, then run the loop again. The tooling is the part of the process that survives.',
    },
  ],
};

export const focus = {
  eyebrow: '04 — FOCUS',
  title: ['WHERE I', 'go deep.'],
  marquee: 'SECURITY · SYSTEMS · TOOLING · CURIOSITY · ',
  items: [
    { n: '01', title: 'WEB SECURITY', detail: 'Requests, sessions, browser behaviour, origin boundaries' },
    { n: '02', title: 'NETWORK SECURITY', detail: 'Protocols, traffic capture, interception, inspection' },
    { n: '03', title: 'LINUX + TOOLING', detail: 'Command-line workflows, reproducibility, small utilities' },
    { n: '04', title: 'SECURITY RESEARCH', detail: 'Form a hypothesis, test it, keep the trace' },
    { n: '05', title: 'SYSTEMS ENGINEERING', detail: 'Service lifecycles, permissions, failure behaviour' },
    { n: '06', title: 'INTERFACE DESIGN', detail: 'Making technical state legible rather than decorative' },
  ],
};

export const work = {
  eyebrow: '05 — SELECTED WORK',
  title: ['WORK THAT', 'behaves'],
  titleTail: 'LIKE A SYSTEM.',
  standfirst:
    'Two projects, documented from their actual implementation. The diagrams below are generated from what the code does — not from a mockup — and each project states plainly what is finished and what is not.',
  note: 'The repositories remain the source of truth. Where a capability is unfinished or scaffolded, it is labelled that way instead of being drawn as if it worked.',
};

export const contact = {
  eyebrow: '06 — CONTACT',
  title: ['LET’S BUILD', 'something useful.'],
  body:
    'Security engineering, systems work, tooling and research. If you are working on something in that space — or you want to compare notes on either project — the links below are the fastest way in.',
  links: [
    { label: 'GITHUB', value: 'Haricharan-20', href: 'https://github.com/Haricharan-20' },
    { label: 'EMAIL', value: 'haricharan9845@gmail.com', href: 'mailto:haricharan9845@gmail.com' },
    { label: 'INSTAGRAM', value: 'hari_charan_20', href: 'https://instagram.com/hari_charan_20' },
  ],
  meta: ['SECURITY · SYSTEMS · TOOLING', 'REACT · VITE · GSAP · THREE.JS'],
};

export const nav = [
  { label: 'APPROACH', href: '#approach' },
  { label: 'METHOD', href: '#method' },
  { label: 'FOCUS', href: '#focus' },
  { label: 'WORK', href: '#work' },
  { label: 'CONTACT', href: '#contact' },
];
