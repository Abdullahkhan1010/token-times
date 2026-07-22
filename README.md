# Token Times

A componentized rebuild of the Token Times homepage.

## What changed from the single-file version

- **One accent color.** Everything else stays on the original black / gold /
  neutral palette, but a single deep emerald (`accent: #0E7C61`, with
  `accent-dark` and a light `accent-container` tint) now marks every
  interactive or "live" element: the Subscribe button, active nav link +
  underline, hover states on cards and links, the ticker's live-dot, focus
  rings, and the CTA buttons in the Magazine and Featured Analysis sections.
  It reads as one deliberate signal color rather than a redesign.
- **Simple, restrained motion:**
  - `src/hooks/useReveal.js` + `src/components/Reveal.jsx` — a scroll-reveal
    wrapper (IntersectionObserver) used to fade/slide each section in once,
    with a small stagger on grid items like the hero sub-stories.
  - `.hover-lift` — a subtle lift + shadow + accent-border on card hover.
  - `.accent-underline` — an animated underline that grows in on hover for
    nav links and text links.
  - The ticker's live-dot uses a `pulse-dot` keyframe.
  - Everything respects `prefers-reduced-motion`.
- **Split into one file per section**, matching the requested structure —
  see the table below.

## Structure

```
src/
  App.jsx                  # composes every section
  main.jsx                 # React entry point
  index.css                # fonts, base styles, animation utilities
  data/content.js           # all copy/data, imported by the components
  hooks/useReveal.js
  components/
    Reveal.jsx              # scroll-reveal wrapper
    Header.jsx               → Logo, Date, Search, Subscribe, Login, Social
    Navigation.jsx            → Home / News / Magazine / Knowledge Hub /
                                 Regulations / Research / Resources /
                                 Events / About
    BreakingTicker.jsx
    Hero.jsx                  → top 5 featured stories (1 lead + 4 alongside)
    EditorsPick.jsx
    LatestNews.jsx
    PakistanFocus.jsx
    GlobalHighlights.jsx
    RegulatoryUpdates.jsx     → exports RegulatoryBriefings + RegulatoryTracker
    MarketsDashboard.jsx      → "coming soon" panel
    FeaturedAnalysis.jsx
    KnowledgeHub.jsx
    MagazineIssue.jsx
    ResearchPapers.jsx
    Interviews.jsx
    UpcomingEvents.jsx
    Newsletter.jsx
    Partners.jsx
    Footer.jsx
tailwind.config.js          # original design tokens + the one accent color
```

## Running it

```bash
npm install
npm run dev
```

This is a standard Vite + React + Tailwind setup — `tailwind.config.js`
carries over the exact colors, type scale, spacing, and radii from the
original design, plus the new `accent` tokens, so every className in the
components works natively with Tailwind's compiler (no hand-rolled CSS
needed, unlike the single-file sandbox version).
