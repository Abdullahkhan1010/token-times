import { requestJson } from './api';

const FILES_PATH = '/files';


export function getMimeTypeFromFilename(filename) {
    if (!filename || typeof filename !== 'string') return 'application/octet-stream';
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'webp': return 'image/webp';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'png': return 'image/png';
        case 'gif': return 'image/gif';
        case 'svg': return 'image/svg+xml';
        case 'avif': return 'image/avif';
        case 'pdf': return 'application/pdf';
        default: return 'application/octet-stream';
    }
}

/**
 * Resolves an image URL for display in UI (<img> tags, backgrounds).
 * Does NOT set attachment Content-Disposition, preventing browser ORB (net::ERR_BLOCKED_BY_ORB) errors.
 */
export async function ToImageUrl(file) {
    if (!file || typeof file !== "string") {
        return "";
    }

    if (file.startsWith("data:") || file.startsWith("http://") || file.startsWith("https://")) {
        return file;
    }

    return getPresignedDownloadUrl(file);
}

/**
 * Resolves a file URL for download or general use.
 * If filename is provided, it triggers download attachment headers.
 */
export async function ToHref(file, filename) {
    if (!file || typeof file !== "string") {
        return "";
    }

    if (file.startsWith("data:") || file.startsWith("http://") || file.startsWith("https://")) {
        return file;
    }

    return getPresignedDownloadUrl(file, filename || undefined);
};

export async function requestPresignedUploadUrl({ filename, contentType }) {
    return requestJson(`${FILES_PATH}/upload-url`, {
        method: 'POST',
        body: JSON.stringify({ filename, contentType }),
    });
}

export async function requestPresignedDownloadUrl({ fileKey, downloadFilename }) {
    const payload = { fileKey };
    if (downloadFilename) {
        payload.downloadFilename = downloadFilename;
    }
    return requestJson(`${FILES_PATH}/download-url`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function uploadFileToPresignedUrl(uploadUrl, file, contentType) {
    const resolvedType = contentType || file.type || getMimeTypeFromFilename(file.name) || 'application/octet-stream';
    const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': resolvedType,
        },
        body: file,
    });

    if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
    }

    return response;
}

/**
 * Converts image files (JPEG, PNG, GIF, BMP, etc.) to WebP format in the browser before upload.
 * Non-image files (PDFs, docs) pass through unchanged.
 */
export async function convertImageToWebP(file, quality = 0.85) {
    if (!file || !(file instanceof File)) {
        return file;
    }

    const isImage = (file.type && file.type.startsWith('image/')) ||
        /\.(jpe?g|png|gif|bmp|avif|webp)$/i.test(file.name);

    if (!isImage) {
        return file;
    }

    if (file.type === 'image/webp' && file.name.toLowerCase().endsWith('.webp')) {
        return file;
    }

    return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return resolve(file);
            }

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        return resolve(file);
                    }
                    const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
                    const webpFile = new File([blob], newFileName, {
                        type: 'image/webp',
                        lastModified: Date.now(),
                    });
                    resolve(webpFile);
                },
                'image/webp',
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(file);
        };

        img.src = objectUrl;
    });
}

export async function uploadFileToS3(file) {
    // Automatically convert uploaded images (PNG, JPEG, etc.) to optimized WebP format
    const targetFile = await convertImageToWebP(file);
    const contentType = targetFile.type || getMimeTypeFromFilename(targetFile.name) || 'application/octet-stream';

    const uploadDetails = await requestPresignedUploadUrl({
        filename: targetFile.name,
        contentType: contentType,
    });

    await uploadFileToPresignedUrl(uploadDetails.uploadUrl, targetFile, contentType);

    return uploadDetails;
}

const presignedUrlCache = new Map();
const presignedInFlight = new Map();
const PRESIGNED_TTL_MS = 10 * 60 * 1000; // Default 10 minutes fallback

/**
 * Parses the actual expiration timestamp from AWS/Supabase S3 presigned URL parameters.
 */
