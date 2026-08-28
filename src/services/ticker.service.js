export const DEFAULT_TICKER_ITEMS = [
  "PVARA Issues New Licensing Guidelines for Virtual Asset Service Providers (VASPs) in Q3",
  "SBP Announces CBDC Pilot Expansion to Commercial Banks",
  "SECP Publishes Whitepaper on Security Token Offerings (STOs) Framework",
  "FBR Clarifies Tax Treatment of Crypto-Asset Capital Gains",
  "GLOBAL: U.S. Spot Bitcoin ETFs Record Another Week of Net Inflows",
  "GLOBAL: EU Markets Tighten Stablecoin Compliance Checks Ahead of MiCA Rollout",
  "GLOBAL: Japan Signals Fresh Support for Tokenized Securities Pilots",
];

const STORAGE_KEY = "token_times_ticker_items";

export function getTickerItems() {
  if (typeof window === "undefined") {
    return [...DEFAULT_TICKER_ITEMS];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [...DEFAULT_TICKER_ITEMS];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.filter((item) => typeof item === "string" && item.trim().length > 0);
    }
  } catch (err) {
    console.warn("Failed to parse stored ticker items, using defaults", err);
  }
  return [...DEFAULT_TICKER_ITEMS];
}

export function saveTickerItems(items) {
  if (!Array.isArray(items)) return;
  const clean = items.filter((item) => typeof item === "string" && item.trim().length > 0);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ticker-items-updated", { detail: clean }));
    }
  } catch (err) {
    console.error("Failed to save ticker items to localStorage", err);
  }
}

export function resetTickerItems() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ticker-items-updated", { detail: DEFAULT_TICKER_ITEMS }));
    }
  } catch (err) {
    console.error("Failed to reset ticker items", err);
  }
  return [...DEFAULT_TICKER_ITEMS];
}
