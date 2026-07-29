/**
 * Token Times - Master SEO Registry & Structured Data Schemas
 * Comprehensive metadata dictionary for all pages, routes, Open Graph, Twitter Cards, and JSON-LD schemas.
 */

export const BASE_URL = "https://tokentimes.io";

export const DEFAULT_SEO = {
  siteName: "Token Times",
  defaultTitle: "Token Times | Financial Intelligence & Digital Assets",
  titleTemplate: "%s | Token Times",
  description:
    "Token Times delivers authoritative digital asset intelligence, virtual asset regulatory updates, macroeconomic research, and Web3 innovation insights for Pakistan and global markets.",
  keywords:
    "Token Times, crypto news, Web3 Pakistan, virtual assets regulatory framework, financial intelligence, digital finance, blockchain research, CBDC Pakistan, crypto tax laws, SBP digital currency",
  type: "website",
  locale: "en_US",
  twitterHandle: "@TokenTimesIO",
  ogImage: `${BASE_URL}/og-image.jpg`,
  publisher: "Token Times Media Group",
  author: "Token Times Editorial Desk",
};

export const SITE_ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  "@id": `${BASE_URL}/#organization`,
  name: "Token Times",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo.svg`,
    width: 600,
    height: 120,
  },
  sameAs: [
    "https://twitter.com/TokenTimesIO",
    "https://linkedin.com/company/tokentimes",
    "https://t.me/tokentimes",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Editorial Desk",
    email: "editor@tokentimes.io",
    availableLanguage: ["English", "Urdu"],
  },
  publishingPrinciples: `${BASE_URL}/about`,
  ethicsPolicy: `${BASE_URL}/about#ethics`,
  diversityPolicy: `${BASE_URL}/about#diversity`,
};

