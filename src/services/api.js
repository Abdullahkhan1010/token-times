const envBackendUrl = import.meta.env.VITE_BACKEND_URL;
const API_BASE_URL = (
    envBackendUrl || 'https://token-times-backend.vercel.app/'
).replace(/\/$/, '');

const buildUrl = (path) => {
    if (!API_BASE_URL) return '';
    return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

const apiCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Helper to get from sessionStorage
function getStoredCache(url) {
    try {
        const raw = sessionStorage.getItem(`api_cache_${url}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            return parsed.data;
        }
    } catch (e) {
        // Ignore storage errors
    }
    return null;
}

// Helper to save to sessionStorage
function setStoredCache(url, data) {
    try {
        sessionStorage.setItem(`api_cache_${url}`, JSON.stringify({
            timestamp: Date.now(),
            data,
        }));
    } catch (e) {
        // Ignore storage errors
    }
}

async function fetchAndParse(url, options) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return response.json();
    }

    return response.text();
}

export async function requestJson(path, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const url = buildUrl(path);
    if (!url) {
        throw new Error('API backend URL is not configured (VITE_BACKEND_URL missing)');
    }

    const isCacheable = method === 'GET' && !options.body;

    if (isCacheable) {
        // 1. Check memory cache
        const now = Date.now();
        const cached = apiCache.get(url);
        if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
            if (now - cached.timestamp > 30000 && !inFlightRequests.has(url)) {
                fetchAndParse(url, options)
                    .then((freshData) => {
                        apiCache.set(url, { timestamp: Date.now(), data: freshData });
                        setStoredCache(url, freshData);
                    })
                    .catch(() => { });
            }
            return cached.data;
        }

        // 2. Check sessionStorage cache for instant reload (0ms)
        const stored = getStoredCache(url);
        if (stored) {
            apiCache.set(url, { timestamp: now, data: stored });
            if (!inFlightRequests.has(url)) {
                fetchAndParse(url, options)
                    .then((freshData) => {
                        apiCache.set(url, { timestamp: Date.now(), data: freshData });
                        setStoredCache(url, freshData);
                    })
                    .catch(() => { });
            }
            return stored;
        }

        // 3. Deduplicate in-flight network requests
        if (inFlightRequests.has(url)) {
            return inFlightRequests.get(url);
        }

        const fetchPromise = fetchAndParse(url, options)
            .then((data) => {
                apiCache.set(url, { timestamp: Date.now(), data });
                setStoredCache(url, data);
                inFlightRequests.delete(url);
                return data;
            })
            .catch((err) => {
                inFlightRequests.delete(url);
                throw err;
            });

        inFlightRequests.set(url, fetchPromise);
        return fetchPromise;
    }

    return fetchAndParse(url, options);
}

export { API_BASE_URL, buildUrl };