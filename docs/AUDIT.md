# Portfolio audit and upgrade record

Scope: `Haricharan-20/hari-portfolio` (Vite + React single-page portfolio).

Method: the repository was cloned and read in full before any change — `package.json`,
`index.html`, `src/App.jsx` (693 lines), `src/styles.css` (215 lines), every file in
`public/assets`, and the build output. Project copy was checked against the actual
repositories: `Haricharan-20/LEAF` (Python, public) and the MiniBurp recovery
repository (Android/Kotlin + native, private) including `MINIBURP_CHECKPOINT.md`.
No claim in the rebuilt site is drawn from anything other than those sources.

---

## 1. Baseline (before changes)

| Item | Value |
| --- | --- |
| Framework | React 19.3 + Vite 8.3, no `vite.config.js` present |
| Animation | GSAP 3.15, Lenis 1.3, anime.js 4.5, three.js 0.186, **Vanta 0.5** |
| Source layout | `App.jsx` (693 lines, 8 components inline), `styles.css` (215 lines) |
| Production JS | **1,151 kB (326 kB gzip)** in a single chunk, no code splitting |
| Production CSS | 20.2 kB (5.8 kB gzip) |
| Public assets | **2.7 MB** — 2.29 MB MP4, two JPEGs, one broken SVG |
| Build | `vite build` succeeded; "chunk larger than 500 kB" warning |

### P0 problems found

1. **Two of four featured projects had to go.** `PROJECT NIGHTFALL` and
   `TERMUX CHAT BRIDGE` were still in the project array, presented as work.
2. **`public/assets/leaf-architecture.svg` was a 6-byte binary fragment** — the
   headline LEAF visual was a broken image reference.
3. **MinBurpSuite linked to `#contact`**, i.e. a project card with no destination.
4. **The build shipped a 1.15 MB single bundle** with three.js, Vanta, GSAP and
   anime.js all in the critical path.
5. **`prefers-reduced-motion` was only handled in CSS.** GSAP timelines, ScrollTrigger
   pinning, Lenis smooth scrolling, the three.js render loop and the Vanta loop all
   kept running for visitors who asked for less motion.
6. **Continuous animation loops ran unconditionally**: three.js RAF, Vanta RAF,
   CSS marquee, scan line, pulse dot — even when scrolled out of view or hidden.
7. **Navigation disappeared on mobile** (`@media(max-width:900px){.nav nav{display:none}}`)
   with no menu replacement — no way to reach any section except scrolling.

### P1 problems

8. The supplied motion asset was treated as a secondary right-column clip rather
   than the hero environment required by the creative brief.
9. Every character split into its own `<span>` with no `aria-hidden` — screen readers
   could read headings letter by letter.
10. No skip link, no visible `:focus-visible` styling, nav panel/`aria-expanded`
    absent, decorative art exposed to assistive tech.
11. Body text at `#8e969f` on paper `#f1f2ee` ≈ **2.9:1 contrast** — below WCAG AA.
12. Contact section loaded the full Vanta + three.js stack for a background effect.
13. Single monolithic stylesheet with no type scale, no tokens, ad-hoc values
    (`.project-card-bottom h3{font-size:clamp(42px,5.8vw,82px)}` etc.).
14. Four project cards stacked in a pinned scroll deck — an interaction designed for
    quantity, not for explaining two serious projects.

### P2 / P3

15. No `vite.config.js`, so `@vitejs/plugin-react` was an unused dependency (no fast
    refresh, no explicit JSX configuration).
16. Dependencies pinned to `"latest"` in `package.json`, so installs drift.
17. `meta` tags limited to description/title: no Open Graph, no Twitter card, no
    structured data, no favicon, no robots.txt.
18. Unused CSS class surface left over from earlier iterations, `!important` flags,
    dead selectors.

### What was already strong (and was kept)

- A real editorial art direction: monochrome foundation, restrained blue accent,
  grain overlay, asymmetric split hero, serif/sans/mono contrast.
- The typographic voice of the copy and the section rhythm (hero → about → journey →
  focus → work → contact).
- The 3D hero concept, the marquee, the scroll-scrubbed journey track and the
  project index counter — all good ideas, kept in refined form.
- Honest, non-hype writing style. Nothing claimed celebrity, scale or revenue.

---

## 2. Prioritised backlog and what happened to it