export const WEBSITE_SEARCH_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Token Times",
  description: "Financial intelligence and virtual assets reporting platform.",
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/news?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const PAGE_SEO_DATA = {
  Home: {
    title: "Token Times | Financial Intelligence & Digital Assets",
    description:
      "Leading financial intelligence platform covering virtual assets, Web3 policy, market dynamics, and macroeconomic shifts in Pakistan and globally.",
    keywords:
      "Token Times, financial intelligence, crypto market news, Web3 Pakistan, SBP digital currency, virtual asset regulation, Bitcoin Pakistan",
    path: "/",
    type: "website",
    schema: [SITE_ORGANIZATION_SCHEMA, WEBSITE_SEARCH_SCHEMA],
  },
  News: {
    title: "Digital Assets & Crypto Market News",
    description:
      "Real-time coverage of Web3 regulation, cryptocurrency markets, central bank digital currencies, and institutional finance across Pakistan and global hubs.",
    keywords:
      "digital asset news, crypto market news, Web3 regulation, SBP crypto policies, IMF Pakistan digital assets, Bitcoin news Pakistan",
    path: "/news",
    type: "website",
    schema: [
      SITE_ORGANIZATION_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Token Times News Stream",
        description: "Breaking news and in-depth reporting on digital asset markets and policy.",
        url: `${BASE_URL}/news`,
      },
    ],
  },
  Magazine: {
    title: "Token Times Quarterly Magazine | Executive Briefings",
    description:
      "Read our flagship quarterly publication featuring long-form investigative analysis, executive interviews, and institutional perspectives on digital finance.",
    keywords:
      "Token Times magazine, executive crypto briefing, Web3 quarterly, digital finance journal, virtual asset policy report",
    path: "/magazine",
    type: "article",
    schema: [
      SITE_ORGANIZATION_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "PublicationIssue",
        name: "Token Times Quarterly - Digital Asset Sovereignty",
        issueNumber: "04",
        datePublished: "2026-07-01",
        publisher: { "@id": `${BASE_URL}/#organization` },
      },
    ],
  },
  "Knowledge Hub": {
    title: "Web3 & Digital Finance Knowledge Hub | Educational Guides",
    description:
      "Master virtual assets, blockchain protocols, zero-knowledge proofs, smart contract security, and compliance with curated guides by industry experts.",
    keywords:
      "Web3 knowledge hub, blockchain architecture guide, smart contract security, crypto tax guide Pakistan, digital asset compliance tutorial",
    path: "/knowledge-hub",
    type: "website",
    schema: [
      SITE_ORGANIZATION_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the legal status of virtual assets in Pakistan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Virtual asset regulation in Pakistan is governed by ongoing policy updates from the State Bank of Pakistan (SBP) and SECP, working towards compliant regulatory frameworks.",
            },
          },
          {
            "@type": "Question",
            name: "How does tokenization impact traditional asset management?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Tokenization enables fractional ownership, 24/7 liquidity, automated clearing via smart contracts, and reduced settlement friction for real-world assets (RWA).",
            },
          },
        ],
      },
    ],
  },
  Regulations: {
    title: "Virtual Assets & Crypto Regulatory Tracker | Compliance & Law",
    description:
      "Track global and regional regulatory developments, FATF compliance standards, SECP frameworks, SBP guidelines, and tax legal updates.",
    keywords:
      "crypto regulation Pakistan, SECP virtual asset framework, FATF crypto compliance, SBP digital currency law, virtual asset tax law",
    path: "/regulations",
    type: "website",
    schema: [
      SITE_ORGANIZATION_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "GovernmentService",
        name: "Token Times Regulatory Tracker",
        serviceType: "Legal and Regulatory Information Services",
        provider: { "@id": `${BASE_URL}/#organization` },
      },
    ],
  },
  Research: {
    title: "Institutional Research Papers & Economic Whitepapers",
    description:
      "In-depth research papers on macroeconomic trends, central bank digital currencies (CBDC), decentralized finance risks, and algorithmic stability.",
    keywords:
      "crypto research papers, CBDC research Pakistan, DeFi risk analysis, institutional blockchain report, tokenomics whitepaper",
    path: "/research",
    type: "website",
    schema: [
      SITE_ORGANIZATION_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "DataCatalog",
        name: "Token Times Research Repository",
        description: "Peer-reviewed whitepapers and econometric models for digital finance.",
      },
    ],
  },
  Resources: {
    title: "Developer & Investor Resource Center | Tools & Datasets",
    description:
      "Access API documentation, developer kits, legal templates, regulatory checklists, and market intelligence datasets for digital asset builders.",
    keywords:
      "Web3 developer tools, crypto API datasets, blockchain legal templates, regulatory checklist, Web3 SDK Pakistan",
    path: "/resources",
    type: "website",
    schema: [SITE_ORGANIZATION_SCHEMA],
  },
  Events: {
    title: "Upcoming Web3 & Fintech Conferences, Summits & Events",
    description:
      "Explore upcoming global and regional financial technology summits, blockchain conferences, regulatory roundtables, and virtual hackathons.",
    keywords:
      "Web3 events Pakistan, crypto conference 2026, fintech summit, blockchain hackathon, virtual asset regulatory roundtable",
    path: "/events",
    type: "website",
    schema: [
      SITE_ORGANIZATION_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "Event",
        name: "Pakistan Digital Finance & Web3 Summit 2026",
        startDate: "2026-10-15T09:00:00+05:00",
        endDate: "2026-10-16T18:00:00+05:00",
        eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: "Islamabad Convention Center",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Islamabad",
            addressCountry: "PK",
          },
        },
        description: "The premier gathering of regulators, central bankers, and Web3 founders in South Asia.",
        organizer: { "@id": `${BASE_URL}/#organization` },
      },
    ],
  },
  Technologies: {
    title: "Web3 Protocols, Layer 2 & Blockchain Architecture",
    description:
      "Technical deep dives into zero-knowledge rollups, cross-chain interoperability protocols, decentralized storage, and consensus mechanisms.",
    keywords:
      "ZK rollups technology, Layer 2 scaling, blockchain consensus, cross-chain messaging, decentralized infrastructure",
    path: "/technologies",
    type: "website",
    schema: [SITE_ORGANIZATION_SCHEMA],
  },
  About: {
    title: "About Token Times | Mission & Editorial Standards",
    description:
      "Learn about Token Times, our commitment to independent financial intelligence, editorial integrity, and advancing virtual asset awareness.",
    keywords:
      "About Token Times, financial news team, Web3 journalists, Token Times leadership, editorial policy",
    path: "/about",
    type: "website",
    schema: [
      SITE_ORGANIZATION_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Token Times",
        url: `${BASE_URL}/about`,
        mainEntity: { "@id": `${BASE_URL}/#organization` },
      },
    ],
  },
  Contact: {
    title: "Contact Token Times | Press, Inquiries & Submissions",
    description:
      "Get in touch with our editorial team, submit press releases, advertise with us, or inquire about institutional partnerships.",
    keywords:
      "Contact Token Times, press release submission, crypto advertising, editorial desk contact, partner inquiries",
    path: "/contact",
    type: "website",
    schema: [
      SITE_ORGANIZATION_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Token Times",
        url: `${BASE_URL}/contact`,
      },
    ],
  },
  "Privacy Policy": {
    title: "Privacy Policy | Data Protection & Cookies",
    description:
      "Understand how Token Times collects, protects, and handles user data in compliance with international privacy standards.",
    keywords: "Token Times privacy policy, data protection, user privacy, cookies policy",
    path: "/privacy-policy",
    type: "website",
    schema: [SITE_ORGANIZATION_SCHEMA],
  },
  "Terms of Service": {
    title: "Terms of Service & Usage Agreement",
    description:
      "Review the legal terms and conditions governing your use of Token Times content, APIs, and digital platform.",
    keywords: "Token Times terms of service, legal terms, user agreement, content rights",
    path: "/terms-of-service",
    type: "website",
    schema: [SITE_ORGANIZATION_SCHEMA],
  },
};

/**
 * Maps page names to clean URL paths
 */
export const ROUTE_PATH_MAP = {
  Home: "/",
  News: "/news",
  Magazine: "/magazine",
  "Knowledge Hub": "/knowledge-hub",
  Regulations: "/regulations",
  Research: "/research",
  Resources: "/resources",
  Events: "/events",
  Technologies: "/technologies",
  About: "/about",
  Contact: "/contact",
  "Privacy Policy": "/privacy-policy",
  "Terms of Service": "/terms-of-service",
};

/**
 * Reverse map path to page name
 */
export const PATH_ROUTE_MAP = Object.entries(ROUTE_PATH_MAP).reduce((acc, [page, path]) => {
  acc[path] = page;
  return acc;
}, {});
