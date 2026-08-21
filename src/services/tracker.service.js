/**
 * Lightweight Click & Page Visit Tracker for Token Times
 * Zero-overhead click counter for tracking page visits and article opens.
 * Supports local storage aggregation + automatic backend beacon delivery.
 */

import { buildUrl } from "./api";

const STORAGE_PAGE_CLICKS = "token_times_page_clicks";
const STORAGE_ARTICLE_CLICKS = "token_times_article_clicks";

/**
 * Dispatch a non-blocking background beacon to backend if available
 */
function sendAnalyticsBeacon(payload) {
    if (typeof window === "undefined") return;

    try {
        const url = buildUrl("/analytics/hit");
        if (!url) return;
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });

        if (navigator.sendBeacon) {
            navigator.sendBeacon(url, blob);
        } else {
            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                keepalive: true,
            }).catch(() => { });
        }
    } catch {
        // Safe failover
    }
}

/**
 * Track when a user visits a website page (e.g. Home, REIT, Opinion, Markets, News)
 */
export function trackPageVisit(pageName) {
    if (!pageName || typeof window === "undefined") return;

    try {
        const raw = localStorage.getItem(STORAGE_PAGE_CLICKS);
        const counts = raw ? JSON.parse(raw) : {};
        counts[pageName] = (counts[pageName] || 0) + 1;
        localStorage.setItem(STORAGE_PAGE_CLICKS, JSON.stringify(counts));
        window.dispatchEvent(new CustomEvent("token_times_tracker_update", { detail: { type: "page", page: pageName } }));
    } catch {
        // storage fallback
    }

    // Forward non-blocking hit to backend
    sendAnalyticsBeacon({ type: "page", page: pageName });
}

/**
 * Track when a user clicks and opens a specific article
 */
export function trackArticleClick(articleId, title = "", category = "") {
    const rawKey = articleId || (title ? `title_${title.trim().toLowerCase()}` : "");
    if (!rawKey || typeof window === "undefined") return;

    const primaryKey = String(rawKey).trim();
    const titleKey = title ? `title_${title.trim().toLowerCase()}` : null;

    try {
        const raw = localStorage.getItem(STORAGE_ARTICLE_CLICKS);
        const data = raw ? JSON.parse(raw) : {};

        const existingRecord = data[primaryKey] || (titleKey && data[titleKey]) || {
            id: primaryKey,
            title: title || "Untitled Article",
            category: category || "News",
            clicks: 0,
            lastClicked: new Date().toISOString(),
        };

        const updatedClicks = (existingRecord.clicks || 0) + 1;
        const record = {
            ...existingRecord,
            id: primaryKey,
            title: title || existingRecord.title || "Untitled Article",
            category: category || existingRecord.category || "News",
            clicks: updatedClicks,
            lastClicked: new Date().toISOString(),
        };

        data[primaryKey] = record;
        if (titleKey && titleKey !== primaryKey) {
            data[titleKey] = record;
        }

        localStorage.setItem(STORAGE_ARTICLE_CLICKS, JSON.stringify(data));
        window.dispatchEvent(new CustomEvent("token_times_tracker_update", { detail: { type: "article", id: primaryKey, clicks: updatedClicks } }));
    } catch {
        // storage fallback
    }

    // Forward non-blocking hit to backend
    sendAnalyticsBeacon({ type: "article", id: primaryKey, title, category });
}

/**
 * Get all page visits ranked by click count
 */
export function getPageVisitStats() {
    if (typeof window === "undefined") return [];

    const defaultPages = [
        "Home",
        "Markets",
        "News",
        "REIT",
        "Opinion",
        "Regulations",
        "Research",
        "Magazine",
        "Knowledge Hub",
        "Interviews",
        "Events",
        "Global",
        "Features",
    ];

    try {
        const raw = localStorage.getItem(STORAGE_PAGE_CLICKS);
        const counts = raw ? JSON.parse(raw) : {};

        // Merge recorded clicks with default pages
        const allPages = Array.from(new Set([...defaultPages, ...Object.keys(counts)]));

        return allPages
            .map((page) => ({
                label: page,
                value: counts[page] || 0,
            }))
            .sort((a, b) => b.value - a.value);
    } catch {
        return defaultPages.map((p) => ({ label: p, value: 0 }));
    }
}

/**
 * Get all article click records
 */
export function getArticleClickStats() {
    if (typeof window === "undefined") return {};

    try {
        const raw = localStorage.getItem(STORAGE_ARTICLE_CLICKS);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

/**
 * Clear all click tracking data
 */
export function clearClickStats() {
    if (typeof window === "undefined") return;
    try {
        localStorage.removeItem(STORAGE_PAGE_CLICKS);
        localStorage.removeItem(STORAGE_ARTICLE_CLICKS);
    } catch {
        // ignore
    }
}
