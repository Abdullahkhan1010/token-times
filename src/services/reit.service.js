/**
 * Token Times - REIT Service
 * Manages dynamic content and configuration for the REIT & Asset Tokenization page.
 * Frontend persistence via localStorage, ready for REST API integration.
 */

const REIT_STORAGE_KEY = "token_times_reit_page_content";

export const DEFAULT_REIT_CONTENT = {
  heroLandmark: {
    badge: "PAKISTAN LANDMARK REIT",
    title: "Dolmen City REIT (DCR)",
    location: "Dolmen Mall Clifton & Harbour Front Corporate Tower, Karachi",
    tag: "SECP LISTED RENTAL REIT SCHEME",
    heading: "Transforming Pakistan's Commercial Property via Tokenized Yields",
    description:
      "Dolmen City REIT represents Pakistan's premier listed rental REIT, offering investors exposure to top-tier commercial retail and corporate real estate in Karachi. With SECP's regulatory sandbox for digital asset tokenization, assets like Dolmen Mall can be digitized into micro-fractional security tokens, allowing both local retail investors and overseas Pakistanis to invest directly from digital wallets.",
    image:
      "https://images.unsplash.com/photo-1567449303078-57ad995bd301?q=80&w=1000&auto=format&fit=crop",
    annualYield: "11.8% - 13.5%",
    mallOccupancy: "98.4%",
    assetArea: "3.5M+ Sq. Ft",
  },
  pakistanFeatures: [
    {
      id: "feat-1",
      title: "Dolmen City REIT (DCR) Spotlight",
      tag: "FLAGSHIP CASE STUDY",
      desc: "Dolmen City REIT (DCR) is Pakistan's largest and pioneer listed Rental REIT scheme on the Pakistan Stock Exchange (PSX), managed by Arif Habib Dolmen REIT Management Limited. The underlying asset comprises prime commercial property: Dolmen Mall Clifton and Harbour Front office tower in Karachi.",
      highlights: [
        "Underlying Prime Assets: Dolmen Mall Clifton (3.5M+ sq. ft) & Harbour Front Corporate Tower",
        "Structure: SECP-regulated Rental REIT Scheme with 95%+ rental yield distribution requirement",
        "Yield Performance: Consistently delivers 11.8%–13.5% annualized dividend yield to unit holders",
        "Tokenization Horizon: Prime candidate for SECP Sandbox blockchain fractionalization & overseas Pakistani investments",
      ],
    },
    {
      id: "feat-2",
      title: "SECP Regulatory Framework (2015 Amendments)",
      tag: "GOVERNANCE & LAW",
      desc: "The Securities and Exchange Commission of Pakistan (SECP) governs REITs under the REIT Regulations 2015. Regulations cover Rental REITs, Developmental REITs, and Hybrid REITs, requiring transparent valuation audits and mandatory 90%+ net income payouts.",
      highlights: [
        "Mandatory Income Distribution: Minimum 90% of net annual rental income distributed to investors",
        "Property Valuation Rules: Independent SECP-approved property valuer audits conducted bi-annually",
        "REIT Management Company (RMC): Licensed asset managers ensure institutional property management",
        "Tax Incentives: Tax exemption on REIT income if 90%+ profit is distributed as dividends",
      ],
    },
    {
      id: "feat-3",
      title: "Tokenization & Overseas Pakistani Diaspora (Roshan Digital)",
      tag: "WEB3 & INNOVATION",
      desc: "By integrating distributed ledger technology with State Bank of Pakistan's Raast and Roshan Digital Account (RDA) channels, overseas Pakistanis can seamlessly buy fractional REIT tokens in PKR or USD, unlocking billions in foreign remittance potential.",
      highlights: [
        "Micro-Fractional Ownership: Lowering minimum entry barrier from PKR 500,000 to PKR 5,000",
        "Automated Dividend Smart Contracts: Daily or monthly rental payouts pushed directly to digital wallets",
        "24/7 Liquidity: Secondary peer-to-peer trading of tokenized property shares without land registry delays",
        "Transparent Land Titles: Immutable smart contracts linked with Punjab & Sindh Digital Land Records",
      ],
    },
  ],
  globalApplications: [
    {
      id: "global-1",
      country: "UNITED STATES",
      flag: "🇺🇸",
      title: "Securitized Commercial Real Estate & Reg D/Reg S Tokens",
      desc: "Tokenized REIT platforms like RealT and Securitize enable accredited and retail investors to acquire fractional ERC-20 tokens representing shares in US commercial and residential portfolios, with automated smart-contract dividend distribution and IRS tax compliance.",
      metric: "$2.8B+",
      metricLabel: "Total Tokenized Real Estate AUM",
      framework: "SEC Reg D / Reg S Framework",
    },
    {
      id: "global-2",
      country: "UNITED ARAB EMIRATES",
      flag: "🇦🇪",
      title: "DIFC & VARA Regulated Prime Property Funds",
      desc: "Dubai International Financial Centre (DIFC) and Dubai's Virtual Assets Regulatory Authority (VARA) have pioneered tokenized real estate investment funds. Global investors can purchase micro-fractions of flagship skyscrapers in Downtown Dubai via UAE Dirham and stablecoin settlement.",
      metric: "14.2%",
      metricLabel: "Average Net Rental Yield",
      framework: "DFSA & VARA Digital Asset Standards",
    },
    {
      id: "global-3",
      country: "SINGAPORE",
      flag: "🇸🇬",
      title: "MAS Institutional Real Estate Debt & Equity Tokens",
      desc: "The Monetary Authority of Singapore (MAS) Project Guardian framework utilizes permissioned distributed ledgers for tokenized real estate investment trusts, lowering issuance costs by 40% and enabling T+0 atomic cross-border settlement.",
      metric: "T+0",
      metricLabel: "Atomic Settlement Speed",
      framework: "MAS Project Guardian",
    },
    {
      id: "global-4",
      country: "EUROPEAN UNION",
      flag: "🇪🇺",
      title: "MiCA Passported Green Building REIT Tokens",
      desc: "Under the EU Markets in Crypto-Assets (MiCA) framework, European issuers issue passported security tokens backed by ESG-compliant commercial real estate, featuring automated multi-currency dividend payouts across 27 member states.",
      metric: "27 Nations",
      metricLabel: "Passported Cross-Border Distribution",
      framework: "EU MiCA & Prospectus Regulation",
    },
  ],
  simulatorConfig: {
    benchmarkYield: 11.8,
    tokenPrice: 25.0,
    tokenSymbol: "DCR",
  },
};