| # | Priority | Item | Status |
| --- | --- | --- | --- |
| 1 | P0 | Reduce featured projects to LEAF + MiniBurp; remove Nightfall and Termux Chat Bridge from data, visuals and copy | **Done** |
| 2 | P0 | Remove any VulnScope / OMNIA-X reference | **Done** (verified: 0 matches in rendered text) |
| 3 | P0 | Replace broken `leaf-architecture.svg` with a real, data-driven LEAF figure | **Done** (asset deleted; figure rebuilt from repository facts) |
| 4 | P0 | Give MiniBurp a truthful destination and status | **Done** (private-repo link + explicit verified/pending evidence) |
| 5 | P0 | Code-split three.js and remove unused animation dependencies | **Done** (bundle 326 → 132 kB gzip initial) |
| 6 | P0 | Honour `prefers-reduced-motion` in JavaScript, not only CSS | **Done** |
| 7 | P0 | Stop off-screen and hidden animation loops | **Done** |
| 8 | P0 | Rebuild navigation for mobile with an accessible menu | **Done** |
| 9 | P1 | Optimise media: video, images, WebP alternatives, lazy loading | **Done** (2.7 MB → 796 kB) |
| 10 | P1 | Accessibility pass: skip link, focus states, landmarks, alt text, heading order, ARIA on decorative art | **Done** |
| 11 | P1 | Fix contrast in body copy and dim labels | **Done** (all tokens ≥ 4.5:1) |
| 12 | P1 | Replace Vanta with a lightweight contact background | **Done** (dependency removed) |
| 13 | P1 | Introduce a token-based design system and typography hierarchy | **Done** |
| 14 | P1 | Redesign the project experience as two case studies with distinct visual languages | **Done** |
| 15 | P2 | Add `vite.config.js` with the React plugin; pin dependency versions | **Done** |
| 16 | P2 | SEO/meta: Open Graph, Twitter card, JSON-LD, favicon, robots.txt | **Done** |
| 17 | P2 | Responsive behaviour designed per breakpoint rather than shrunk | **Done** |
| 18 | P2 | Dead code, duplicated systems, `!important` | **Done** (source restructured into 20 focused modules) |
| 19 | P3 | Experimental interaction: magnetic CTA, scrubbed schematic scenes, index rail scroll-spy | **Done** |
| 20 | P3 | WebGL as information architecture rather than decoration | **Partially** — hero field kept deliberately minimal; the project scenes use DOM/SVG so their content stays accessible |

---

## 3. What changed

### Content

- Featured work is exactly two projects: **LEAF** and **MiniBurp**.
- Both case studies were written from source:
  - **LEAF** — capability layer (`system.read`, `network.read`, `browser.read`,
    `storage.read`), service lifecycle and readiness, experiment catalog with plugin
    discovery, requirement preflight (`READY` / `NOT READY`), typed event engine,
    SQLite `sessions` / `events` persistence, and the real CLI command surface.
  - **MiniBurp** — Android VPN/TUN capture path, `libtun2socks.so` (ELF64 DYN,
    AArch64, 16 KB `LOAD` alignment, JNI `nativeRun`/`nativeStop`, Hev 2.18.0), and a
    verified/pending build gate.
- Unsupported or unfinished parts are labelled as such in the interface itself:
  LEAF's `analysis/headers.py`, `cookies.py` and `origins.py` are empty files and are
  presented as scaffolded, not working. MiniBurp's unvalidated Android layer is
  presented as pending, and the inspection panel is labelled an interface model
  rather than a captured session.
- No employment, client, award, metric or deployment claim exists anywhere on the site.

### Visual and interaction

- New design system (`src/styles/tokens.css`): colour, a seven-step type scale, spacing,
  radii and motion tokens; three type roles (grotesk display, serif editorial accent,
  technical mono) applied to a defined hierarchy.
- Hero: masked line-entrance, outlined second line, technical HUD, deferred WebGL field,
  3D loop paused when off-screen or when the tab is hidden.
- Second pass: the supplied 8-second `portfolio-motion.mp4` is now the full-viewport
  hero environment on desktop and mobile. Title, navigation, HUD and signal paths sit
  over the footage; pointer movement drives a decaying blueprint trace and scroll
  progress zooms the scene into the rest of the page.
- Work: a sticky project index rail with scroll-spy, then one chapter per project —
  problem, approach, stack, capabilities, current state, repository, and a
  scroll-scrubbed scene that gives each project its own visual language:
  - **LEAF** — a runtime trace: CLI → experiment catalog → preflight gate → event
    engine → SQLite store, with the real CLI output format and the real table columns.
  - **MiniBurp** — a packet path: device → TUN → native → SOCKS5 → inspection, an
    inspector panel, and a verified/pending gate.
- Approach, method and focus sections refined; method stage track now carries real
  per-stage copy instead of decoration.

### Technical

