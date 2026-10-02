# HARI reference design system

This document translates the supplied creative references into principles for Hari's
site. It is not a reproduction guide and does not copy branding, photography, layout
or source assets from any reference.

## Positioning

**A field notebook for security engineering and systems work** — authored for people
who care how software behaves beneath the interface.

Personality: **precise, restless, quietly cinematic**.

## Design movement

Editorial systems design with browser-as-instrument motion: a restrained print-like
identity is interrupted by live media, technical traces and state changes. The site
should feel closer to an annotated lab notebook or title sequence than a template
portfolio.

## Reference → observation → technique → Hari adaptation

| Reference | Observation | Technique | Hari adaptation |
| --- | --- | --- | --- |
| Eugene Wan | Identity is direct; the work is allowed to carry the personality. | Large name, sparse navigation, confident negative space. | Make `HARI / CHARAN` the first readable object and let the work explain the practice. |
| Etienne Studio | A simple information architecture can feel premium when typography and pacing are exact. | Few top-level destinations, consistent section rhythm. | Keep one page with a compact section nav: Approach, Method, Focus, Work, Contact. |
| Oscar Tao | The work index is part of the identity, not a utility appended to the page. | Persistent index, visible selection state, editorial counters. | Keep the project rail and make `01 LEAF / 02 MiniBurp` the site's central navigation object. |
| Pamidor Design | Selected work benefits from an adjacent sense of experimentation and capability. | Work + lab/skillset pairing. | Treat Method and Focus as a field guide around two evidence-led case studies. |
| MANA | The whole page can become an interactive visual world. | Atmosphere, continuous transitions, media as environment. | Use the supplied portfolio motion as the hero environment, with signal layers that hand off into technical scenes. |
| Giulio | Motion is authored and structural rather than decorative. | Choreographed transitions, controlled velocity, purposeful interaction. | Use GSAP/ScrollTrigger for the title sequence and scene handoffs; no random particle effects. |
| Lando Norris | Strong branded media can carry a clear identity without explaining itself as a media player. | Full-bleed footage, overlay typography, responsive crop. | The video is now full viewport, always present in the hero, and treated as a compositing layer. |
| OP.AL | Digital spaces can feel like tools: dense, navigable, and spatial. | Spatial UI, technical markers, systems of state. | HUD labels expose media state, pointer trace and scroll position without pretending they are product telemetry. |
| gallery-play | Playful interaction works when the interaction has a clear visual grammar. | Input-driven transitions and visual feedback. | Pointer movement perturbs the signal layer and reveals an authored blueprint trace. |
| One Curious Dsouza | A focused personal voice is stronger than a list of every capability. | Narrow positioning, selective proof. | Two projects only; no Nightfall, Termux Chat Bridge or unsupported claims. |
| Aperios Design | Restraint gives ambitious interactions somewhere to land. | Limited palette, typographic contrast, deliberate pauses. | Paper / ink / signal-blue palette, grotesk + serif + mono, no library showcase. |

## Core principles

1. **Evidence over theatre.** Motion should point at a mechanism, state or transition.
2. **One authored world.** The hero video, signal layer and project diagrams should
   feel like parts of the same visual instrument.
3. **Density with exits.** Technical detail can be dense, but hierarchy, whitespace and
   a short section nav must always tell the visitor where they are.
4. **Honesty is an interaction.** Finished, scaffolded and pending states are explicit;
   the interface never smooths over uncertainty.

## Color philosophy

- **Ink** is the working surface: deep, low-glare and technical.
- **Paper** is the editorial interruption: it makes copy feel considered rather than
  dashboard-like.
- **Signal blue** is the ownable Hari accent: it behaves like a trace, not a decoration.
- **Acid and warning** are reserved for system states in case studies, never used as
  generic neon.

## Layout paradigm

A vertical instrument rather than a centered grid: the hero is a sticky full-screen
scene over a longer scroll track; the work index pins like a console rail; case studies
use traces, gates, packets and tables. Asymmetric placement is allowed only when it
improves hierarchy or reflects a real system relationship.

## Signature elements

- Full-viewport motion footage with overlaid technical typography.
- Thin signal paths and labels that react to pointer position and scroll progress.
- Explicit state language: `LIVE`, `REST`, `VERIFIED`, `PENDING`, `SCAFFOLDED`.

## Interaction and animation rules

- GSAP + ScrollTrigger orchestrate title entrance, hero transformation and case-study
  scenes. Lenis remains the one smooth-scroll layer.
- Pointer interaction changes the signal field's position, strength and temporal decay;
  it does not create a generic cursor circle or particle trail.
- The hero video starts immediately where autoplay is allowed, loops silently and is
  never delayed behind a placeholder. Reduced-motion visitors still see the video,
  but the timeline, smooth scroll and signal response are at rest.
- Every loop and event listener has an off-screen, hidden-tab or reduced-motion exit.

## Implementation responsibility map

- `Interactive3DViewer` owns the shared Three.js renderer, camera, lights, pointer
  capture, React Spring rotation target/inertia, idle damping, DPR cap, intersection
  visibility and disposal.
- `LeafVisual` and `MiniBurpVisual` only provide the project-specific geometry. They
  do not duplicate renderer or input logic.
- GSAP + ScrollTrigger own section choreography and the hero's scroll-linked scene
  transformation. Lenis remains the single smooth-scroll layer.
- Motion.dev is used only for the Lab item's small spring hover lift. It does not
  compete with GSAP for page choreography.
- The custom cursor is desktop-only, hidden for coarse pointers and reduced motion;
  keyboard and touch controls never depend on it.

The main work section keeps written content short enough to scan. The old truthful
case-study state lists remain below each interactive visual, while the visual itself
communicates architecture rather than inventing runtime captures or dashboards.

## Typography system

- Display grotesk: compressed, heavy, all-caps identity statements.
- Editorial serif: italic line for reflective or human language.
- Technical mono: labels, counters, states, paths and evidence.

The hierarchy is intentionally asymmetric: display copy declares, serif copy softens,
and mono copy verifies.

## Brand voice

Headlines are short, declarative and a little self-interrogating. CTAs are verbs, not
sales language. Microcopy says what is true, including what is not complete.

Examples:

- `I work close to the system.`
- `The native library is complete and checked as an artefact. The application around it is still ahead.`

## Wordmark and ownable color

The `HC/26` mark is a compact engineering notebook stamp: initials, a slash that reads
like a path separator, and the current year as a version marker. Signal blue `#5ca6ff`
is the ownable accent — a cool trace that reads as diagnostic light against ink and
as a measured link state against paper.
