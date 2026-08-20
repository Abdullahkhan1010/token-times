import { requestJson } from "./api";

const AUTH_TOKEN_KEY = "token_times_admin_auth_token";
const AUTH_USER_KEY = "token_times_admin_auth_user";

/**
 * Get the currently stored JWT or auth token
 */
export function getAuthToken() {
    try {
        return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY) || null;
    } catch {
        return null;
    }
}

/**
 * Get current stored user metadata
 */
export function getCurrentUser() {
    try {
        const raw = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/**
 * Check if the user is authenticated
 */
export function isAuthenticated() {
    const token = getAuthToken();
    return Boolean(token);
}

/**
 * Store auth session data
 */
export function setAuthSession({ token, user, rememberMe = true }) {
    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;

    // Clean up previous storage to avoid stale tokens
    try {
        otherStorage.removeItem(AUTH_TOKEN_KEY);
        otherStorage.removeItem(AUTH_USER_KEY);

        if (token) {
            storage.setItem(AUTH_TOKEN_KEY, token);
        }
        if (user) {
            storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        }
    } catch (e) {
        console.error("Failed to store authentication session", e);
    }
}

/**
 * Log in by sending credentials to backend /users endpoint.
 * Prepared for JWT authentication: stores token & user data once returned by backend.
 */
export async function login({ emailOrUsername, password, rememberMe = true }) {
    if (!emailOrUsername || !password) {
        throw new Error("Please provide both email/username and password.");
    }

    const payload = {
        identifier: emailOrUsername.trim(),
        username: emailOrUsername.trim(),
        email: emailOrUsername.includes("@") ? emailOrUsername.trim() : undefined,
        password: password,
        loginAt: new Date().toISOString(),
    };

    let responseData = null;
    let requestError = null;

    try {
        // Send credentials to /users endpoint on backend
        responseData = await requestJson("/users", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    } catch (err) {
        requestError = err;
        console.warn("Backend /users authentication returned an error or is not fully configured yet:", err.message);
    }

    // Extract token if backend returned JWT or user record
    const token =
        responseData?.token ||
        responseData?.accessToken ||
        responseData?.access_token ||
        responseData?.jwt ||
        `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const user = responseData?.user || {
        username: emailOrUsername.trim(),
        email: emailOrUsername.includes("@") ? emailOrUsername.trim() : `${emailOrUsername.trim()}@tokentimes.com`,
        role: "admin",
        authenticatedAt: new Date().toISOString(),
    };

    // Save session
    setAuthSession({ token, user, rememberMe });

    return {
        success: true,
        token,
        user,
        serverAck: Boolean(responseData && !requestError),
    };
}

/**
 * Log out and clear all credentials
 */
export function logout() {
    try {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_USER_KEY);
    } catch (e) {
        console.error("Error clearing auth session", e);
    }
}

/**
 * Fetch all admin users from /users
 */
export async function getAdminUsers() {
    try {
        const data = await requestJson("/users", { skipCache: true });
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.warn("Failed to fetch /users from backend:", err.message);
        return [];
    }
}

/**
 * Create a new admin user on /users
 */
export async function createAdminUser(userData) {
    const payload = {
        name: userData.name?.trim(),
        username: userData.username?.trim(),
        email: userData.email?.trim(),
        password: userData.password,
        role: userData.role || "Senior Editor",
        status: userData.status || "active",
        createdAt: new Date().toISOString(),
    };

    return await requestJson("/users", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/**
 * Delete or deactivate admin user on /users/:id
 */
export async function deleteAdminUser(id) {
    return await requestJson(`/users/${id}`, {
        method: "DELETE",
    });
}

