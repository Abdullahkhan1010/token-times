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
        email: emailOrUsername.trim(),
        password: password,
    };

    let responseData = null;
    let requestError = null;

    try {
        // Send credentials to /auth/login endpoint on backend
        responseData = await requestJson("/auth/login", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    } catch (err) {
        requestError = err;
        console.warn("Backend /auth/login authentication error:", err.message);
    }

    // Extract token if backend returned JWT or user record
    const token = responseData?.access_token;
    const user = responseData?.user;

    // Save session
    if (token && user) {
        setAuthSession({ token, user, rememberMe });
        return {
            success: true,
            token,
            user,
            serverAck: true,
        };
    } else {
        return {
            success: false,
            token,
            user,
            serverAck: Boolean(responseData && !requestError),
            error: requestError?.message || "Invalid email or password",
        };
    }
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
        const data = await requestJson("/auth/getAdmins", { skipCache: true });
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.warn("Failed to fetch /auth/getAdmins from backend:", err.message);
        return [];
    }
}

/**
 * Create a new admin user on /auth/register
 */
export async function createAdminUser(userData) {
    const payload = {
        email: userData.email?.trim(),
        password: userData.password
    };

    return await requestJson("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/**
 * Delete or deactivate admin user on /auth/admins/:id
 */
export async function deleteAdminUser(id) {
    return await requestJson(`/auth/admins/${id}`, {
        method: "DELETE",
    });
}

