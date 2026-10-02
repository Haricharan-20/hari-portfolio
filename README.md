# hari-portfolio

Personal portfolio — security engineering, systems work and practical tooling.
Single-page React application built with Vite, animated with GSAP + Lenis, with a
deliberately minimal WebGL field behind the hero.

Live case studies: **LEAF** (Python research runtime) and **MiniBurp** (on-device
Android HTTP interception).

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server with fast refresh
npm run build    # production build → dist/
npm run preview  # serve the production build locally (port 4173)
```

Requires Node 20+ (developed against Node 22).

## Structure

```
index.html                 document shell: meta, fonts, JSON-LD
vite.config.js             Vite + React plugin, allowed hosts for previews
public/
  favicon.svg              mark
  robots.txt
  assets/                  optimized media (hero, editorial, hero clip)
src/
  main.jsx                 entry
  App.jsx                  page composition, smooth scroll, anchor handling
  data/
    profile.js             editorial copy: hero, approach, method, focus, contact
    projects.js            project records — every claim traces to a repository
  hooks/
    useMediaQuery.js       media query + reduced-motion + compact-pointer hooks
    useSmoothScroll.js     Lenis bound to the GSAP ticker; anchor routing
  lib/gsap.js              GSAP + ScrollTrigger registration, shared easing
  components/
    Nav.jsx                fixed bar, scroll progress, accessible mobile panel
    Hero.jsx               entrance choreography, deferred media
    HeroField.jsx          three.js field, lazily imported, pauses off-screen
    Approach.jsx  Method.jsx  Focus.jsx
    Work.jsx               work section shell + project index rail
    work/ProjectChapter.jsx  case-study layout shared by both projects
    work/LeafScene.jsx       LEAF runtime trace scene
    work/MiniBurpScene.jsx   MiniBurp packet-path scene
    Contact.jsx  Footer.jsx
    ui/Reveal.jsx          masked line reveals, block reveals, accessible splitting
    ui/Magnetic.jsx        pointer-follow interaction (fine pointers only)
    ui/Picture.jsx         WebP-first image with fallback
  styles/
    tokens.css             colour, type scale, spacing, motion tokens
    base.css               reset, typography primitives, focus, reveals
    sections.css           navigation, hero, approach, method, focus, contact
    work.css               project index, chapters, both scene languages
docs/AUDIT.md              audit of the previous build + change record
```

## Content rules

These are load-bearing; please keep them when editing:

1. **Two featured projects only** — LEAF and MiniBurp. Nightfall and Termux Chat Bridge
   are intentionally not part of the portfolio.
2. **No invented facts.** No employment, client, award, user, revenue, certification,
   deployment or metric claims. Technical statements must be traceable to a repository.
3. **Unfinished work is labelled unfinished.** LEAF's analysis modules are scaffolded
   placeholders and the site says so. MiniBurp's Android layer is unvalidated at runtime
   and the build gate says so.
4. **Diagrams mirror the code.** The LEAF scene shows the real command surface, capability
   names and SQLite columns; the MiniBurp scene shows the real native artefact properties
   and the verified/pending split.
5. **MiniBurp's repository is private.** The link points at the GitHub profile and says the
   repository is private. If it is made public, update `src/data/projects.js`.

## Motion and accessibility

- `prefers-reduced-motion: reduce` disables Lenis smooth scrolling, GSAP scroll
  choreography, the WebGL field and the hero clip. Content is presented at rest.
- The WebGL frame loop stops when the hero leaves the viewport or the tab is hidden.
- All imagery is lazy except the hero; every scroll animation is scoped with
  `gsap.context()` and reverted on unmount.

## Deployment

Configured for Vercel (`vercel.json`: framework `vite`, output `dist`, security headers).

```bash
npm run build
# then either connect the repository in Vercel, or:
npx vercel --prod
```

Any static host works — `dist/` is self-contained apart from the Google Fonts request.