- `src/App.jsx` (693 lines) replaced by a component tree: `Nav`, `Hero`, `HeroField`,
  `Approach`, `Method`, `Focus`, `Work`, `work/ProjectChapter`, `work/LeafScene`,
  `work/MiniBurpScene`, `Contact`, `Footer`, plus `ui/` primitives and hooks.
- `three.js` is loaded through `React.lazy` and only when motion is allowed, so it no
  longer blocks first paint.
- Closed-out animation loops; `IntersectionObserver` + `visibilitychange` gate the
  WebGL frame loop; every listener, GSAP context and WebGL object is disposed.
- `vite.config.js` added; dependency versions pinned; `vanta` and `animejs` removed
  (all motion now runs through GSAP, Lenis and CSS — two fewer libraries shipped).

### Dependencies

| Removed | Added |
| --- | --- |
| `vanta` 0.5 (contact background) | — |
| `animejs` 4.5 (magnetic hover, marquee, pulse — replaced by GSAP `quickTo` and CSS) | — |

`gsap`, `lenis`, `react`, `react-dom`, `three` remain, each with a defined role.

---

## 4. Verification

Run after the final build (`npm run build`, Vite 8.3):

| Metric | Before | After |
| --- | --- | --- |
| Initial JS (gzip) | 326.1 kB | **132.5 kB** |
| Lazy WebGL chunk (gzip) | — (in main bundle) | 132.4 kB, on demand |
| CSS (gzip) | 5.8 kB | 8.0 kB |
| `public/` assets | 2.7 MB | **796 kB** |
| Console errors / warnings | not measured | **0** (only a headless WebGL readback advisory) |
| Horizontal overflow | — | **0 px** at 390, 834, 1440, 1920 |

Automated checks (Playwright, headless Chromium):

- Console and `pageerror` capture at 390 / 834 / 1440 / 1920 px and with
  `prefers-reduced-motion: reduce`: no errors, no failed requests.
- `document.scrollWidth === window.innerWidth` at every breakpoint tested.
- No broken images; no Nightfall / Termux / VulnScope / OMNIA-X strings in the rendered
  document; exactly two project chapters.
- Mobile menu: opens, exposes a full-height panel, traps scroll, closes on `Escape`
  and returns focus to the toggle.
- Contrast audit of every text token against its background: minimum 5.10:1 (AA).
- Heading outline is `h1 → h2 → h3 → h4` in order, with no skipped levels.

---

## 5. Remaining issues

1. **MiniBurp's repository is private.** The case study links to the GitHub profile and
   states the repository is private rather than pointing at a URL that would 404. If the
   repository is made public, the link should be changed to
   `https://github.com/Haricharan-20/MiniBurp` in `src/data/projects.js`.
2. **LEAF has no README in its repository.** The case study describes what the code does,
   but the project itself would benefit from a written readme.
3. The full-viewport hero uses the supplied 8-second grayscale clip (approximately
   467 kB). It is loaded immediately, responsive-cropped and still visible for
   reduced-motion visitors; reduced motion pauses playback and removes choreography.
4. Both project scenes are scroll-scrubbed and pinned on desktop. On small screens they
   fall back to sequential reveals; this is deliberate, but it means the scene
   storytelling is not identical across devices.
5. The site is a single page with no routing. If additional case studies are added,
   they should become real routes rather than another pinned chapter.
6. No automated test suite or CI workflow exists in the repository yet.

---

## 6. Creative-engineering second pass

The supplied reference brief is translated in [REFERENCE-DESIGN-SYSTEM.md](REFERENCE-DESIGN-SYSTEM.md).
The implementation deliberately does **not** add Theatre.js, Rive, Spline or PixiJS
merely to expand the dependency list. GSAP + ScrollTrigger owns page choreography,
Lenis owns smooth scrolling, React Spring owns project drag/inertia, and Motion.dev
is limited to a local Lab-item hover lift. The hero's signal layer remains SVG/CSS so
it stays crisp, inspectable and inexpensive.

### Master upgrade implementation

- Added a shared `Interactive3DViewer` with Three.js geometry, studio lighting,
  camera perspective, pointer capture, React Spring rotation targets/inertia, idle
  damping, mobile simplification, IntersectionObserver visibility, hidden-tab pause,
  DPR caps and disposal.
- Added `LeafVisual` and `MiniBurpVisual` configuration wrappers. LEAF uses runtime,
  service, event and storage geometry; MiniBurpSuite uses device, TUN, native, SOCKS5
  and inspection geometry. Both are architecture studies, not fabricated captures.
- Added an optional Lab section and a desktop-only custom cursor. Existing written
  state and verified/pending distinctions remain below each visual.
- The project index remains limited to LEAF and MiniBurpSuite.
