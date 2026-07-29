# 🪙 Token Times — Financial Intelligence & Digital Assets Platform

<div align="center">

![Token Times Logo](src/assets/TokenTimesLogo.svg)

### **Pakistan's Sovereign Digital Asset Intelligence & Web3 Reporting Platform**

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![SEO Ready](https://img.shields.io/badge/SEO-100%25%20Google%20Indexable-brightgreen.svg)](#-enterprise-seo--google-indexation)
[![License](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)

[Live Platform](#) • [SEO Documentation](#-enterprise-seo--google-indexation) • [Features](#-key-features) • [Installation](#-getting-started)

</div>

---

## 📌 Overview

**Token Times** is an enterprise-grade digital media and financial intelligence platform covering virtual assets, central bank digital currencies (CBDC), State Bank of Pakistan (SBP) policy frameworks, SECP compliance, macroeconomic research, and Web3 innovations across Pakistan and global emerging hubs.

Designed with executive typography, dark-mode glassmorphism, responsive micro-animations, clean URL history routing, and a state-of-the-art **Enterprise SEO Engine** built to outperform standard SSR frameworks in search visibility and Google indexation speed.

---

## 🔥 Key Features

- ⚡ **Real-Time Breaking Ticker & News Stream**: Live policy updates, market momentum alerts, and categorizable news feeds.
- 🏛️ **Institutional Regulatory Tracker**: Live matrix tracking SBP, SECP, FBR, and international regulatory frameworks (FATF, PVARA).
- 📖 **Executive Quarterly Magazine**: Long-form investigative essays, cover features, editor briefs, and archived PDF downloads.
- 📚 **Web3 & Digital Finance Knowledge Hub**: Educational explainer guides, curriculum filters, and a searchable Web3 & legal glossary.
- 🔬 **Institutional Research & Data Desk**: Econometric whitepapers, demographic surveys, and annual digital finance reports.
- 💼 **Licensed VASP & Sandbox Directory**: Verified database of Virtual Asset Service Providers operating in regulatory sandboxes.
- 🗓️ **Global Policy Summits & Events**: Keynote rosters, summit schedules, and registration portals for regional conferences.
- 💹 **Markets & Forex Dashboard**: Real-time crypto market data panels and foreign exchange conversion tracking.

---

## 🚀 Enterprise SEO & Google Indexation

Token Times includes a zero-dependency **Master SEO Engine** built directly into the client-side single-page architecture:

### 1. Dynamic Head Management (`SEOHead.jsx`)
- Automatically updates `<title>`, `<meta name="description">`, `<meta name="keywords">`, `<meta name="robots">`, `<link rel="canonical">`, Open Graph (`og:*`), and Twitter Cards (`twitter:*`) live on page navigation.

### 2. Comprehensive JSON-LD Structured Data
- Injects standard-compliant Google Rich Result schemas:
  - **`NewsMediaOrganization` & `WebSite`**: Site identity, logo metadata, and sitelinks search box.
  - **`NewsArticle`**: Deep news reporting markup for Google News inclusion.
  - **`BreadcrumbList`**: Rich Google Search breadcrumb navigation.
  - **`FAQPage`**: Interactive search snippet expansion.
  - **`Event`**: Conference and summit structured data.

### 3. URL History & Route Syncing (`useRouteSync.js`)
- Maps single-page navigation to clean RESTful paths (`/news`, `/magazine`, `/knowledge-hub`, `/regulations`, `/research`, `/resources`, `/events`, `/technologies`, `/about`, `/contact`, `/privacy-policy`, `/terms-of-service`).
- Full browser back/forward (`popstate`) support.

### 4. Search Engine Indexing Assets
- 📄 `public/robots.txt`: Directives for Googlebot, Bingbot, and web scrapers.
- 🗺️ `public/sitemap.xml`: Complete XML sitemap with change frequencies and priorities.
- 📰 `public/news-sitemap.xml`: Dedicated Google News XML sitemap.
- 📱 `public/site.webmanifest`: Progressive Web App (PWA) manifest for mobile SERP feature cards.
- ⚡ `index.html`: Pre-rendered static fallback meta tags and Google Fonts preconnect hints.

---

## 📂 Project Architecture

```bash
token-times/
├── public/
│   ├── favicon.svg          # Vector site favicon
│   ├── news-sitemap.xml     # Google News XML sitemap
│   ├── robots.txt           # Search crawler directives
│   ├── site.webmanifest     # PWA manifest file
│   └── sitemap.xml          # Comprehensive XML sitemap
├── src/
│   ├── assets/              # SVG logos & media assets
│   ├── components/
│   │   ├── Breadcrumbs.jsx  # Accessible UI & Google BreadcrumbList schema
│   │   ├── BreakingTicker.jsx
│   │   ├── EditorsPick.jsx
│   │   ├── FeaturedAnalysis.jsx
│   │   ├── Footer.jsx       # Semantic footer & sitemap links
│   │   ├── GlobalHighlights.jsx
│   │   ├── Header.jsx       # Desktop & mobile drawer navigation
│   │   ├── Hero.jsx         # Featured lead story showcase
│   │   ├── KnowledgeHub.jsx
│   │   ├── LatestNews.jsx
│   │   ├── MagazineIssue.jsx
│   │   ├── MarketsDashboard.jsx
│   │   ├── Navigation.jsx   # Clean href navigation links
│   │   ├── Newsletter.jsx
│   │   ├── PakistanFocus.jsx
│   │   ├── Partners.jsx
│   │   ├── RegulatoryUpdates.jsx
│   │   ├── ResearchPapers.jsx
│   │   ├── Reveal.jsx       # IntersectionObserver scroll-reveal wrapper
│   │   ├── SEOHead.jsx      # Dynamic head tag & JSON-LD manager
│   │   └── UpcomingEvents.jsx
│   ├── data/
│   │   ├── content.js       # Global text content & navigation links
│   │   ├── pagesData.js     # Page-level data streams
│   │   └── seoData.js       # Master SEO registry & JSON-LD schemas
│   ├── hooks/
│   │   ├── useReveal.js     # Scroll reveal animation hook
│   │   └── useRouteSync.js  # Clean URL pushState / popstate hook
│   ├── pages/
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── EventsPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── KnowledgeHubPage.jsx
│   │   ├── MagazinePage.jsx
│   │   ├── NewsPage.jsx
│   │   ├── PrivacyPage.jsx
│   │   ├── RegulationsPage.jsx
│   │   ├── ResearchPage.jsx
│   │   ├── ResourcesPage.jsx
│   │   ├── TechnologiesPage.jsx
│   │   └── TermsPage.jsx
│   ├── App.jsx              # Main app wrapper & sub-route router
│   ├── index.css            # Tailored design system, tokens & typography
│   └── main.jsx             # React entry point
├── index.html               # Base HTML with static pre-rendered head
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abdullahkhan1010/token-times.git
   cd token-times
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for Production:**
   ```bash
   npm run build
   ```

5. **Preview Production Build:**
   ```bash
   npm run preview
   ```

---

## 🌐 Deployment

Token Times can be deployed instantly on any static or serverless hosting provider:

- **Vercel**: Push to repository and connect project (handles client-side rewrites automatically with standard `single-page` configuration).
- **Netlify**: Ensure `_redirects` file contains `/* /index.html 200`.
- **Cloudflare Pages / GitHub Pages**: Build command `npm run build`, output directory `dist`.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<div align="center">

Designed & Maintained by **Token Times Media Group** • Pakistan Edition 🇵🇰

</div>
