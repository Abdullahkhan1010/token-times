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

export async function uploadFileToS3(file) {
    const uploadDetails = await requestPresignedUploadUrl({
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
    });

    await uploadFileToPresignedUrl(uploadDetails.uploadUrl, file);

    return uploadDetails;
}

export async function getPresignedDownloadUrl(fileKey, downloadFilename) {
    const details = await requestPresignedDownloadUrl({ fileKey, downloadFilename });
    return details.downloadUrl || '';
}

export function getS3FileUrl(fileKey) {
    if (!fileKey) {
        return '';
    }

    if (fileKey.startsWith('http://') || fileKey.startsWith('https://') || fileKey.startsWith('data:')) {
        return fileKey;
    }

    const baseUrl = (import.meta.env.VITE_S3_PUBLIC_BASE_URL || '').replace(/\/$/, '');
    if (!baseUrl) {
        return '';
    }

    return `${baseUrl}/${fileKey.replace(/^\/+/, '')}`;
}