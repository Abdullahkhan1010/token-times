# Admin Panel Components

Drop the `components/` files into `src/components/` and `adminContent.js`
into `src/data/` of the existing Token Times project. Then mount the panel
behind your admin route:

```jsx
import AdminShell from "./components/AdminShell";

// e.g. in your router:
<Route path="/admin/*" element={<AdminShell />} />
```

`AdminShell` is the only thing you need to import — it owns the page state
(Home / AI Queue / Published / Archived / Analytics) and renders the right
page based on the side nav selection.

## Pages

| File | Sidebar item | Purpose |
|---|---|---|
| `AdminHome.jsx` | Home | Quick pipeline snapshot, click-through to the other pages |
| `AIQueue.jsx` | AI Queue | Bento grid of AI-fetched articles — **Edit** opens `EditArticleModal`, **Reject** removes it and (per the `onReject` handler) should tell the sourcing agent to fetch a replacement, **Approve** moves it to Published |
| `Published.jsx` | Published | Table of live articles, with an action to move one to Archived |
| `Archived.jsx` | Archived | Table of retired articles, with a Restore action |
| `Analytics.jsx` | Analytics | Summary stat cards + a 12-day publish trend + category breakdown |

## Supporting components

- `AdminSideNav.jsx` — the fixed left nav, active-state highlight uses the accent color
- `PageHeader.jsx` — shared title/subtitle/actions header used by every page
- `StatusBadge.jsx` — URGENT / FRESH / REQUIRES FACT-CHECK / PUBLISHED / ARCHIVED pill
- `ArticleReviewCard.jsx` — the queue card itself (handles both the 2-column
  and full-width "wide" layouts, same as the reference design)
- `ArticleTable.jsx` — generic row table reused by Published and Archived
- `EditArticleModal.jsx` — edit-before-approve modal
- `AnalyticsCharts.jsx` — a tiny dependency-free `<Sparkline>` and `<BarList>`
  (no charting library required)

## Wiring to a real backend

`AdminShell.jsx` currently holds all data in `useState`, seeded from
`data/adminContent.js` (mock data — replace with real API calls). Every
place a backend call belongs is marked with a `// TODO:` comment:

- `handleApprove` — POST the approval, then trust the server's published
  record instead of building one on the client
- `handleReject` — POST the rejection; this is the hook for telling your
  sourcing agent to go find a replacement story
- `handleEditSave` — PATCH the edited fields
- `handleArchive` / `handleRestore` — move an article between Published and
  Archived

Swap the three `useState` initializers for `useEffect` + `fetch`
(or React Query, SWR, etc.) once the API exists — the components
themselves don't need to change, they just take the same props either way.

## Design tokens this relies on

These components reuse the same Tailwind tokens and small CSS utilities
from the main site rebuild (`tailwind.config.js` colors/fonts/spacing,
plus the `accent` color and the `.hover-lift` / `animate-fade-up` utilities
in `index.css`). If this panel is going into a fresh project that doesn't
already have those, copy over `tailwind.config.js` and `src/index.css` from
the main Token Times delivery first — this admin panel doesn't duplicate
them.
