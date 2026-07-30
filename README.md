# 🪙 Token Times — Financial Intelligence & Digital Assets Platform

<div align="center">

![Token Times Logo](src/assets/TokenTimesLogo.svg)

### **Pakistan's Sovereign Digital Asset Intelligence & Web3 Reporting Platform**

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![SEO Ready](https://img.shields.io/badge/SEO-100%25%20Google%20Indexable-brightgreen.svg)](#-enterprise-seo--google-indexation)
[![License](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)

[Live Platform](#) • [Backend API Services](#-backend-services--api-integration) • [Admin Panel](#-admin-panel--content-management) • [Features](#-key-features) • [Installation](#-getting-started)

</div>

---

## 📌 Overview

**Token Times** is an enterprise-grade digital media and financial intelligence platform covering virtual assets, central bank digital currencies (CBDC), State Bank of Pakistan (SBP) policy frameworks, SECP compliance, macroeconomic research, and Web3 innovations across Pakistan and global emerging hubs.

Designed with executive typography, dark-mode glassmorphism, responsive micro-animations, clean URL history routing, a full-fledged **Admin Management Panel** (`/admin`), and an end-to-end **Service & Interface API Layer** ready for instant backend integration.

---

## 🔌 Backend Services & API Integration

Token Times includes a complete API service architecture (`src/services/`) and strongly typed interface mappers (`src/interfaces/`) to communicate with REST backend services:

### Configurable Base URL (`VITE_BACKEND_URL`)
The client automatically resolves API endpoints using the `VITE_BACKEND_URL` environment variable (defaults to `http://localhost:3000`).

### Content Entity Schemas & Services

| Entity | Service Module | Endpoint | Interface Mappings |
| :--- | :--- | :--- | :--- |
| **Regulations** | `regulation.service.js` | `/regulation` | `id`, `title`, `authority`, `publish_date`, `file` |
| **Research** | `research.service.js` | `/research` | `id`, `title`, `author`, `publish_date`, `file` |
| **Magazines** | `magzine.service.js` | `/magzine` | `id`, `title`, `cover_img`, `description`, `price`, `issue_name`, `publish_date`, `file` |
| **Knowledge Hub** | `knowlege-hub.service.js` | `/knowlege-hub` | `id`, `question`, `answer`, `author`, `publish_date`, `tags`, `category` |
| **Interviews** | `interview.service.js` | `/interviews` | `id`, `questions`, `answers`, `interviewee_name`, `interviewer_name`, `interview_title`, `interviewee_image`, `publish_date`, `tags`, `category` |
| **Events** | `event.service.js` | `/events` | `id`, `event_title`, `event_venue`, `event_adress`, `event_date`, `event_guests`, `event_description`, `event_hosts`, `event_agenda`, `image` |
| **Drafts / AI Queue** | `draft.service.js` | `/news/drafts`, `/news/approve` | `id`, `title`, `summary`, `source`, `category`, `fetchedAt`, `content` |

---

## 🛠️ Admin Panel & Content Management

Access the admin management suite at `/admin`:

- 📋 **AI Review Queue**: Draft approval, rejection, and content editor modal.
- 🏛️ **Regulations Manager**: Create and delete institutional compliance directives.
- 🔬 **Research Manager**: Upload macro reports and whitepapers.
- 📖 **Magazine Manager**: Publish print and digital quarterly issues.
- 📚 **Knowledge Hub Manager**: Add educational Q&As and explainer guides.
- 🎙️ **Interviews Manager**: Publish executive interviews with guest speakers and regulators.
- 🗓️ **Events Manager**: Schedule summits, keynote rosters, and conference agendas.

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
- Injects standard-compliant Google Rich Result schemas (`NewsMediaOrganization`, `WebSite`, `NewsArticle`, `BreadcrumbList`, `FAQPage`, `Event`).

### 3. URL History & Route Syncing (`useRouteSync.js`)
- Maps single-page navigation to clean RESTful paths (`/news`, `/magazine`, `/knowledge-hub`, `/regulations`, `/research`, `/resources`, `/events`, `/technologies`, `/about`, `/contact`, `/privacy-policy`, `/terms-of-service`, `/admin`).

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
│   ├── admin-components/    # Admin panel management components
│   │   ├── components/
│   │   │   ├── AdminShell.jsx
│   │   │   ├── AdminSideNav.jsx
│   │   │   ├── EventsAdmin.jsx
│   │   │   ├── InterviewsAdmin.jsx
│   │   │   ├── KnowledgeHubAdmin.jsx
│   │   │   ├── MagazinesAdmin.jsx
│   │   │   ├── RegulationsAdmin.jsx
│   │   │   └── ResearchAdmin.jsx
│   ├── services/            # API Service mappers & REST clients
│   │   ├── api.js
│   │   ├── draft.service.js
│   │   ├── event.service.js
│   │   ├── interview.service.js
│   │   ├── knowlege-hub.service.js
│   │   ├── magzine.service.js
│   │   ├── regulation.service.js
│   │   └── research.service.js
│   ├── interfaces/          # Entity interfaces & factory mappers
│   ├── components/          # Frontend presentation components
│   ├── pages/               # Page views
│   ├── App.jsx              # Main app router
│   ├── index.css            # Styling system
│   └── main.jsx             # React entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Environment Variables

Create a `.env` file in the root directory:
```env
VITE_BACKEND_URL=http://localhost:3000
```

### Installation & Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abdullahkhan1010/token-times.git
   cd token-times
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<div align="center">

Designed & Maintained by **Token Times Media Group** • Pakistan Edition 🇵🇰

</div>