/**
 * Retrieves the current REIT page content from localStorage or default fallback
 */
export function getReitContent() {
  if (typeof window === "undefined") {
    return DEFAULT_REIT_CONTENT;
  }
  try {
    const raw = localStorage.getItem(REIT_STORAGE_KEY);
    if (!raw) return DEFAULT_REIT_CONTENT;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_REIT_CONTENT,
      ...parsed,
      heroLandmark: {
        ...DEFAULT_REIT_CONTENT.heroLandmark,
        ...(parsed.heroLandmark || {}),
      },
      simulatorConfig: {
        ...DEFAULT_REIT_CONTENT.simulatorConfig,
        ...(parsed.simulatorConfig || {}),
      },
    };
  } catch (err) {
    console.warn("Failed to parse stored REIT content", err);
    return DEFAULT_REIT_CONTENT;
  }
}

/**
 * Saves updated REIT page content to localStorage
 */
export function saveReitContent(updatedContent) {
  if (typeof window === "undefined") return updatedContent;
  try {
    const payload = {
      ...DEFAULT_REIT_CONTENT,
      ...updatedContent,
    };
    localStorage.setItem(REIT_STORAGE_KEY, JSON.stringify(payload));
    // Trigger custom event so open views can update reactively
    window.dispatchEvent(new Event("reit-content-updated"));
    return payload;
  } catch (err) {
    console.error("Failed to save REIT content", err);
    throw err;
  }
}

/**
 * Resets REIT page content to original factory defaults
 */
export function resetReitContent() {
  if (typeof window === "undefined") return DEFAULT_REIT_CONTENT;
  try {
    localStorage.removeItem(REIT_STORAGE_KEY);
    window.dispatchEvent(new Event("reit-content-updated"));
    return DEFAULT_REIT_CONTENT;
  } catch (err) {
    console.error("Failed to reset REIT content", err);
    return DEFAULT_REIT_CONTENT;
  }
}
