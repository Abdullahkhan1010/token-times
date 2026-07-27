/**
 * Mock data for the admin panel.
 * Replace each export with a real API call (e.g. React Query / fetch to
 * your backend) once the AI-sourcing pipeline and database are wired up.
 * Shapes are kept intentionally stable so swapping the data source
 * shouldn't require touching the components.
 */

export const pendingQueue = [
  {
    id: "q1",
    priority: "urgent",
    confidence: 94,
    title: "SEC Announces New Guidelines for Digital Asset Custody",
    summary:
      "The Securities and Exchange Commission has released a comprehensive framework detailing the requirements for institutional custodians holding digital assets, aiming to enhance investor protection.",
    source: "wsj.com/markets/...",
    category: "Regulation",
    fetchedAt: "2026-07-24T09:12:00Z",
  },
  {
    id: "q2",
    priority: "fresh",
    confidence: 88,
    title: "European Central Bank Signals Potential Rate Cut in Q3",
    summary:
      "In a recent press conference, ECB officials hinted at a possible easing of monetary policy later this year if inflation continues its downward trajectory towards the 2% target.",
    source: "ft.com/content/...",
    category: "Markets",
    fetchedAt: "2026-07-24T08:40:00Z",
  },
  {
    id: "q3",
    priority: "fact-check",
    confidence: 62,
    title: "Rumors Circulate Regarding Major Tech Merger",
    summary:
      "Unverified reports suggest a potential merger between two leading AI hardware manufacturers, which could significantly disrupt the current market share dynamics if confirmed.",
    source: "unknown-blog.net/...",
    category: "Technology",
    fetchedAt: "2026-07-24T07:55:00Z",
    wide: true,
  },
];

export const publishedArticles = [
  {
    id: "p1",
    title: "State Bank of Pakistan Outlines Phased Rollout for Wholesale CBDC Pilot",
    category: "Regulation",
    author: "T.T. Editorial Board",
    publishedAt: "2026-07-22T10:00:00Z",
    views: 18420,
  },
  {
    id: "p2",
    title: "FBR Proposes 15% Flat Capital Gains Tax on Digital Asset Transactions",
    category: "Policy",
    author: "T.T. Editorial Board",
    publishedAt: "2026-07-21T14:20:00Z",
    views: 9210,
  },
  {
    id: "p3",
    title: "Web3 Hub Opens in Lahore Tech Park, Promising 500 New Developer Jobs",
    category: "Technology",
    author: "T.T. Editorial Board",
    publishedAt: "2026-07-20T09:05:00Z",
    views: 6104,
  },
];

export const archivedArticles = [
  {
    id: "a1",
    title: "2025 Year in Review: Pakistan's Digital Asset Market",
    category: "Analysis",
    author: "T.T. Editorial Board",
    archivedAt: "2026-01-05T12:00:00Z",
    reason: "Superseded by 2026 report",
  },
  {
    id: "a2",
    title: "SBP Issues Interim Guidance on Crypto Advertising",
    category: "Regulation",
    author: "T.T. Editorial Board",
    archivedAt: "2025-11-18T12:00:00Z",
    reason: "Guidance withdrawn",
  },
];

export const analyticsSummary = [
  { label: "Published (30d)", value: "142", delta: "+12%" },
  { label: "Pending Review", value: "12", delta: "+3" },
  { label: "Approval Rate", value: "81%", delta: "+4%" },
  { label: "Avg. Time to Publish", value: "2.4h", delta: "-18min" },
];

export const articlesPerDay = [12, 18, 9, 22, 17, 25, 19, 14, 20, 27, 23, 16];

export const categoryBreakdown = [
  { label: "Regulation", value: 38 },
  { label: "Markets", value: 27 },
  { label: "Technology", value: 21 },
  { label: "Policy", value: 14 },
];
