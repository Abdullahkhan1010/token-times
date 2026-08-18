const envBackendUrl = import.meta.env.VITE_BACKEND_URL;
const API_BASE_URL = (
    (envBackendUrl && !envBackendUrl.includes('vercel.app'))
        ? envBackendUrl
        : 'http://100.55.75.255:3000'
).replace(/\/$/, '');

const buildUrl = (path) => {
    if (!API_BASE_URL) return '';
    return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export async function requestJson(path, options = {}) {
    const url = buildUrl(path);
    if (!url) {
        throw new Error('API backend URL is not configured (VITE_BACKEND_URL missing)');
    }

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

export { API_BASE_URL, buildUrl };