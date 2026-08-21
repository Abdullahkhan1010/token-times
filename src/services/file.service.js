import { requestJson } from './api';

const FILES_PATH = '/files';


export async function ToHref(file, filename = "download") {

    if (!file || typeof file !== "string") {
        return "";
    }

    if (file.startsWith("data:") || file.startsWith("http://") || file.startsWith("https://")) {
        return file;
    }

    return getPresignedDownloadUrl(file, filename);
};

export async function requestPresignedUploadUrl({ filename, contentType }) {
    return requestJson(`${FILES_PATH}/upload-url`, {
        method: 'POST',
        body: JSON.stringify({ filename, contentType }),
    });
}

export async function requestPresignedDownloadUrl({ fileKey, downloadFilename }) {
    return requestJson(`${FILES_PATH}/download-url`, {
        method: 'POST',
        body: JSON.stringify({ fileKey, downloadFilename }),
    });
}

export async function uploadFileToPresignedUrl(uploadUrl, file) {
    const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type || 'application/octet-stream',
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
    if (!file || !(file instanceof File) || !file.type.startsWith('image/') || file.type === 'image/webp') {
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

    const uploadDetails = await requestPresignedUploadUrl({
        filename: targetFile.name,
        contentType: targetFile.type || 'application/octet-stream',
    });

    await uploadFileToPresignedUrl(uploadDetails.uploadUrl, targetFile);

    return uploadDetails;
}

const presignedUrlCache = new Map();
const presignedInFlight = new Map();
const PRESIGNED_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getStoredS3Url(cacheKey) {
    try {
        const raw = sessionStorage.getItem(`s3_cache_${cacheKey}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.timestamp < PRESIGNED_TTL_MS) {
            return parsed.url;
        }
    } catch (e) {}
    return null;
}

function setStoredS3Url(cacheKey, url) {
    try {
        sessionStorage.setItem(`s3_cache_${cacheKey}`, JSON.stringify({
            timestamp: Date.now(),
            url,
        }));
    } catch (e) {}
}

export async function getPresignedDownloadUrl(fileKey, downloadFilename) {
    if (!fileKey) return '';

    const cacheKey = `${fileKey}:${downloadFilename || ''}`;
    const now = Date.now();

    // 1. Check memory cache
    const cached = presignedUrlCache.get(cacheKey);
    if (cached && (now - cached.timestamp < PRESIGNED_TTL_MS)) {
        return cached.url;
    }

    // 2. Check sessionStorage
    const stored = getStoredS3Url(cacheKey);
    if (stored) {
        presignedUrlCache.set(cacheKey, { timestamp: now, url: stored });
        return stored;
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
                presignedUrlCache.set(cacheKey, { timestamp: Date.now(), url: downloadUrl });
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