function getUrlExpiryTimestamp(url) {
    if (!url || typeof url !== 'string') return 0;
    try {
        const u = new URL(url);
        const amzDate = u.searchParams.get('X-Amz-Date') || u.searchParams.get('x-amz-date');
        const amzExpires = parseInt(u.searchParams.get('X-Amz-Expires') || u.searchParams.get('x-amz-expires') || '900', 10);
        if (amzDate && amzDate.length >= 15) {
            const year = parseInt(amzDate.slice(0, 4), 10);
            const month = parseInt(amzDate.slice(4, 6), 10) - 1;
            const day = parseInt(amzDate.slice(6, 8), 10);
            const hour = parseInt(amzDate.slice(9, 11), 10);
            const min = parseInt(amzDate.slice(11, 13), 10);
            const sec = parseInt(amzDate.slice(13, 15), 10);
            const createdMs = Date.UTC(year, month, day, hour, min, sec);
            if (!isNaN(createdMs)) {
                return createdMs + (amzExpires * 1000);
            }
        }
    } catch (e) {}
    return Date.now() + PRESIGNED_TTL_MS;
}

function isCachedUrlValid(cachedObj) {
    if (!cachedObj || !cachedObj.url) return false;
    const now = Date.now();
    const expiryMs = cachedObj.expiresAt || (cachedObj.timestamp + PRESIGNED_TTL_MS);
    // Ensure at least 60 seconds are left before S3 rejects with 403
    return (expiryMs - now) > 60000;
}

function getStoredS3Url(cacheKey) {
    try {
        const raw = sessionStorage.getItem(`s3_cache_${cacheKey}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (isCachedUrlValid(parsed)) {
            return parsed.url;
        }
        // Purge expired entry
        sessionStorage.removeItem(`s3_cache_${cacheKey}`);
    } catch (e) {}
    return null;
}

function setStoredS3Url(cacheKey, url) {
    try {
        const expiresAt = getUrlExpiryTimestamp(url);
        sessionStorage.setItem(`s3_cache_${cacheKey}`, JSON.stringify({
            timestamp: Date.now(),
            expiresAt,
            url,
        }));
    } catch (e) {}
}

export function evictS3UrlCache(fileKey) {
    if (!fileKey) return;
    try {
        for (const key of presignedUrlCache.keys()) {
            if (key.includes(fileKey)) {
                presignedUrlCache.delete(key);
            }
        }
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
            const k = sessionStorage.key(i);
            if (k && k.includes(fileKey)) {
                sessionStorage.removeItem(k);
            }
        }
    } catch (e) {}
}

export async function refreshS3ImageUrl(fileKey) {
    if (!fileKey) return '';
    evictS3UrlCache(fileKey);
    return getPresignedDownloadUrl(fileKey, undefined, { forceFresh: true });
}

export async function getPresignedDownloadUrl(fileKey, downloadFilename, options = {}) {
    if (!fileKey) return '';

    const cacheKey = `${fileKey}:${downloadFilename || ''}`;
    const now = Date.now();
    const forceFresh = options.forceFresh === true;

    if (!forceFresh) {
        // 1. Check memory cache
        const cached = presignedUrlCache.get(cacheKey);
        if (cached && isCachedUrlValid(cached)) {
            return cached.url;
        }

        // 2. Check sessionStorage
        const stored = getStoredS3Url(cacheKey);
        if (stored) {
            const expiresAt = getUrlExpiryTimestamp(stored);
            presignedUrlCache.set(cacheKey, { timestamp: now, expiresAt, url: stored });
            return stored;
        }
    }

    // 3. Check in-flight requests
    if (presignedInFlight.has(cacheKey)) {
        return presignedInFlight.get(cacheKey);
    }

    const promise = (async () => {
        try {
            const details = await requestPresignedDownloadUrl({ fileKey, downloadFilename });
            const downloadUrl = details?.downloadUrl || '';
            if (downloadUrl) {
                const expiresAt = getUrlExpiryTimestamp(downloadUrl);
                presignedUrlCache.set(cacheKey, { timestamp: Date.now(), expiresAt, url: downloadUrl });
                setStoredS3Url(cacheKey, downloadUrl);
            }
            return downloadUrl;
        } finally {
            presignedInFlight.delete(cacheKey);
        }
    })();

    presignedInFlight.set(cacheKey, promise);
    return promise;
}

export function getS3FileUrl(fileKey) {
    if (!fileKey) {
        return '';
    }

    if (fileKey.startsWith('http://') || fileKey.startsWith('https://') || fileKey.startsWith('data:')) {
        return fileKey;
    }

    const rawS3Url = import.meta.env.VITE_S3_PUBLIC_BASE_URL || 'https://d3k6lzr995rwjd.cloudfront.net';
    const baseUrl = typeof rawS3Url === 'string'
        ? rawS3Url.trim().replace(/^["']|["']$/g, '').replace(/\/+$/, '')
        : '';
    if (!baseUrl) {
        return '';
    }

    return `${baseUrl}/${fileKey.replace(/^\/+/, '')}`;
}