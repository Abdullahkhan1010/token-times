const envBackendUrl = import.meta.env.VITE_BACKEND_URL;
const API_BASE_URL = (
    (envBackendUrl && !envBackendUrl.includes('vercel.app'))
        ? envBackendUrl
        : 'https://dept-priced-viewing-into.trycloudflare.com'
).replace(/\/$/, '');

const buildUrl = (path) => {
    if (!API_BASE_URL) return '';
    return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

const apiCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

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
        const cached = apiCache.get(url);
        const now = Date.now();

        if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
            // Silently revalidate in background if older than 30s
            if (now - cached.timestamp > 30000 && !inFlightRequests.has(url)) {
                fetchAndParse(url, options)
                    .then((freshData) => {
                        apiCache.set(url, { timestamp: Date.now(), data: freshData });
                    })
                    .catch(() => {});
            }
            return cached.data;
        }

        // Deduplicate simultaneous requests for the exact same URL
        if (inFlightRequests.has(url)) {
            return inFlightRequests.get(url);
        }

        const fetchPromise = fetchAndParse(url, options)
            .then((data) => {
                apiCache.set(url, { timestamp: Date.now(), data });
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